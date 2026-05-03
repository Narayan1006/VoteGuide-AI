// src/services/geminiService.js
/**
 * @fileoverview Gemini 1.5 Flash API client for VoteGuide AI.
 * Provides rate-limited, sanitized access to the Gemini generative AI model.
 * Exposes chat messaging and single-prompt timeline explanation functions.
 *
 * @module geminiService
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import DOMPurify              from 'dompurify';

// ----------------------------------------------------------------
// Rate Limiter — Token Bucket (max 20 requests/minute)
// ----------------------------------------------------------------
/**
 * Token-bucket rate limiter that enforces a maximum number of
 * API requests within a rolling time window.
 */
class RateLimiter {
  /**
   * @param {number} maxRequests - Maximum allowed requests per window.
   * @param {number} windowMs    - Rolling window size in milliseconds.
   */
  constructor(maxRequests = 20, windowMs = 60_000) {
    this.maxRequests = maxRequests;
    this.windowMs    = windowMs;
    this.requests    = [];
  }

  /**
   * Checks whether a new request is allowed under the current rate limit.
   * Records the request timestamp if allowed.
   *
   * @returns {boolean} True if the request is permitted.
   */
  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    if (this.requests.length >= this.maxRequests) return false;
    this.requests.push(now);
    return true;
  }

  /**
   * Returns the number of remaining requests in the current window.
   *
   * @returns {number} Remaining request count (0 or more).
   */
  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }

  /**
   * Returns the number of seconds until the rate limit window resets.
   *
   * @returns {number} Seconds until reset, or 0 if no requests recorded.
   */
  getResetTime() {
    if (this.requests.length === 0) return 0;
    const oldest = Math.min(...this.requests);
    return Math.ceil((oldest + this.windowMs - Date.now()) / 1000);
  }
}

/** @type {RateLimiter} Shared rate limiter instance — max 20 requests/minute */
export const rateLimiter = new RateLimiter(
  parseInt(import.meta?.env?.VITE_GEMINI_RATE_LIMIT || '20'),
  60_000
);

// ----------------------------------------------------------------
// System Prompt
// ----------------------------------------------------------------
const SYSTEM_PROMPT = `You are VoteGuide, an expert election education assistant for Indian citizens.

Your role is to help users understand:
- Voter registration process and voter ID card
- Election Commission of India (ECI) process and structure
- Election timeline and schedule
- Step-by-step voting process on election day
- NOTA (None of the Above) — what it is and how to use it
- EVM (Electronic Voting Machine) — how it works, is it secure?
- Model Code of Conduct — what is it, when does it apply?
- Results process — how votes are counted and results declared
- Polling booths — how to find them
- Eligibility criteria for voting

Guidelines:
- Answer in simple, friendly language
- Use bullet points and relevant emojis to make content engaging
- If the user writes in Hindi/Devanagari script, respond primarily in Hindi
- If user writes in English, respond in English
- Be conversational and encouraging — voting is a right and duty
- Keep responses concise (under 300 words) unless user asks for details
- Do NOT discuss political parties, candidates, or make political recommendations
- Always encourage civic participation
- Format important terms in **bold**

If asked about something unrelated to elections or voting, politely redirect:
"मैं चुनाव और मतदान से जुड़े सवालों का जवाब देता हूँ / I'm specialized in election and voting topics. Let me help you with that!"`;

// ----------------------------------------------------------------
// Gemini Client
// ----------------------------------------------------------------
let genAI = null;
let model = null;

/**
 * Returns the lazily-initialised Gemini model instance.
 * Validates the API key before constructing the client.
 *
 * @returns {import('@google/generative-ai').GenerativeModel} The configured Gemini model.
 * @throws {Error} If VITE_GEMINI_API_KEY is missing or not yet configured.
 */
function getModel() {
  if (!model) {
    const apiKey = import.meta?.env?.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error(
        'VITE_GEMINI_API_KEY is not configured. ' +
        'Add your Gemini API key to the .env file. ' +
        'Get a free key at https://aistudio.google.com/app/apikey'
      );
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model:             'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature:     0.7,
        topP:            0.95,
        topK:            40,
      },
    });
  }
  return model;
}

// ----------------------------------------------------------------
// Sanitize user input to prevent XSS
// ----------------------------------------------------------------
/**
 * Sanitizes user-provided text to prevent XSS injection.
 * Falls back to a regex-based approach in non-browser environments (e.g. tests).
 *
 * @param {string} text - Raw user input.
 * @returns {string} Sanitized plain-text string, capped at 2000 characters.
 */
function sanitizeInput(text) {
  if (typeof window !== 'undefined' && DOMPurify) {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }
  return text.replace(/<[^>]*>/g, '').substring(0, 2000);
}

/**
 * Converts the internal message format to the Gemini API history format.
 *
 * @param {Array<{role: string, content: string}>} messages - Internal message array.
 * @returns {Array<{role: 'user'|'model', parts: [{text: string}]}>} Gemini history format.
 */
function toGeminiHistory(messages) {
  return messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role:  m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
}

/**
 * Sends a user message to Gemini with full conversation history and returns the AI response.
 *
 * @param {Array<{role: string, content: string}>} history - Previous messages for context.
 * @param {string} userMessage - The user's current message.
 * @param {'en'|'hi'} [language='en'] - Preferred response language.
 * @returns {Promise<{content: string, role: 'assistant', timestamp: string}>} AI response object.
 * @throws {Error} On rate limit, invalid API key, safety block, or network failure.
 */
export async function sendMessage(history = [], userMessage, language = 'en') {
  // Rate limiting check
  if (!rateLimiter.canMakeRequest()) {
    const resetIn = rateLimiter.getResetTime();
    throw new Error(
      language === 'hi'
        ? `बहुत अधिक अनुरोध। ${resetIn} सेकंड बाद पुनः प्रयास करें।`
        : `Too many requests. Please wait ${resetIn} seconds before trying again.`
    );
  }

  // Sanitize input
  const sanitized = sanitizeInput(userMessage);
  if (!sanitized.trim()) {
    throw new Error('Empty message');
  }

  try {
    const geminiModel = getModel();

    // Build chat history (exclude last user message — that's the new one)
    const chatHistory = toGeminiHistory(history);

    // Start chat with history
    const chat = geminiModel.startChat({ history: chatHistory });

    // Language hint in message if Hindi
    const messageToSend = language === 'hi'
      ? `[User prefers Hindi] ${sanitized}`
      : sanitized;

    const result   = await chat.sendMessage(messageToSend);
    const response = await result.response;
    const text     = response.text();

    return {
      content:   text,
      role:      'assistant',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    if (error.message?.includes('API_KEY')) {
      throw new Error('Invalid API key. Please check your Gemini API configuration.');
    }
    if (error.message?.includes('SAFETY')) {
      throw new Error(
        language === 'hi'
          ? 'यह संदेश नहीं भेजा जा सकता। कृपया दूसरा प्रश्न पूछें।'
          : 'This message could not be processed. Please rephrase your question.'
      );
    }
    throw error;
  }
}

// ----------------------------------------------------------------
// Get a stage explanation from AI (for Timeline modals)
// ----------------------------------------------------------------
/**
 * Generates a concise AI explanation for a specific election timeline stage.
 * Used by the ElectionTimeline component's stage detail modals.
 *
 * @param {string} stageName - Name of the election stage (e.g. 'Election Announcement').
 * @param {'en'|'hi'} [language='en'] - Language for the explanation.
 * @returns {Promise<string>} Formatted markdown explanation text.
 * @throws {Error} If rate limited or the API call fails.
 */
export async function explainTimelineStage(stageName, language = 'en') {
  if (!rateLimiter.canMakeRequest()) {
    throw new Error('Rate limit reached. Please wait before requesting another explanation.');
  }

  try {
    const geminiModel = getModel();
    const prompt = language === 'hi'
      ? `चुनाव प्रक्रिया में "${stageName}" चरण को सरल हिंदी में समझाइए। बुलेट पॉइंट्स और इमोजी का उपयोग करें। 200 शब्दों से अधिक नहीं।`
      : `Explain the "${stageName}" stage in the Indian election process in simple English. Use bullet points and emojis. Keep it under 200 words.`;

    const result   = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(`Failed to get AI explanation for "${stageName}": ${error.message}`);
  }
}

export default { sendMessage, explainTimelineStage, rateLimiter };
