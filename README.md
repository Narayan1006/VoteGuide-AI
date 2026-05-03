# VoteGuide AI 🗳️

> India's AI-powered Election Process Education Assistant — built with React 18, Vite, Tailwind CSS, Firebase, and Google Gemini 1.5 Flash.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-voteguide--ai--3575f.web.app-FF6B35?style=for-the-badge)](https://voteguide-ai-3575f.web.app)
[![Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-orange)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Tests-68%2F68%20Passing-brightgreen)](/)

---

## 🌐 Live Demo

**https://voteguide-ai-3575f.web.app**

---

## 🌟 Features

| Feature | Description |
|---|---|
| 🤖 **AI Chat Assistant** | Gemini 1.5 Flash powered chat — Hindi + English support |
| 📅 **Election Timeline** | 6-stage animated timeline with AI-powered explanations |
| 📖 **Voter Guide** | Eligibility checker, registration steps, EVM diagram, NOTA, voting day checklist |
| 📍 **Booth Locator** | Google Maps with polling booth markers for 10 Indian cities |
| 🧠 **Knowledge Quiz** | 20-question bank, 5 MCQs per session, Firebase leaderboard |
| ♿ **Accessibility** | WCAG 2.1 AA — font size controls, high contrast, full keyboard navigation, ARIA |
| 🔐 **Security** | Google Sign-In, Firestore rules, rate limiting, CSP headers, DOMPurify |

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Narayan1006/VoteGuide-AI.git
cd VoteGuide-AI
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Fill in your API keys:
# - VITE_GEMINI_API_KEY      → https://aistudio.google.com/app/apikey
# - VITE_GOOGLE_MAPS_API_KEY → https://console.cloud.google.com/apis/credentials
# - VITE_FIREBASE_*          → https://console.firebase.google.com/
```

### 3. Start Development Server
```bash
npm run dev
# Open http://localhost:5173
```

### 4. Run Tests
```bash
npm test                    # Run all 68 tests
npm run test:coverage       # Run with coverage report
```

### 5. Build for Production
```bash
npm run build               # Creates dist/ (481 modules, ~313 kB gzip)
```

### 6. Deploy to Firebase
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
# Live at: https://voteguide-ai-3575f.web.app
```

---

## 🏗️ Architecture

```
VoteGuide-AI/
├── src/
│   ├── components/
│   │   ├── AccessibilityBar/   # Font size, high contrast, skip link
│   │   ├── ChatAssistant/      # Gemini chat widget (floating)
│   │   ├── ElectionTimeline/   # 6-stage animated timeline
│   │   ├── VoterGuide/         # Tabs: Eligibility, Register, EVM, NOTA, Checklist
│   │   ├── BoothLocator/       # Google Maps + mock booth data (10 cities)
│   │   ├── Quiz/               # MCQ quiz + leaderboard
│   │   └── common/             # Navbar, ErrorBoundary, LoadingSkeleton
│   ├── hooks/
│   │   ├── useGemini.js        # Chat state + Firestore history
│   │   ├── useFirestore.js     # Quiz scores, leaderboard, streaks
│   │   ├── useAuth.js          # Google Sign-In
│   │   └── useAccessibility.js # Font size + contrast
│   ├── services/
│   │   ├── geminiService.js    # Gemini 1.5 Flash + rate limiter (20/min)
│   │   └── firebaseConfig.js   # Firebase initialization
│   ├── data/
│   │   ├── quizQuestions.js    # 20 election MCQs
│   │   ├── boothData.js        # Mock booth data (10 Indian cities)
│   │   └── timelineData.js     # 6 election stage definitions
│   ├── pages/                  # React Router v6 page wrappers
│   └── __tests__/              # Jest + RTL (68 tests)
├── functions/
│   └── index.js                # Firebase Cloud Functions (Gemini proxy)
├── firestore.rules             # Per-user Firestore security rules
├── firebase.json               # Hosting + CSP security headers
├── jest.config.cjs             # Jest config (CommonJS)
├── jest-transform.cjs          # Custom transform for import.meta.env
└── .env.example                # Environment variables template
```

---

## 🔑 Environment Variables

| Variable | Source |
|---|---|
| `VITE_GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `VITE_GOOGLE_MAPS_API_KEY` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `VITE_FIREBASE_API_KEY` | [Firebase Console](https://console.firebase.google.com/) → Project Settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Console |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Console |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Console |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console |
| `VITE_FIREBASE_APP_ID` | Firebase Console |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Console |

---

## 🧪 Testing

### Results — v1.0.0

| Test Suite | Tests | Status |
|---|---|---|
| `AccessibilityBar.test.jsx` | 10 | ✅ PASS |
| `ElectionTimeline.test.jsx` | 8 | ✅ PASS |
| `Quiz.test.jsx` | 16 | ✅ PASS |
| `BoothLocator.test.jsx` | 12 | ✅ PASS |
| `EligibilityChecker.test.jsx` | 8 | ✅ PASS |
| `ChatAssistant.test.jsx` | 14 | ✅ PASS |
| **Total** | **68** | **✅ ALL PASS** |

### Coverage Highlights

| Component | Statements | Functions | Lines |
|---|---|---|---|
| AccessibilityBar | 100% | 100% | 100% |
| ElectionTimeline | 96.7% | 100% | 96.4% |
| QuizQuestion | 94.1% | 100% | 100% |
| QuizResult | 100% | 100% | 100% |
| EligibilityChecker | 84.6% | 87.5% | 82.9% |

---

## 🔐 Security

- ✅ All API keys in `.env` (never committed)
- ✅ Input sanitized with DOMPurify (XSS prevention)
- ✅ Rate limiting: 20 AI requests/minute per user
- ✅ Firestore rules: users read/write own data only
- ✅ CSP headers via `firebase.json`
- ✅ Google Sign-In (OAuth 2.0)
- ✅ `X-Frame-Options: SAMEORIGIN`
- ✅ `X-Content-Type-Options: nosniff`

---

## ♿ Accessibility (WCAG 2.1 AA)

- Skip to main content link
- Font size controls (A- / A / A+)
- High contrast mode toggle
- Full keyboard navigation (Tab, Enter, Escape)
- ARIA labels on all interactive elements
- `aria-live` regions for dynamic content
- Visible focus indicators (saffron ring)
- Color contrast ratio > 4.5:1

---

## 📦 Build Output

| Bundle | Size | Gzip |
|---|---|---|
| `index.css` | 36.01 kB | 7.11 kB |
| `gemini-*.js` | 18.02 kB | 5.46 kB |
| `motion-*.js` | 124.38 kB | 40.57 kB |
| `maps-*.js` | 156.11 kB | 34.28 kB |
| `index-*.js` | 359.46 kB | 114.01 kB |
| `firebase-*.js` | 366.06 kB | 111.68 kB |
| **Total (gzip)** | | **~313 kB** |

---

## 📱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 8 (Rolldown), Tailwind CSS 3 |
| **AI** | Google Gemini 1.5 Flash |
| **Backend** | Firebase Cloud Functions (Node.js 18) |
| **Database** | Firebase Firestore |
| **Auth** | Firebase Auth — Google Sign-In |
| **Maps** | Google Maps JavaScript API |
| **Analytics** | Firebase Analytics |
| **Animations** | Framer Motion |
| **Testing** | Jest + React Testing Library |
| **Deployment** | Firebase Hosting |

---

## 🇮🇳 About VoteGuide AI

VoteGuide AI was built to make Indian election information accessible to every citizen. With support for Hindi and English, interactive learning tools, and AI-powered explanations, it aims to increase voter awareness and participation across India.

**Topics covered:**
- Voter registration & Voter ID card (Form 6 → e-EPIC)
- Election Commission of India (ECI) structure
- How EVM + VVPAT works
- NOTA — what it is and how to use it
- Model Code of Conduct
- Step-by-step voting day guide
- How to find your polling booth

*Jai Hind! 🇮🇳*

---

## 📄 License

MIT © 2026 Narayan Singh
