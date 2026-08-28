# System Architecture

> **Engineering Principle**: *Truth → Logic → Interpretation → Experience.*

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

---

## 🏗️ Architectural Layers

### 1. Deterministic Truth Engine (`src/domain/`)
- **Rules determine reality**: State transitions, evidence requirements, and "whose turn it is" are 100% deterministic TypeScript logic.
- **State Machine**: Pure state machine where legal transitions occur only through verifiable signals (`OFFICIAL` government signal or `CITIZEN_REPORTED` action).
- **Zero Hallucination**: AI models are never allowed to execute state transitions or declare eligibility.

### 2. Case Storage & Projection Layer (`src/server/`)
- **Dual Persistence**: Seamless in-memory demo mode with optional PostgreSQL (via Supabase / Drizzle ORM).
- **Self-Healing Hydration**: If a serverless worker restarts, `getStoredCase` deterministically reconstructs valid mock state snapshots on-the-fly, ensuring zero 404 dead-ends.
- **Data Transfer Object (DTO)**: Projects internal state machines into the clean 5-question contract required by the frontend.

### 3. Government Adapter Boundary (`src/adapters/`)
- Abstract interface decouples public service APIs from the recovery experience.
- `MockGovernmentAdapter` simulates real-world state changes across time.

### 4. Assistive AI & Indic Voice Layer (`src/ai/`)
- Powered by **Sarvam AI** for natural Indian-accented speech synthesis (TTS) and speech-to-text recognition (STT) in 8 regional languages.
- Fallback deterministic extractors and native browser speech when offline or unconfigured.

---

## 🔄 State Transition Integrity

1. **`CITIZEN_REPORTED` is not `OFFICIAL`**:
   When a farmer marks *"I have completed biometric e-KYC at the CSC"*, the case transitions to `CITIZEN_REPORTED_PENDING_CONFIRMATION`. The system explicitly acknowledges the human effort while clearly waiting for the government server signal before claiming verification is finalized.

2. **Wait-with-Context**:
   When the government holds the baton, the system transitions to a serene zero-action state, telling the citizen: *"You don't need to do anything right now. The state is reviewing your district batch."*
