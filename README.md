# 💰 Money Matters — Gamified Financial Literacy for Youth 🚀

> **Empowering the next generation to master money, defeat inflation, and build lasting wealth through interactive gamification, AI-guided mentorship, and byte-sized financial reels.**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.5_Flash_Lite-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

---

## 🌟 About the Project

**Money Matters** is a state-of-the-art interactive financial education platform designed specifically for young adults, students, and early-career professionals in India and beyond. 

Traditional financial advice is often dry, jargon-heavy, and intimidating. **Money Matters** reimagines financial literacy by turning complex personal finance concepts (SIP, 50-30-20 budgeting, compounding, debt traps, inflation) into **bite-sized interactive simulations, gamified reward systems, and AI-powered educational chatbots**.

---

## ✨ Key Features

### 1. 📱 Paisa Shorts (Finance Reels)
- **Reel-like Custom Player**: High-engagement 9:16 vertical video player for financial education.
- **Micro-Learning**: Curated bite-sized shorts explaining budgeting, SIP, credit card hacks, and inflation.
- **Engagement Loop**: Like, save/bookmark, link sharing with toast feedback, and watch rewards (+25 coins per short).

### 2. 🤖 AI Finance Mentor (Chatbot)
- **Educational AI**: Fine-tuned on `gemini-3.5-flash-lite` and `gemini-3.1-flash-lite` to strictly explain financial fundamentals (not speculative stock tips).
- **ChatGPT-Style Fixed Interface**: Seamless header, sidebar, and pinned input bar with auto-scrolling markdown answers.
- **Real-Time Web Search Grounding**: Integrated Tavily search for live macroeconomic and market data.

### 3. 🎮 Gamified Financial Concepts
- **Interactive Labs**: 11+ visual strategy simulators including:
  - *Paise Ka GPS* (Cash Flow Navigator)
  - *Budget Khel* (Swipe-to-Budget Simulator)
  - *Compounding Tree* (Visual Exponential Growth)
  - *Debt Trap Darwaza* (Consequences of Minimum Due Payments)
  - *Chhupa Hua Chor* (Inflation Destroyer)
  - *Ek Din Ka Kharcha* (Daily Spending Reality Check)

### 4. 🛠️ Comprehensive Learning Utilities
- **Goal Roadmap Planner**: AI-powered milestone roadmaps with auto-calculated timelines.
- **SIP & Compounding Treasury**: Interactive growth charts comparing FD vs Equity.
- **Emergency Fund Calculator**: Tailored 6-month safety net estimator.
- **Needs vs Wants Budget Allocator**: Real-time 50-30-20 budget breakdown.
- **Financial Health Diagnostic Gauge**: Real-time financial fitness score out of 100.

### 5. 🏆 Reward & Gamification Engine
- **Coins & Streaks**: Earn currency for completing cards, watching reels, and quizzes.
- **Level Progression**: Rookie Learner ➔ Smart Investor ➔ Expert Advisor ➔ Grand Master.
- **Badge Showcase**: Unlockable achievement trophies with persistent cloud sync.

### 6. 🔐 Unified Auth & Guest Mode
- Seamless single-click Google OAuth with instant Guest Access fallback.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Styling & UI** | Tailwind CSS v4, Vanilla CSS Design System, Lucide React Icons |
| **Animations** | Framer Motion, CSS Keyframes |
| **State Management** | Zustand (with LocalStorage + Firestore Cloud Hydration) |
| **Authentication & Database** | Firebase Authentication (Google OAuth), Cloud Firestore |
| **AI & NLP** | Google Gemini SDK (`gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`), Tavily Search API |
| **Testing** | Playwright End-to-End Test Suite |

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js (v18.x or higher)
- npm or yarn

### 2. Clone the Repository
```bash
git clone https://github.com/Deepak0205p/money-matters-frontend.git
cd money-matters-frontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🧪 Testing

Run automated Playwright tests:
```bash
powershell -ExecutionPolicy Bypass -Command "npx playwright test"
```

---

## 👥 Hackathon Team
- **Frontend & UI/UX**: Designed and developed with focus on high-contrast accessibility, micro-animations, and mobile responsiveness.
- **AI & Integrations**: Educational financial guardrails and real-time grounding.
