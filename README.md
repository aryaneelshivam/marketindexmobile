# 📈 MarketIndex-Pro

<div align="center">

**A modern, real-time stock technical analysis, fundamental deep-dive screener, and market intelligence dashboard.**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v12-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

</div>

---

## 🌟 Key Features

- **📊 Comprehensive Technical Scoring (0–100 & Letter Grades)**
  - Multi-factor evaluation across **Trend**, **Strength (ADX)**, **Momentum (RSI / MACD)**, **Volume (OBV / Volume Ratio)**, and **Structure (Support & Resistance)**.
  - Visual Score Gauges and Speedometers for instant trend & grade assessment.

- **🔍 Advanced Stock Screener & Real-Time Filtering**
  - Instant sector filtering (Technology, Financial Services, Healthcare, Consumer, Energy, and more).
  - One-click quick filters: *Bullish Grade (≥65)*, *Bearish Grade (<45)*, *Oversold (RSI <35)*, *Overbought (RSI >65)*, *Volume Surge (>1.5x)*, *Above 200 SMA*, *MACD Bullish Cross*, and *Near 52W High*.
  - Real-time search across stock tickers and company names.

- **📑 Fundamental Deep-Dive & Profile Sidebar**
  - In-depth company profile and business summary.
  - Valuation metrics: Trailing & Forward P/E, PEG Ratio, Price-to-Book, Price-to-Sales, Enterprise Value, Market Cap.
  - Interactive price history and technical chart visualization powered by Recharts.

- **⚡ Multi-Timeframe & Historical Period Analysis**
  - Flexible timeframe switching: `15m`, `1h`, `Daily (1d)`, `Weekly (1wk)`, `Monthly (1mo)`.
  - Configurable historical lookback periods: `1mo`, `3mo`, `6mo`, `1y`, `2y`, `5y`.

- **🎨 Modern UX / UI & Theme Support**
  - Seamless Light / Dark mode toggle.
  - Fluid micro-animations with Motion.
  - Responsive layouts tailored for desktop, tablet, and mobile screens.

- **📱 Progressive Web App (PWA) & Offline Mode**
  - Installable as a native-feeling standalone app on mobile and desktop.
  - Built-in offline status detection and service worker caching.

- **🔐 Authentication & User Personalization**
  - Integrated Firebase Authentication (Google Sign-In).

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool & Bundler** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations** | [Motion](https://motion.dev/) (Framer Motion) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Backend & Auth** | [Firebase](https://firebase.google.com/) (Auth, Firestore) |
| **AI Integration** | [@google/genai](https://www.npmjs.com/package/@google/genai) |
| **PWA Support** | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/MarketIndex-Pro.git
   cd MarketIndex-Pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   Create a `.env.local` or `.env` file in the project root:
   ```env
   # Gemini API Key (if using AI features)
   GEMINI_API_KEY="your-gemini-api-key"

   # App URL
   APP_URL="http://localhost:3000"
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on `http://localhost:3000` with host access (`0.0.0.0`) |
| `npm run build` | Compiles TypeScript and builds the optimized production bundle into `dist/` |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs TypeScript compiler checks without emitting files (`tsc --noEmit`) |
| `npm run clean` | Cleans up previous build artifacts |

---

## 📂 Project Structure

```text
MarketIndex-Pro/
├── public/                # Static assets, PWA icons, and manifest
├── src/
│   ├── components/        # React UI components
│   │   ├── Dashboard.tsx            # Main market dashboard & controls
│   │   ├── StockTable.tsx           # Technical data table & sorting
│   │   ├── FundamentalsSidebar.tsx  # Deep-dive fundamentals & charts
│   │   ├── FeaturedStockCard.tsx    # Highlighted stock overview card
│   │   ├── ScoreGauge.tsx           # Technical score visual meter
│   │   ├── Speedometer.tsx          # Radial indicator for technical grades
│   │   ├── PWAInstallButton.tsx     # One-click PWA installer
│   │   └── OfflineIndicator.tsx     # Network status alerts
│   ├── contexts/          # React Context providers (AuthContext, ThemeContext)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Firebase & external service initializations
│   ├── api.ts             # API client functions for market & fundamentals data
│   ├── types.ts           # TypeScript interfaces for market data & scores
│   ├── utils.ts           # Formatting and utility functions
│   ├── App.tsx            # Root application component
│   └── main.tsx           # Application entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite & PWA configuration
└── README.md              # Project documentation
```

---

## 📄 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it in accordance with the license.