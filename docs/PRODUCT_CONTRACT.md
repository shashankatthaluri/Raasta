# Raasta — Product Contract v1.1 (FROZEN)

> **Government complexity. One clear next step.**
> रास्ता — the way forward. "Tell me what happened. Show me the way forward."

Locked 2026-08-27 (Day 2/4). This is the canonical build artifact. Code follows this document; this document does not chase code. Changes require a deliberate re-freeze.

---

## 0. Context

- **Challenge:** Build What Moves India — Varun Mayya × OpenAI — rethinking, redesigning, and building better experiences for India's public digital services.
- **Timeline:** 4 days total. Frozen at Day 2/4.
- **Mode:** Built in public on LinkedIn, in the voice of a Founder + Product Engineer.
- **Method:** Problem → Evidence → Constraints → Solution → Build.
- **Prime directive:** *If technology cannot genuinely reduce human work, don't add it.*

---

## 1. Identity

| Field | Value |
|---|---|
| Product name | **Raasta** |
| Meaning | रास्ता — the way forward |
| Positioning | **One clear next step through government services.** |
| Alt tagline | Know what's happening. Know what's next. |
| Hackathon UI label | **Raasta for PM-KISAN** (instant context for judges) |
| Product sentence | **A citizen case system that turns complex government process states into one clear next step — or tells the citizen when no action is required.** |
| Core object | `CitizenCase` |
| Pillars | Recovery Case (persistence) · Responsibility Baton (NextActor) · Minimum Human Action (calculateCitizenAction) |
| North star | Complex system → one clear next step |
| North-star metric | **Citizen Effort Removed** — Potential citizen work − Necessary citizen work = unnecessary work removed (qualitative in MVP) |
| Ultimate vision | The citizen should never have to understand the government's internal workflow in order to get through a government service. |

### What we are NOT
Not a generic government chatbot. Not an AI assistant. Not a PM-KISAN clone. Not a KYS clone. Not a grievance portal. Not a government super-app. Not a giant dashboard. Not an autonomous government agent. A grievance is *one possible transition inside a case* — never the product.

### Principles (keep in README, pitch, demo, architecture)
1. **Product:** Government systems are designed around processes. Citizens experience outcomes. Raasta connects the two.
2. **Engineering:** Rules determine reality. AI explains reality.
3. **UX:** Never make the citizen understand the system to use the service.
4. **Product:** If technology cannot reduce human work, don't add it.
5. **Architecture:** Truth → Logic → Interpretation → Experience. (Government signal = truth; rules engine = deterministic logic; AI = interpretation; frontend = experience; CitizenCase = persistence.)
6. **Trust:** Never present simulated data as a real citizen's record. Demo mode is always labeled. No fake government integration.
7. **Trust — confidence without false certainty:** clarity about who acts next, never unsupported promises about outcomes. "Don't worry, your payment will definitely arrive" is forbidden; "The state has the next action" is the ceiling of certainty.

### Differentiation (judge answers)
- **vs Kisan e-Mitra:** It answers the farmer's *questions*. Raasta manages the farmer's *case* — persistent, verified, with responsibility and resolution. Conversation is only the interface into the case workflow.
- **vs KYS:** KYS says what the status *is*. Raasta says what it *means for this human* and who acts next. (KYS: "Payment status: Failed." Raasta: "Your payment attempt was unsuccessful. The next verification is with the state. You don't need to do anything right now.")
- **vs grievance portal:** A grievance is one transition inside the case. The case exists before, during, and after it.
- **vs chatbot:** Chat is an interface. The persistent case is the product.
- **vs dashboard:** Dashboards ask the citizen to understand information. Raasta hides unnecessary complexity.

---

## 2. The problem

PM-KISAN already has: KYS / beneficiary status, e-KYC, Kisan e-Mitra, grievance mechanisms, CSCs, state/district processes, bank/DBT infrastructure, payment processing/reprocessing, verification, escalation, SMS/IVRS.

The problem is **not** "farmers don't know why the payment stopped."

The problem is:

> **The government has many systems and process states. The citizen experiences one human problem — and becomes the coordinator between all the government's steps.**

The citizen can end up having to figure out: What actually happened? Is there something I need to do? Who is responsible for the next action? Do I need to visit someone? What documents? What exactly should I say? What happens after I do it? When should I check again? If nothing happens, where do I go next? Do I have to explain the whole story again?

**Core thesis: Government complexity → Human clarity.**
**Formal:** A citizen case system that turns complex government process states into one clear next step — or tells the citizen when no action is required.

### We are NOT replacing government authority. We are building the human layer over an already-complex government process.

---

## 3. The core object: `CitizenCase`

```text
CitizenCase
├── Problem
├── Current State
├── Evidence[]
├── NextActor           (who can cause the next valid transition)
├── Required Citizen Action
├── Next State
├── Timeline            (derived from case_events, never stored separately)
├── Last Verified
└── Resolution
```

The three pillars are three layers of this one object:
- **Recovery Case** = persistence (the case follows the problem: detection → diagnosis → action → waiting → state change → resolution)
- **Responsibility Baton** = ownership (NextActor — "who can move this case forward next?", never "who owns it")
- **Minimum Human Action** = optimization (the smallest work the citizen actually needs to perform)

### "The case tracks itself"
We are NOT building "track my government application." We are building **"stop making me track my government application."** The citizen returns only when something changed or a necessary action exists.

### Core interaction (every screen answers these four, in order)
1. **What happened?**
2. **Who acts next?**
3. **What do I do?**
4. **What happens after that?**

---

## 4. The six anxieties we eliminate

| Anxiety | Citizen feels | Raasta answers |
|---|---|---|
| Uncertainty | What happened? | Status + plain-language "Why?" |
| Responsibility ambiguity | Who is supposed to fix this? | NextActor |
| Action ambiguity | What am I supposed to do? | One action, or explicit "Nothing right now" |
| Process anxiety | What happens after I do it? | Next-state chain |
| Follow-up burden | Do I have to keep checking? | The case tracks itself; notify only on change; "Last verified" |
| Repetition | Why do I have to explain everything again? | Persistent case + CSC/bank handoff card |

Emotional journey: Confusion → Understanding → Responsibility clarity → Action clarity → Confidence → Relief.
Success condition: "Oh, now I understand." → "I know who needs to act." → "I know exactly what I need to do." — or — "I don't need to do anything."

---

## 5. Real-world grounding (current PM-KISAN mechanisms)

Official KYS exposes: **payment status · bank name · UTR · payment mode · credited status/date · e-KYC status.** (Cross-checked 2026-08-27.)

PM-KISAN already has: KYS · e-KYC (multiple routes; status update can take time) · Kisan e-Mitra · grievance management · CSC infrastructure · state correction processes · physical verification · payment/DBT infrastructure · state/UT integration · SMS/IVRS.

Official operational documentation describes **failed transactions being returned and made available to States/UTs for verification and reprocessing** — therefore we must NOT auto-tell the farmer to visit a bank on failure. Documentation also covers benefits **temporarily withheld pending physical verification** — pending ≠ ineligible; we never phrase verification as rejection.

**Rules:**
1. Model the demo around real government states/mechanisms — never invent a fake workflow.
2. Never pretend to have a live individual beneficiary API — no fake government integration.
3. The mock adapter mirrors the real KYS field surface so the future official adapter is a drop-in.

---

## 6. State machine

```text
                    PAYMENT_EXPECTED  [entry]
                          │
                          ▼
                     PAYMENT_CHECK  [internal — resolves in one pass]
                          │
        ┌─────────────────┼──────────────────┬──────────────────┐
        ▼                 ▼                  ▼                  ▼
  EKYC_REQUIRED     PAYMENT_PROCESSING  PHYSICAL_VERIF_   TRANSACTION_FAILED
        │                 │              PENDING                │
        ▼                 │                  │                  ▼
  EKYC_VERIFIED           │                  │            PAYMENT_REPROCESSING
        │                 │                  │                  │
        └─────────────────┴──────────────────┴──────────────────┤
                          │                                      │
                          ▼                                      │
                   PAYMENT_PROCESSING  ◄─────────────────────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
      PAYMENT_CREDITED         (retry guard R6)
        (terminal)          CITIZEN_ACTION_REQUIRED
              │                       │
              └─────────── RESOLVED ◄─┘
```

## 7. State library (locked copy, EN + HI)

Every state carries: `id, humanTitle, humanExplanation, nextActor, citizenAction, nextStates, chain, color, evidence[]`.

| # | State | Human title | Next actor | Citizen action | Color |
|---|---|---|---|---|---|
| S1 | `PAYMENT_PROCESSING` | "Your payment is being processed." / "आपका भुगतान प्रोसेस हो रहा है।" | CENTRAL_SYSTEM | NONE | neutral |
| S2 | `PAYMENT_CREDITED` *(terminal)* | "₹2,000 was credited to your account." *(amount from official signal)* / "आपके खाते में ₹2,000 जमा कर दिए गए हैं।" | NONE | NONE | green |
| S3 | `EKYC_REQUIRED` | "Your e-KYC needs to be completed." / "आपका ई-केवाईसी पूरा करना आवश्यक है।" | CITIZEN | `COMPLETE_EKYC` | red |
| S4 | `EKYC_VERIFIED` | "Your e-KYC is verified." / "आपका ई-केवाईसी सत्यापित हो गया है।" | CENTRAL_SYSTEM | NONE | neutral |
| S5 | `TRANSACTION_FAILED` | "The payment attempt was unsuccessful." / "भुगतान का प्रयास सफल नहीं हो सका।" | STATE | usually NONE initially | amber |
| S6 | `PAYMENT_REPROCESSING` | "Your payment is being processed again." / "आपका भुगतान दोबारा प्रोसेस किया जा रहा है।" | CENTRAL_SYSTEM | NONE | neutral |
| S7 | `PHYSICAL_VERIFICATION_PENDING` | "Your benefit is temporarily on hold while your eligibility is being verified." / "आपकी पात्रता की जाँच चल रही है, इसलिए आपका लाभ अस्थायी रूप से रोका गया है।" | STATE | NONE unless officially requested | amber |
| S8 | `CITIZEN_ACTION_REQUIRED` | "We need one thing from you." / "हमें आपसे एक काम करना है।" | CITIZEN | exactly one action | red |
| S9 | `RESOLVED` *(terminal)* | "Your case is resolved." / "आपका मामला हल हो गया है।" | NONE | NONE | green |

Supporting states: `PAYMENT_EXPECTED` (entry), `PAYMENT_CHECK` (internal, never shown raw).

**Future states (NOT MVP):** `BANK_DETAILS_CORRECTION`, `ELIGIBILITY_VERIFIED`, `ELIGIBILITY_EXCLUSION`, `GRIEVANCE_OPEN`, `ADDITIONAL_INFORMATION_REQUIRED`, `GRIEVANCE_RESOLVED`.

### Hard copy rules
- TRANSACTION_FAILED: never auto-tell the farmer to visit a bank (official reprocessing exists).
- PHYSICAL_VERIFICATION_PENDING: never say "you are ineligible" — pending ≠ denied.
- EKYC: link to the official e-KYC route (or CSC); we don't re-invent government procedure. After the citizen acts, **wait for the official confirmation signal** before claiming verified — official status updates can take time.

---

## 8. Rules engine — deterministic decision table

AI never writes these decisions. Predictability + auditability + trust.

| # | Condition (verified official signals only) | NextActor | CitizenAction | NextState |
|---|---|---|---|---|
| R1 | `payment.status == FAILED` && reprocessing available && retryCount < 2 | STATE | null | TRANSACTION_FAILED (1st) / PAYMENT_REPROCESSING (subsequent) |
| R2 | `ekyc.status == INCOMPLETE` | CITIZEN | COMPLETE_EKYC | EKYC_REQUIRED |
| R3 | `payment.status == CREDITED` | NONE | null | PAYMENT_CREDITED → RESOLVED |
| R4 | `payment.status == PROCESSING` | CENTRAL_SYSTEM | null | PAYMENT_PROCESSING |
| R5 | `verification.status == PENDING` | STATE | null | PHYSICAL_VERIFICATION_PENDING |
| R6 | **Stuck policy:** FAILED while `retryCount >= 2`, or reprocessing unavailable | CITIZEN | SHOW_CARD_AT_BANK / SHOW_CASE_AT_CSC / PREPARE_GRIEVANCE | CITIZEN_ACTION_REQUIRED |

Priority order when signals conflict: **R3 > R2 > R1/R6 > R5 > R4** (credited and eKYC-incomplete dominate).

**The core loop** (on every new signal): Did the state change? → recalculate NextActor → recalculate minimum citizen action → notify only if the citizen-visible answer changed.

```typescript
type CaseState = {
  id: string
  humanTitle: string
  humanExplanation: string
  nextActor: "CITIZEN" | "CSC" | "BANK" | "STATE" | "CENTRAL_SYSTEM" | "NONE"
  citizenAction: CitizenAction | null
  nextState: string
  evidence: Evidence[]
  lastVerifiedAt: Date
  source: SourceReference
}
```

---

## 9. Citizen actions — one action per screen, never five buttons

```typescript
type CitizenAction =
  | { id: "COMPLETE_EKYC";       effort: "LOW";   why: string; after: string; href?: officialEkYcUrl }
  | { id: "SHOW_CASE_AT_CSC";    effort: "MEDIUM"; card: CaseSummaryCard }
  | { id: "SHOW_CARD_AT_BANK";   effort: "MEDIUM"; card: BankCard }
  | { id: "PREPARE_GRIEVANCE";   effort: "MEDIUM" }
  | { id: "PROVIDE_INFORMATION"; effort: "LOW" }
```

Every action renders: one primary button + "Why?" + "What happens after?" ("Your case will continue automatically").

**The bank card** (SHOW_CARD_AT_BANK) — AI reduces real friction: a showable card for the bank with:
> "I need help resolving an Aadhaar/DBT mapping issue related to my PM-KISAN payment."
Plus: case ID · current issue · required action · relevant evidence · next step. Kills "What do I even say at the bank?"

**The CSC card** (SHOW_CASE_AT_CSC) — case ID · issue · required action · evidence · next step. Supports assisted-digital reality without building a CSC platform.

**calculateCitizenAction(case)** — engine function:
```typescript
{ required: false, action: null, reason: "STATE_VERIFICATION_PENDING" }
// or
{ required: true, action: { id: "COMPLETE_EKYC", ... }, estimatedEffort: "LOW" }
```
`estimatedEffort` is engine-internal (decides presentation), never shown as a score. **We do not gamify government problems** — no counters, no "3 actions remaining." Only "Your next step: …" or "No action needed from you."

---

## 10. Evidence & provenance

Every displayed fact carries provenance. AI explanations are never presented as government facts.

```typescript
type Evidence = {
  id: string
  source: string                          // e.g. "PM-KISAN KYS (simulated)", "Citizen report", "Rule R1"
  sourceType: "OFFICIAL" | "CITIZEN_REPORTED" | "SYSTEM_DERIVED" | "AI_INTERPRETED"
  verifiedAt: Date
  value: string
  confidence: number                      // internal
}
```

| Example | sourceType |
|---|---|
| "₹2,000 credited, UTR 1234…" | OFFICIAL |
| "My payment didn't arrive." | CITIZEN_REPORTED |
| "This looks like a payment failure." | AI_INTERPRETED |

**Citizen completion of an action is CITIZEN_REPORTED until an OFFICIAL signal confirms it.** (e-KYC "done" by the citizen ≠ e-KYC verified.)

---

## 11. Government adapter

> **Raasta currently uses simulated government-service signals based on publicly documented PM-KISAN workflows. It does not access live individual government beneficiary data.**
> We are proving the product experience and decision model, not claiming government data access. Never say "we connected to PM-KISAN", "live farmer data", "real-time PM-KISAN status", "live beneficiary verification" or "live government API" unless an authorised integration is implemented and verified.

```text
                    CASE ENGINE
                        ▲
                        │
                GovernmentAdapter
                   /          \
        MockGovernmentAdapter   PMKisanOfficialAdapter (future)
```

The Case Engine and UX never know which adapter produced the signal — an authorised official integration could be added later without changing either.

```typescript
interface GovernmentAdapter {
  getBeneficiaryState(identifier: string): Promise<GovernmentState>
  getPaymentStatus(identifier: string): Promise<PaymentStatus>
  getKycStatus(identifier: string): Promise<KycStatus>
}
```

### Demo mode — hard rules
1. Every demo case labeled **"Demo case"** / **"Simulated official signal"** — visibly, persistently.
2. Demo identifiers are obviously fake (e.g., `RAAS-DEMO-0001`). No realistic-looking private data.
3. Dev-only endpoint drives simulated official signals: `POST /api/cases/:id/simulate-signal` (blocked outside demo mode).
4. "Last verified: Today, 5:12 PM" — never "Updated just now" without a real authorised live integration.
5. Honesty with judges is a feature, not a risk.

---

## 12. Data model (PostgreSQL)

| Table | Key columns |
|---|---|
| `citizens` | id, name, mobile, language, created_at |
| `cases` | id, citizen_id, service (PM_KISAN), problem_type, current_state, lifecycle, next_actor, citizen_action (jsonb), retry_count, last_verified_at, is_demo, created_at, updated_at, resolved_at |
| `case_events` | id, case_id, previous_state, new_state, actor, event_type, metadata (jsonb), created_at — *the complete timeline, automatic* |
| `case_states` | state_key, human_title, human_explanation, color, next_actor, default_next (seeded catalog) |
| `evidence` | id, case_id, source, source_type, verified_at, value, confidence |
| `actions` | id, case_id, action_id, status (PENDING/DONE), completed_at |
| `sources` | id, name, url, type (OFFICIAL/DERIVED), last_checked_at |
| `notifications` | id, case_id, channel, kind (STATE_CHANGED/ACTION_REQUIRED), body, sent_at |

---

## 13. API contract (MVP)

```text
POST /api/cases                      create (from intent + identifier)
GET  /api/cases/:id                  case + current state + next action + chain
GET  /api/cases/:id/timeline         event history
POST /api/cases/:id/transition       engine transition (verified trigger)
POST /api/cases/:id/action           complete citizen action → re-evaluate → wait for official confirmation
POST /api/cases/:id/message          human message on the case (AI understand)
GET  /api/cases/:id/next-action      calculateCitizenAction output
POST /api/cases/:id/simulate-signal  DEMO ONLY — inject official-style signal
```
AI (intent extraction) is encapsulated behind the case service — no giant generic AI endpoint.

---

## 14. Frontend

```text
/                          entry — "What happened?" (no carousel, no tour)
/case/:id                  the one screen that matters
/case/:id/action           only when citizen action required
/case/:id/details          optional deep-dive (progressive disclosure L4–L5)
/case/:id/resolved         resolution
```

### Entry (locked)
> **What happened?**
> 💰 My payment didn't arrive
> ⏸️ My payment stopped
> ❓ Something else
> 🎙️ Tell us instead *(voice — stretch)*

### Case screen (locked)

```text
┌─────────────────────────────┐
│ PM-KISAN · Demo case        │
│                             │
│ Your payment is delayed     │
│                             │
│ WHY?                        │
│ Payment verification is     │
│ still pending.              │
│                             │
│ NEXT ACTION                 │
│ 🟠 State verification       │
│                             │
│ YOUR ACTION                 │
│ Nothing right now.          │
│                             │
│ WHAT HAPPENS NEXT?          │
│ Verification → Processing   │
│ → ₹2,000 credited           │
│                             │
│ Last verified: 5:12 PM      │
└─────────────────────────────┘
```

### Zero-action state (special design attention)
Never a disabled-looking "No action required." Actively reassure:
> **You don't need to do anything right now.**
> We're waiting for the next update. We'll tell you when something changes.

### One-action state
One primary action ("Complete e-KYC") + Why + "Your case will continue automatically." Done → "Waiting for official confirmation" (status updates can take time).

### Progressive disclosure
L1 title → L2 why → L3 who acts → L4 details (UTR, bank, dates) → L5 technical explanation (only if requested). The citizen should never see PFMS/FTO/NPCI unless they ask.

### Design language
Calm, not bureaucratic. Trustworthy, not flashy-AI. Human, not enterprise. Clear, not dense. **"Almost boring" is the compliment we want.** Generous whitespace, large typography, restrained color, one dominant action, clear hierarchy, simple timeline, semantic status indicators, familiar iconography, ~zero decorative UI. Avoid: dense dashboards, excessive cards, AI animations, giant chat bubbles, gamification.

### Color semantics (always paired with text/icon — never color alone)
Green = resolved/verified · Amber = waiting/another party acting · Red = citizen action/attention · Neutral = processing/information.

---

## 15. Notifications

- **No change → silence.** No "Good morning! Your case is still pending!"
- **Meaningful change → notify.** "Your PM-KISAN case changed — state verification is complete."
- **Citizen action required → notify prominently.** "Your case needs one thing from you."
MVP channels: in-app (+ Telegram/browser as stretch).

---

## 16. The four demo journeys (locked)

| # | Journey | Scripted official signals | Shows |
|---|---|---|---|
| **J1** | **Farmer action** — payment missing → e-KYC | EKYC INCOMPLETE → *(citizen completes e-KYC)* → EKYC COMPLETE (official) → PAYMENT PROCESSING → CREDITED | The one-action state; citizen action ≠ official confirmation; case continues automatically |
| **J2** | **Government action** — payment missing → physical verification | PAYMENT PROCESSING → VERIFICATION PENDING → *(state acts)* VERIFICATION COMPLETE → PAYMENT PROCESSING → CREDITED | The zero-action state; "The state has the next action"; long wait made tolerable |
| **J3** | **Payment failure** — transaction failed → reprocessing | PAYMENT FAILED (reprocessing available) → REPROCESSING → PAYMENT PROCESSING → CREDITED | Failed ≠ visit bank; system/state reprocesses; farmer does nothing |
| **J4** | **No action** — payment processing → credited | PAYMENT PROCESSING → CREDITED | Proves not every problem requires a task |

Plus an escalation path (unit-tested, not a demo journey): repeated failures → retry guard R6 → CITIZEN_ACTION_REQUIRED (bank card / CSC / grievance).

### Killer demo moment
Judge: "What does the farmer need to do?" → Screen: **NOTHING.** → "The state has the next action." That communicates the thesis more powerfully than 20 AI features.

---

## 17. AI — five legitimate jobs, and no more

1. **Understand** — natural language → structured intent `{ intent: PAYMENT_MISSING | PAYMENT_STOPPED | OTHER, service: PM_KISAN, language }`
2. **Translate** — government terminology → human terminology
3. **Explain** — why is this happening (as AI_INTERPRETED evidence, never OFFICIAL)
4. **Prepare** — grievance drafts, bank/CSC cards, document extraction
5. **Communicate** — voice / local-language interaction (stretch)

**AI is not the source of truth. AI receives → extracts intent → the deterministic rules engine takes over.** LLM output never directly mutates official case state. AI earns its place only by reducing the person's workload — no "AI agent for the sake of saying agent," no autonomous eligibility/government decisions, no replacing deterministic rules with LLM guesses.

---

## 18. MVP boundary

**Build:** natural-language intake · optional voice (if stable) · case creation · persistent case · state machine (6–8 realistic states) · next actor · minimum citizen action · timeline · evidence/provenance · AI explanation · multilingual display (EN + HI from day one) · 4 demo journeys · resolution flow · last-verified timestamp · mock government adapter.

**Don't build:** real payment integration · real banking integration · unauthorised government integration · all PM-KISAN workflows · all government services · full CSC platform · full grievance platform · admin analytics · agents everywhere.

---

## 19. Implementation order (locked)

1. **Phase 1 — Product contract** ✅ *this document*
2. **Phase 2 — State engine** — createCase · applySignal · decideNextState · completeCitizenAction · getNextActor · calculateCitizenAction · resolveCase · rules table · contract-tested
3. **Phase 3 — Database** — tables + seeded state catalog
4. **Phase 4 — Government adapter** — MockGovernmentAdapter + 4 scripted journeys
5. **Phase 5 — API** — case operations + demo simulate-signal
6. **Phase 6 — Frontend** — Entry → Case → Action/Wait → Timeline → Resolution
7. **Phase 7 — AI** — intent extraction, explanation, translation, preparation
8. **Phase 8 — Polish** — typography, spacing, motion, accessibility, loading, errors, mobile

Ordering principle: state engine before database, functional correctness before visual polish.

---

## 20. Testing

**User test (5 people who know nothing, no explanations, observe):**
1. "What happened?" — can they answer?
2. "Who needs to act?" — can they answer?
3. "What do you need to do?" — can they answer?
4. "What happens next?" — can they answer?
5. "Would you keep checking the government portal yourself?" — target: **"No. I'd wait for this to tell me."**
If we need to explain the product, we failed.

**Product test (every feature):**
1. Does this use a real signal/state?
2. Does this reduce uncertainty?
3. Does this reduce human work?
4. Can we explain it in one sentence?
5. Can a citizen understand it without government terminology?
6. Are we pretending to have an integration we don't have?
Fail any → kill or simplify.

---

## 21. Public build narrative (LinkedIn)

- **Day 1 ✅:** broad landscape → many services investigated → ideas eliminated (EPFO: improving + crowded; land records: digitised + crowded; electricity: weak recurring failure pattern; scholarships: state/central split too big for 4 days; RTO: no single strong failure moment) → PM-KISAN pain identified.
- **Day 2 ✅:** Problem → Evidence → Constraints → Solution; studied existing PM-KISAN infrastructure; refused to force AI in; found the citizen/system coordination gap; Recovery Case + Responsibility Baton + Minimum Human Action → one object (CitizenCase).
- **Next:** reveal solution/architecture → begin building → demonstrate actual implementation → test → iterate → final product.

**Voice:** Founder + Product Engineer. Show reasoning, elimination, research, tradeoffs, constraints, architecture, product psychology, why things were rejected. No hype, no "revolutionary," no pretending integrations exist, no "AI agent solves everything," no generic startup language. Audience: senior people, founders, CTOs — demonstrate actual product judgment.

---

## 22. Decisions log

| Date | Decision | Status |
|---|---|---|
| 2026-08-27 | Product, name, thesis, pillars, state library, rules, adapter strategy, evidence, journeys J1–J4, MVP boundary frozen | ✅ LOCKED |
| 2026-08-27 | Stack: Next.js 15 + TypeScript + Tailwind, PostgreSQL (Supabase), Drizzle ORM, port 3998 | ✅ IMPLEMENTING (veto anytime) |
| 2026-08-27 | **Persistence deferred by design:** complete case experience built against the in-memory demo store + MockGovernmentAdapter FIRST. Supabase becomes persistence afterwards — it must not block product development. | ✅ LOCKED |
| 2026-08-27 | UI consolidated to two routes: `/` and `/case/:id` (action, details, timeline, resolution render inline on the one case screen) — the four-question block must never be broken across pages. See docs/STATE_TO_EXPERIENCE.md. | ✅ LOCKED |
| 2026-08-27 | MVP identity: no auth; demo case IDs (`RAAS-DEMO-…`); visible "Demo case" banner; OTP lookup post-MVP | ✅ IMPLEMENTING |
| 2026-08-27 | Language: EN + HI display strings for all states from day one (one i18n JSON); Web Speech voice-in as Day-3 stretch behind a flag | ✅ IMPLEMENTING |
| 2026-08-27 | After citizen completes an action → wait for OFFICIAL confirmation signal before claiming verified (never trust self-report) | ✅ LOCKED |

## 23. Progress log

- **2026-08-27 (Day 2):** Contract v1.1 frozen. Phase 2 state engine implemented and contract-tested (journeys J1–J4 + escalation + rules priority + evidence provenance). Phase 3 schema written (not migrated). Scaffold: Next.js 15, TS, Tailwind, Drizzle, vitest.
- **2026-08-27 (Day 2, continued):** docs/STATE_TO_EXPERIENCE.md — the 11-state → UX mapping (the frontend contract). Phase 5 API routes (create/get/action/simulate-signal/next-action; in-memory demo store; thin routes, no duplicated business logic). Phase 6 UI — entry ("What happened?") + the one case screen (four-question block, zero-action reassurance, one-action CTA with bank/CSC cards, progressive disclosure with provenance badges, timeline, demo controls, EN/हिंदी). **18/18 tests passing** (13 engine + 5 API journey e2e). Production build clean. J1, J3 and the Hindi toggle verified live in a real browser against the dev server. Engine fix: `pendingConfirmation` now clears on the official confirmation signal (ACTION_CONFIRMED event) — the trust boundary was wired but never cleared.
- **2026-08-27 (Day 3, UX audit round):** Browser-audited J1–J4 against the experience checklist. Fixed: (1) citizen timeline no longer leaks `SIGNAL_RECEIVED`/internal signal events (audit-only in the engine); (2) simulated signals now stamp `verifiedAt` at application time — "Last verified" and evidence timestamps move believably (were frozen at module load); (3) case ID now visible on the case screen; (4) handoff cards carry real values (case ID, issue, action, next step) instead of section labels; (5) "Something changed — {new state}" banner on transitions (contract §15 demo moment); (6) evidence values humanized (KYS-style copy, never `VERIFICATION_STATUS` enum names). **Data/integration boundary made explicit everywhere** (README, contract §11, adapter/source comments, demo UI, entry footer): simulated government-service signals based on publicly documented PM-KISAN workflows — no live individual beneficiary data, no live integration implied.
- **2026-08-27 (Day 3, persistence + AI intake round):** Copy refinement (locked with the user): verification headline now states the state — "Your benefit is temporarily on hold" / Why carries the nuance — "Your eligibility is being verified. This is not a rejection."; "Payment reprocessing" kept (accurate process concept), spelled out in the explanation: "Payment reprocessing — the payment is being processed again after verification." **Phase 1 — Supabase persistence:** `persistence.ts` (snapshot semantics: case row + events + evidence rewritten atomically per mutation; sources seeded); store is backend-agnostic — memory (no `DATABASE_URL`) vs supabase, decided by env, never by call sites; engine/rules/adapter abstraction untouched; **no auth, no accounts**; journey cursor persisted so demo cases resume after refresh. Migration generated (`drizzle/0000_fair_scrambler.sql`); activate by setting `DATABASE_URL` + `npm run db:push`. **Phase 2 — the one AI capability:** free-text intake — "Tell us what happened" → structured intent `{service, intent, context, language}` → deterministic engine. Rule extractor active (no key, tested); LLM extractor is a drop-in behind the same interface. Citizen's words become `CITIZEN_REPORTED` evidence ("You told us: …"); detected language sets the UI default (Hindi intake opens a Hindi case); AI failure never blocks the deterministic journeys. **28/28 tests + tsc clean; intake (EN + HI) and new copy verified live in browser.**
- **Next (Day 3/4):** user testing (5 people, no explanations — the four questions) · demo polish · Day 4: LinkedIn reveal ("after two days of research, here's what we actually built") once the AI flow and at least one genuine user-test observation exist.

*Anything not in this document is not in the MVP.*
