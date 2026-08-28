# AI Transparency & Boundary Specification

> **Core Principle**: *Rules determine reality. AI explains reality.*
> 
> *AI can help understand a citizen's natural-language description, but it must not invent official status, eligibility, timelines, remedies, or evidence.*

---

## 🧭 Where AI Is Used vs. Where AI Is NOT Used

```
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│        WHERE AI IS USED              │     │       WHERE AI IS STRICTLY FORBIDDEN  │
├──────────────────────────────────────┤     ├──────────────────────────────────────┤
│ 1. Voice Recognition (ASR / STT)     │     │ 1. Official State Transitions        │
│ 2. Indic Speech Synthesis (TTS)      │     │ 2. Determining Beneficiary Rights    │
│ 3. Natural Language Intent Parsing   │     │ 3. Inventing Deadlines or SLAs       │
│ 4. Plain-Language Simplification     │     │ 4. Verifying Legal Evidence          │
│ 5. Multi-lingual Query Translation   │     │ 5. Overriding Deterministic Rules    │
└──────────────────────────────────────┘     └──────────────────────────────────────┘
```

---

## 🔍 Detailed AI Capabilities

### 1. Indic Voice Synthesis & Recognition (Sarvam AI)
- Converts voice queries into structured text across 8 Indian languages (Hindi, Telugu, Tamil, Kannada, Marathi, Bengali, Punjabi, English).
- Generates natural, regional Indian-accented audio playback so non-literate citizens can listen to their case status and required steps in their native mother tongue.

### 2. Natural Language Intake & Intent Mapping
- When a citizen types or speaks freeform text (e.g. *"Mera 4th installment nahi aaya, bank bol raha hai KYC karo"*):
- The model extracts structured entity slots: `{ problemType: "PAYMENT_MISSING", mentionedAction: "EKYC" }`.
- The extracted intent is passed to the **Deterministic Engine**, which validates if it matches a legally sound recovery journey.

---

## 🛡️ Fail-Safe Fallbacks

1. **Zero API Key Requirement**:
   - If no `SARVAM_API_KEY` or LLM key is configured in `.env.local`, the platform automatically falls back to deterministic rule-based keyword extractors and native Web Speech API audio.
   - The core citizen recovery experience **never breaks** when external AI services are unavailable.

2. **Strict Schema Validation**:
   - All AI-generated audio and text responses pass through strict TypeScript DTO validators. Any unformatted or hallucinated output is discarded and replaced with canonical legal state explanations.
