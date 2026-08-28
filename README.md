<div align="center">

# 🌾 Raasta (रास्ता)
### Government complexity. One clear next step.

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-77%20passing-emerald?style=flat-square)](https://github.com/shashankatthaluri/Raasta)
[![Live on Vercel](https://img.shields.io/badge/Live-raasta.online-000000?style=flat-square&logo=vercel)](https://raasta.online)

**[Explore Live Demo → raasta.online](https://raasta.online)** · **[Read Product Contract](docs/PRODUCT_CONTRACT.md)** · **[Architecture Guide](docs/STATE_TO_EXPERIENCE.md)**

</div>

---

## 📖 Overview

Over **120 million Indian citizens** interact with complex public direct benefit transfer (DBT) pipelines like **PM-KISAN**, PFMS, NPCI, UIDAI, and State Treasury Portals. When an installment halts due to e-KYC mismatch, land verification backlogs, or bank routing errors, citizens face opaque error codes, repeated Common Service Centre (CSC) visits, and endless anxiety.

**Raasta is an open-source citizen recovery layer.**

It bridges the gap between bureaucratic process complexity and citizen clarity. Instead of forcing citizens to understand government architecture, Raasta absorbs the complexity and answers five core questions in clear human terms.

```
       BUREAUCRATIC PIPELINE                  CITIZEN RECOVERY LAYER
  ┌──────────────────────────────┐          ┌────────────────────────┐
  │ UIDAI · NPCI · PFMS · KISAN  │          │  🌾 RAASTA             │
  │ Error 1024: IFSC Inactive    │  ─────►  │  "Your turn is over.   │
  │ Land Audit Batch #9240       │          │   The state is moving  │
  │ Nodal Clearance Pending      │          │   your verification."  │
  └──────────────────────────────┘          └────────────────────────┘
```

---

## 🎯 The 5 Core Civic Questions

Every single case docket communicates five critical questions in strict visual hierarchy:

```
1. WHAT HAPPENED?     → Clear, honest status ("4th installment paused at State verification")
2. WHY?               → Plain-language reason ("Land ownership audit pending in district batch")
3. WHOSE TURN IS IT?  → Unmistakable active actor ("Currently with: State verification team")
4. WHAT DO I NEED TO DO? → Single actionable step, or "You don't need to do anything right now"
5. WHAT HAPPENS NEXT? → Sequential progress rail ("State Review → PFMS Treasury → ₹2,000 Credited")
```

---

## ✨ Key Capabilities

- 🗣️ **8 Indian Languages with Voice AI**:
  - Full native UI and voice support in **Hindi (हिन्दी)**, **Telugu (తెలుగు)**, **Tamil (தமிழ்)**, **Kannada (ಕನ್ನಡ)**, **Marathi (मराठी)**, **Bengali (বাংলা)**, **Punjabi (ਪੰਜਾਬੀ)**, and **English**.
  - Powered by **Sarvam AI** for natural Indian-accented speech synthesis (TTS) and voice recognition (STT).
- ⚙️ **Deterministic Rule Engine**:
  - Truth logic is 100% deterministic TypeScript. AI never hallucinates or mutates legal case states.
- 🚦 **Active Responsibility Baton**:
  - Live progress rail that makes it immediately obvious who holds the ball: `YOU ✓` $\rightarrow$ `STATE VERIFICATION` $\rightarrow$ `PAYMENT SYSTEM` $\rightarrow$ `₹2,000 CREDITED`.
- 💬 **Quiet WhatsApp / SMS Notification Daemon**:
  - Unobtrusive, bottom-corner reassurance toast. Alerts citizens only when genuine government progress moves.
- ⏳ **Interactive Time-Lapse & Demo Simulation**:
  - Evaluation-mode simulator that steps through realistic multi-day government verification milestones with simulated CSC operator sync, state nodal audit, and treasury transfer.
- 🛡️ **Self-Healing Case Persistence**:
  - Multi-tiered persistence backend (Supabase PostgreSQL + In-Memory + Deterministic Hydration) guaranteeing zero 404s and seamless page refreshes.
- 🍎 **Apple-Grade Restraint & Spatial Motion**:
  - Clean typographic hierarchy, zero cognitive clutter, responsive touch controls, and fluid spring animations.

---

## 🏛️ System Architecture

```text
                     CITIZEN INTERFACE
        (Text, Voice, Native Script, 8 Languages)
                           │
                           ▼
                  SARVAM AI VOICE LAYER
          (ASR Speech Recognition & Audio Playback)
                           │
                           ▼
                 RECOVERY CASE ENGINE
         (Snapshot Storage, Timeline, Evidence)
                           │
                           ▼
                 DETERMINISTIC RULES
       (State Catalog, Next Actor, Minimum Action)
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
    GOVERNMENT ADAPTERS          AI EXPLANATIONS
  ┌─────────────────────┐     ┌─────────────────────┐
  │ Mock Adapter        │     │ Assistive Translator│
  │ Official DBT Portal │     │ Contextual Helper   │
  └─────────────────────┘     └─────────────────────┘
```

> **Engineering Rule**: *Rules determine reality. AI explains reality.*

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher

### Local Installation

```bash
# 1. Clone the repository
git clone https://github.com/shashankatthaluri/Raasta.git
cd Raasta

# 2. Install dependencies
npm install

# 3. Configure environment (Optional)
# Copy example env file if you wish to configure live Sarvam AI keys or Supabase
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Raasta features a comprehensive test suite covering domain state machines, government signal adapters, journey progressions, and multi-lingual projection rules:

```bash
# Run Vitest test suite
npm test

# Run single test file
npx vitest run src/domain/__tests__/engine.test.ts

# Production build and typecheck
npm run build
```

---

## 📁 Repository Structure

```text
├── src/
│   ├── adapters/            # Government API adapters (Mock + Schema interfaces)
│   ├── ai/                  # Sarvam AI speech synthesis, recognition & intent extraction
│   ├── app/                 # Next.js 15 App Router (Pages, Layouts, API Routes)
│   │   ├── api/cases/       # Thin REST endpoints over the Case Engine
│   │   ├── case/[id]/       # Primary Citizen Case Docket View
│   │   ├── journal/         # Design & Engineering Journal documentation
│   │   └── page.tsx         # Language selection gate & 11-digit lookup
│   ├── components/          # Reusable UI widgets, Audio buttons, Logo mark
│   ├── domain/              # Deterministic Engine, State Catalog, Journeys, Types
│   ├── lib/                 # Multi-lingual translations (8 languages), Utils
│   └── server/              # Case Store, Persistence (Supabase + In-Memory)
├── docs/                    # Frozen Product Contracts & Architecture Specs
├── public/                  # Static assets, Web manifest, Favicons
├── CONTRIBUTING.md          # Open-source contribution guidelines
├── SECURITY.md              # Privacy & security disclosure policy
└── LICENSE                  # MIT License
```

---

## 🗺️ Supported Welfare Journeys

| Journey ID | Public Welfare Workflow | Core Demonstration |
|:---|:---|:---|
| **`J1_FARMER_EKYC`** | Farmer Action — Biometric e-KYC | Single citizen action required; self-report vs. official confirmation. |
| **`J2_GOVT_VERIFICATION`**| State Land Record Verification | Zero-action state; state verification team holds the baton. |
| **`J3_PAYMENT_FAILURE`** | Banking Network / PFMS Reprocessing | Payment failure $\neq$ visit the bank; automated treasury re-attempt. |
| **`J4_NO_ACTION`** | Direct Bank Account Credited | Reassurance state; funds successfully transferred. |

---

## 🤝 Contributing

We welcome contributions from developers, designers, civic technologists, and language enthusiasts across India and globally!

Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CONTRIBUTING.md#code-of-conduct) before submitting pull requests.

---

## 📜 License

Raasta is open-source software licensed under the **[MIT License](LICENSE)**.

---

<div align="center">
  <sub>Built with devotion for the citizens of India 🇮🇳</sub>
</div>
