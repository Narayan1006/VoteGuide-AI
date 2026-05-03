# How I Built VoteGuide AI — An Election Education Assistant for Google PromptWars

*By Narayan Singh | May 2026 | #GooglePromptWars #GeminiAPI #React #Firebase*

---

## The Problem

India has over 960 million registered voters — yet election literacy remains shockingly low, especially among first-time voters. I've personally seen friends scroll past voter registration deadlines without knowing what Form 6 is, or walk into a polling booth confused about NOTA. The information exists, but it's scattered across dense government websites in bureaucratic language that discourages engagement.

The core problem isn't data availability — it's accessibility. A 22-year-old first-time voter shouldn't need to read a 40-page ECI circular to understand how to cast their vote correctly. I wanted to build something that made this genuinely easy: conversational, bilingual, and interactive.

---

## My Solution: VoteGuide AI

VoteGuide AI is an interactive election education platform built for Indian citizens. At its core is a **Gemini 1.5 Flash-powered chat assistant** that answers election questions in both Hindi and English — because for millions of voters, Hindi is more comfortable than English.

Beyond the chat, I built five interconnected features: an **interactive 6-stage election timeline** with AI-powered explanations for each stage, a **voter eligibility checker** that validates age and citizenship in real time, a **Google Maps booth locator** covering 10 major Indian cities with real constituency names like Chandni Chowk and Koramangala, a **20-question knowledge quiz** with a Firebase-backed leaderboard, and a full **accessibility bar** with font scaling and high-contrast mode for older or visually impaired voters.

The entire app is live at **https://voteguide-ai-3575f.web.app**.

---

## Tech Architecture

Here's how the stack fits together:

```
Frontend:   React 18 + Vite 8 (Rolldown) + Tailwind CSS
AI Layer:   Google Gemini 1.5 Flash API (via @google/generative-ai SDK)
Backend:    Firebase Cloud Functions (Node.js 18) — Gemini API proxy
Database:   Firebase Firestore (quiz scores, leaderboard, chat history)
Auth:       Firebase Authentication — Google Sign-In
Maps:       Google Maps JavaScript API (@react-google-maps/api)
Hosting:    Firebase Hosting (with CSP security headers)
Testing:    Jest + React Testing Library (68 tests, 6 suites)
```

**Why this stack?** All Google services integrate naturally together — Firebase Auth tokens work seamlessly with Firestore security rules, and having the Gemini API behind a Cloud Function means the API key never touches the client in production.

For the AI system prompt, I invested significant time in prompt engineering. The VoteGuide system prompt instructs Gemini to detect whether the user is writing in Hindi or English and respond in kind, stay strictly within election topics, use bullet points and emojis to keep responses scannable, and cap responses at 300 words for readability. This single well-crafted prompt replaced what would have been hundreds of lines of conditional logic.

The Tailwind theme uses a tricolor palette — saffron (`#FF6B35`), white, and navy (`#0A1628`) — reflecting the Indian national flag. Every color choice was intentional, not decorative.

**Production bundle breakdown:**
- Firebase SDK: 366 kB (111 kB gzip)
- App code: 359 kB (114 kB gzip)
- Google Maps: 156 kB (34 kB gzip)
- Framer Motion: 124 kB (40 kB gzip)
- **Total: ~313 kB gzip** — reasonable for a feature-rich civic app

---

## The Biggest Technical Challenge: Jest + Vite ESM Compatibility

This one took me longer than I'd like to admit.

My project uses `"type": "module"` in `package.json` for ES module support, which Vite loves. But Jest — even in 2026 — still prefers CommonJS by default. The moment I added Firebase SDK as a dependency, Jest's Babel transform started trying to parse TypeScript source files deep inside `node_modules/@firebase/` and `@babel/traverse` would throw a recursion error mid-compilation.

The fix required three coordinated changes:

**1. Rename all config files to `.cjs`:**
```js
// jest.config.cjs (not .js)
module.exports = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.[jt]sx?$': '<rootDir>/jest-transform.cjs' },
  ...
}
```

**2. Create a custom transform (`jest-transform.cjs`) that preprocesses `import.meta.env` before Babel sees it:**
```js
module.exports = {
  process(sourceText, sourcePath, options) {
    const preprocessed = sourceText
      .replace(/import\.meta\.env\.[A-Z0-9_]+/g, 'undefined')
      .replace(/import\.meta\.env/g, '{}');
    return babelTransform.process(preprocessed, sourcePath, options);
  }
};
```

**3. Map all heavy SDK imports to CJS mock files** via `moduleNameMapper`:
```js
'^firebase/(.*)$': '<rootDir>/src/__mocks__/firebaseMock.cjs',
'^@google/generative-ai$': '<rootDir>/src/__mocks__/geminiMock.cjs',
```

Once all three pieces were in place, the test suite went from crashing on startup to **68/68 passing with exit code 0**. The lesson: in ESM/CJS hybrid projects, you need to control the transform pipeline explicitly — don't rely on defaults.

---

## Key Learnings

**Prompt engineering is leverage.** The 70-line system prompt I wrote for VoteGuide's Gemini assistant handles language detection, topic scoping, formatting, and tone — work that would have taken days to build manually. Writing one great prompt replaced hundreds of lines of conditional logic.

**Google services compound well.** Firebase Auth, Firestore, Cloud Functions, and Analytics share a project context, so integration friction is minimal. Adding Google Sign-In took one hook (`useAuth.js`, ~80 lines) and the Firestore rules enforced per-user data isolation automatically.

**Accessibility is an evaluation multiplier.** Building WCAG 2.1 AA compliance from day one — ARIA labels, keyboard navigation, font scaling, high contrast — isn't just the right thing to do. In hackathon judging criteria, accessibility scores often carry disproportionate weight. The `AccessibilityBar` component achieved **100% test coverage** because it was designed to be testable from the start.

---

## What I'd Build Next

- **Real ECI API integration** — when the Election Commission opens a voter roll lookup API, the booth locator would show actual registered booth data instead of mock data
- **Push notifications** — Firebase Cloud Messaging for election date reminders
- **Offline mode** — Service Worker caching so the voter guide works in low-connectivity areas (critical for rural India)
- **More regional languages** — Tamil, Telugu, Bengali via Gemini's multilingual capabilities

---

## Conclusion

VoteGuide AI started as a hackathon project and turned into something I genuinely believe could help real voters. The combination of Gemini's conversational AI, Firebase's real-time infrastructure, and Google Maps' location data created an experience that would have required a large team and months of work just a few years ago.

If it helps even a handful of first-time voters understand their rights and cast their vote with confidence, it's worth every debugging session.

---

🌐 **Live App:** https://voteguide-ai-3575f.web.app  
💻 **GitHub:** https://github.com/Narayan1006/VoteGuide-AI  
🛠️ **Stack:** React 18 · Gemini 1.5 Flash · Firebase · Google Maps · Jest

*Built for Google PromptWars Hackathon | May 2026*
