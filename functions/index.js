// functions/index.js
// Firebase Cloud Functions — VoteGuide AI
// Gemini API proxy with rate limiting

const functions = require('firebase-functions');
const admin     = require('firebase-admin');
const cors      = require('cors')({ origin: true });
const { GoogleGenerativeAI } = require('@google/generative-ai');

admin.initializeApp();

// ── Rate limiter using Firestore ──────────────────────────────────
const RATE_LIMIT_MAX = 20;  // requests
const RATE_LIMIT_WIN = 60;  // seconds

async function checkRateLimit(userId) {
  const db  = admin.firestore();
  const ref = db.collection('rateLimits').doc(userId);

  return db.runTransaction(async (tx) => {
    const doc  = await tx.get(ref);
    const now  = Date.now();
    const data = doc.exists ? doc.data() : { requests: [], windowStart: now };

    // Filter requests within window
    const windowMs = RATE_LIMIT_WIN * 1000;
    const recent   = (data.requests || []).filter(t => now - t < windowMs);

    if (recent.length >= RATE_LIMIT_MAX) {
      const oldest  = Math.min(...recent);
      const resetIn = Math.ceil((oldest + windowMs - now) / 1000);
      throw new Error(`RATE_LIMIT:${resetIn}`);
    }

    recent.push(now);
    tx.set(ref, { requests: recent, windowStart: now }, { merge: true });
    return RATE_LIMIT_MAX - recent.length;
  });
}

// ── Gemini Chat Proxy ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are VoteGuide, an expert election education assistant for Indian citizens.
Help users understand voter registration, ECI process, election timeline, voting steps, NOTA, EVM, Model Code of Conduct, and results process.
Answer in simple Hindi or English based on user preference. Be conversational, friendly, and use bullet points and emojis.
Do NOT discuss political parties or make political recommendations.`;

exports.geminiChat = functions
  .region('asia-south1')
  .runWith({ memory: '256MB', timeoutSeconds: 60 })
  .https.onCall(async (data, context) => {
    // Require authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }

    const { message, history = [], language = 'en' } = data;

    if (!message || typeof message !== 'string' || message.length > 2000) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid message.');
    }

    // Check rate limit
    try {
      await checkRateLimit(context.auth.uid);
    } catch (e) {
      if (e.message.startsWith('RATE_LIMIT:')) {
        const secs = e.message.split(':')[1];
        throw new functions.https.HttpsError(
          'resource-exhausted',
          `Too many requests. Please wait ${secs} seconds.`
        );
      }
      throw e;
    }

    // Get API key from Firebase config
    const apiKey = functions.config().gemini?.api_key || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new functions.https.HttpsError('internal', 'Gemini API key not configured.');
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
      });

      const geminiHistory = history
        .slice(-10)
        .filter(m => m.role !== 'system')
        .map(m => ({
          role:  m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

      const chat     = model.startChat({ history: geminiHistory });
      const result   = await chat.sendMessage(
        language === 'hi' ? `[Hindi preferred] ${message}` : message
      );
      const response = await result.response;

      return {
        content:   response.text(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Gemini error:', error);
      throw new functions.https.HttpsError('internal', 'AI service error. Please try again.');
    }
  });

// ── Health check (HTTP) ───────────────────────────────────────────
exports.health = functions
  .region('asia-south1')
  .https.onRequest((req, res) => {
    cors(req, res, () => {
      res.json({ status: 'ok', service: 'VoteGuide AI Functions', timestamp: new Date().toISOString() });
    });
  });
