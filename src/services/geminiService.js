// src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import DOMPurify              from 'dompurify';

// ----------------------------------------------------------------
// Rate Limiter — Token Bucket (max 20 requests/minute)
// ----------------------------------------------------------------
class RateLimiter {
  constructor(maxRequests = 20, windowMs = 60_000) {
    this.maxRequests = maxRequests;
    this.windowMs    = windowMs;
    this.requests    = [];
  }

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    if (this.requests.length >= this.maxRequests) return false;
    this.requests.push(now);
    return true;
  }

  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }

  getResetTime() {
    if (this.requests.length === 0) return 0;
    const oldest = Math.min(...this.requests);
    return Math.ceil((oldest + this.windowMs - Date.now()) / 1000);
  }
}

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

function getModel() {
  if (!model) {
    const apiKey = import.meta?.env?.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY not configured. Please add it to your .env file.');
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model:          'gemini-1.5-flash',
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
function sanitizeInput(text) {
  if (typeof window !== 'undefined' && DOMPurify) {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }
  // Fallback for non-browser env
  return text.replace(/<[^>]*>/g, '').substring(0, 2000);
}

// ----------------------------------------------------------------
// Convert our message format to Gemini history format
// ----------------------------------------------------------------
function toGeminiHistory(messages) {
  return messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role:  m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
}

// ----------------------------------------------------------------
// Main send function
// ----------------------------------------------------------------
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
export async function explainTimelineStage(stageName, language = 'en') {
  if (!rateLimiter.canMakeRequest()) {
    throw new Error('Rate limit reached');
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
    throw new Error('Failed to get AI explanation');
  }
}

export default { sendMessage, explainTimelineStage, rateLimiter };
