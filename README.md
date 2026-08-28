<div align="center">

# Raasta (रास्ता)

> **What happens next.**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-77%20passing-emerald?style=flat-square)](https://github.com/shashankatthaluri/Raasta)
[![Live Demo](https://img.shields.io/badge/Live-raasta.online-000000?style=flat-square&logo=vercel)](https://raasta.online)

</div>

---

**Raasta is a citizen recovery layer for public services. It connects status, responsibility, required action and follow-up into one persistent case.**

---

## ⚠️ Problem

Government systems can tell a citizen what happened (e.g. *"Installment stopped by State on request"*, *"Error 1024: Bank Account Inactive"*). 

**Raasta is designed around what happens after that status.**

When a payment halts or a verification stalls, citizens face opaque error codes, repeated trips to Common Service Centres (CSCs), and endless anxiety. Raasta absorbs the bureaucratic process complexity and gives the citizen one clear, calm next step — or confirms when no action is needed.

---

## 🏛️ Core Model

The system is built on three core pillars:

1. **Recovery Case**: An active, persistent docket that binds the underlying failure reason, required human action, and timeline into a single tracking surface.
2. **Responsibility Baton**: An unmistakable visual progress rail that answers: *"Whose turn is it right now?"* (e.g., `YOU ✓` $\rightarrow$ `STATE VERIFICATION` $\rightarrow$ `PFMS TREASURY` $\rightarrow$ `₹2,000 CREDITED`).
3. **Minimum Human Action**: Every bureaucratic workflow is reduced to at most **one single physical or digital task**. If the state holds the baton, the citizen is clearly told: *"You don't need to do anything right now."*

---

## 🌐 Demo

**Try Raasta Live → [https://raasta.online](https://raasta.online)**

Interactive simulated journeys available to test:
- **`J1` Farmer Action (e-KYC)**: One-action state; citizen self-report $\neq$ official verification.
- **`J2` Government Action (Land Verification)**: Zero-action state; the state has the next action.
- **`J3` Payment Failure (PFMS Reprocessing)**: Failed $\neq$ visit the bank; automated treasury retry.
- **`J4` No Action Required**: Reassurance state; installment successfully credited.

---

## 🏗️ Architecture

```text
                     CITIZEN INTERFACE (Client)
             (Text, Voice, Native Script, 8 Languages)
                                │
                                ▼
                       SARVAM AI VOICE LAYER
              (ASR Speech Recognition & Audio Synthesis)
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

Detailed architecture specifications:
- **[System Architecture](docs/ARCHITECTURE.md)**
- **[Product Philosophy](docs/PRODUCT.md)**
- **[Visual & Brand System](docs/VISUAL_SYSTEM.md)**
- **[Official Sources & Provenance](docs/SOURCES.md)**

---

## 💻 Run Locally

A stranger should be able to clone and run Raasta in 60 seconds with zero hidden setup:

```bash
# 1. Clone the repository
git clone https://github.com/shashankatthaluri/Raasta.git
cd Raasta

# 2. Install dependencies
npm install

# 3. Setup environment template (Optional)
cp .env.example .env.local

# 4. Start local development server
npm run dev

# 5. Run tests & production build
npm test
npm run build
```

Visit [`http://localhost:3000`](http://localhost:3000) (or `http://localhost:3998`).

> **Note**: Demo mode runs entirely on an in-memory store with deterministic hydration. No database or external API credentials are required to run the full application locally.

---

## 🤖 AI Boundary

> **Core Principle**: *Rules determine reality. AI explains reality.*
> 
> *AI can help understand a citizen's natural-language description, but it must not invent official status, eligibility, timelines, remedies, or evidence.*

- **Where AI is used**: Voice speech-to-text (STT) and natural text-to-speech (TTS) via Sarvam AI across 8 Indian languages (Hindi, Telugu, Tamil, Kannada, Marathi, Bengali, Punjabi, English), and natural language intent parsing.
- **Where AI is NOT used**: State transitions, eligibility determination, evidence validation, and official government truth are 100% deterministic TypeScript rules.
- **Fallback**: If no API key is configured, rule-based deterministic extractors and native browser speech activate automatically.

Read the full **[AI Transparency & Boundary Spec](docs/AI_BOUNDARY.md)**.

---

## 🔒 Data / Simulation Disclaimer

> **Raasta's prototype uses simulated government-service signals based on publicly documented PM-KISAN workflows. It is not an official PM-KISAN service and does not access live individual beneficiary data.**

- All beneficiary names, 11-digit registration numbers (e.g. `10203040506`), case IDs, UTRs, and phone numbers in this repository are **100% synthetic mock fixtures**.
- No production database dumps, real Aadhaar data, or live government credentials exist in this repository.
- Government API integration points are abstracted behind the `GovernmentAdapter` interface for future authorized deployments.

---

## 🤝 Contributing

We welcome contributions from engineers, civic technologists, and designers. 

Before contributing, please read our **[Contributing Guidelines](CONTRIBUTING.md)** and **[Security Policy](SECURITY.md)**.

> *Guiding Rule: Contributions that make the system technically more sophisticated but increase citizen cognitive load are not automatically improvements.*

---

## 📜 License

Raasta is open-source software licensed under the **[MIT License](LICENSE)**.

---

<div align="center">
  <sub>Built with devotion for the citizens of India 🇮🇳</sub>
</div>
