# VoteGuide AI 🗳️

> India's AI-powered Election Process Education Assistant — built with React 18, Vite, Tailwind CSS, Firebase, and Google Gemini 1.5 Flash.

[![Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-orange)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)

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
git clone <your-repo>
cd voteguide-ai
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Fill in your API keys:
# - VITE_GEMINI_API_KEY (from Google AI Studio)
# - VITE_GOOGLE_MAPS_API_KEY (from Google Cloud Console)
# - VITE_FIREBASE_* (from Firebase Console)
```

### 3. Start Development Server
```bash
npm run dev
# Open http://localhost:5173
```

### 4. Run Tests
```bash
npm test                    # Run all tests
npm run test:coverage       # Run with coverage report (>80% required)
npm run test:watch          # Watch mode
```

### 5. Build for Production
```bash
npm run build               # Creates dist/ directory
```

### 6. Deploy to Firebase
```bash
# Install Firebase CLI if needed:
npm install -g firebase-tools

# Login & deploy:
firebase login
firebase deploy
# Your app will be live at https://voteguide-ai.web.app
```

---

## 🏗️ Architecture

```
voteguide-ai/
├── src/
│   ├── components/
│   │   ├── AccessibilityBar/   # Font size, high contrast, skip link
│   │   ├── ChatAssistant/      # Gemini chat widget (floating)
│   │   ├── ElectionTimeline/   # 6-stage animated timeline
│   │   ├── VoterGuide/         # Tabs: Eligibility, Register, EVM, NOTA, Checklist
│   │   ├── BoothLocator/       # Google Maps + mock booth data
│   │   ├── Quiz/               # MCQ quiz + leaderboard
│   │   └── common/             # Navbar, ErrorBoundary, Skeletons
│   ├── hooks/
│   │   ├── useGemini.js        # Chat state management
│   │   ├── useFirestore.js     # Firestore CRUD operations
│   │   ├── useAuth.js          # Google Sign-In
│   │   └── useAccessibility.js # Font size + contrast
│   ├── services/
│   │   ├── geminiService.js    # Gemini 1.5 Flash client + rate limiter
│   │   └── firebaseConfig.js   # Firebase initialization
│   ├── data/
│   │   ├── quizQuestions.js    # 20 election MCQs
│   │   ├── boothData.js        # Mock booth data (10 cities)
│   │   └── timelineData.js     # 6 election stage definitions
│   ├── pages/                  # Route page wrappers
│   └── __tests__/              # Jest + RTL test files
├── functions/
│   └── index.js                # Firebase Cloud Functions (Gemini proxy)
├── firestore.rules             # Security rules
├── firebase.json               # Hosting + CSP headers
└── .env.example                # Environment variables template
```

---

## 🔑 API Keys Required

| Variable | Source |
|---|---|
| `VITE_GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `VITE_GOOGLE_MAPS_API_KEY` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) — enable Maps JS API + Places + Geocoding |
| `VITE_FIREBASE_*` | [Firebase Console](https://console.firebase.google.com/) → Project Settings → Web App |

---

## 🧪 Testing

```bash
npm run test:coverage
```

**Coverage targets (all must be >80%):**
- Branches: 80%+
- Functions: 80%+
- Lines: 80%+
- Statements: 80%+

**Test files:**
- `ChatAssistant.test.jsx` — 7 test cases
- `ElectionTimeline.test.jsx` — 8 test cases
- `Quiz.test.jsx` — 16 test cases
- `EligibilityChecker.test.jsx` — 8 test cases
- `BoothLocator.test.jsx` — 12 test cases
- `AccessibilityBar.test.jsx` — 10 test cases

---

## 🔐 Security

- ✅ All API keys in `.env` (never committed)
- ✅ Input sanitized with DOMPurify
- ✅ Rate limiting: 20 AI requests/minute per user
- ✅ Firebase security rules: users read/write own data only
- ✅ CSP headers via `firebase.json`
- ✅ Google Sign-In (OAuth 2.0)

---

## ♿ Accessibility (WCAG 2.1 AA)

- Skip to main content link
- Font size controls (Small / Medium / Large)
- High contrast mode
- Full keyboard navigation (Tab, Enter, Escape)
- ARIA labels on all interactive elements
- `aria-live` regions for chat and dynamic content
- Focus indicators (3px saffron outline)
- Color contrast ratio >4.5:1

---

## 📱 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS 3
- **AI**: Google Gemini 1.5 Flash
- **Backend**: Firebase Cloud Functions (Gemini proxy)
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth (Google Sign-In)
- **Maps**: Google Maps JavaScript API
- **Analytics**: Firebase Analytics
- **Testing**: Jest + React Testing Library
- **Deployment**: Firebase Hosting

---

## 🇮🇳 About VoteGuide AI

VoteGuide AI was built to make Indian election information accessible to every citizen. With support for Hindi and English, interactive learning tools, and AI-powered explanations, it aims to increase voter awareness and participation.

*Jai Hind! 🇮🇳*
