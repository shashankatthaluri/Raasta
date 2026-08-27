# Raasta — Recovery Product Spec

> Companion to `PRODUCT_CONTRACT.md` (frozen) and `PM_KISAN_RECOVERY_MATRIX.md` (research).
> This spec is the implementation contract for the **end-to-end citizen recovery system** evolution.
> **Data / integration boundary:** Raasta currently uses simulated government-service signals based on publicly documented PM-KISAN workflows. It does not access live individual government beneficiary data. No live integration is claimed or implied.

---

## 1. Thesis — re-locked

Previous thesis (kept): *Complex government process → one clear next step.*

Stronger promise (new): **"Raasta turns a government status into a recovery plan."**

- A farmer knows only: *"My PM-KISAN money didn't come."*
- Raasta: **Identify → Check → Detect → Diagnose → Explain → Recover → Act/Wait → Track → Follow up → Escalate → Resolve** — without the citizen ever diagnosing, explaining, searching, or coordinating the process themselves.
- We are NOT rebuilding PM-KISAN/KYS/grievance. We are the layer **above** the signals: interpretation, recovery path, effort reduction, execution help, case follow-through, escalation, resolution.

Success criterion (§18 of the direction): a farmer starting with only *"my money didn't come"* can reach:

> I understand what happened. I know why. I know who is responsible. I know whether I need to act — and if so, exactly how, what to take, what happens afterward, when to expect movement, what happens if it gets stuck. And I don't have to keep coordinating this myself.

If the result is only *"here is your status and some instructions"*, the thesis failed.

## 2. The end-to-end journey (demo = one complete story)

1. Farmer: *"My PM-KISAN money didn't come."*
2. **Entry:** "Let's check your PM-KISAN" — enter registration number (demo identity, clearly labeled).
3. **Identity:** simulated OTP (displayed as demo) → record found (demo farmer).
4. **Check:** Raasta retrieves the simulated KYS-style signals.
5. **Detect:** what changed vs the expected-good baseline (previous instalment credited; latest not).
6. **Diagnose:** rules map signals → state → recovery path.
7. **Explain:** human language, four questions answered on one screen.
8. **Act or wait:** one action (exact steps/where/what to take/what to ask/after) — or *"You don't need to contact anyone yet"* with full wait context.
9. **Dispute** (if the citizen says the official record is wrong): show official record + capture citizen's side + prepare the review/grievance (citizen reviews; handoff labeled simulated).
10. **Track:** same case persists; events accumulate; "Last verified" moves.
11. **Stuck:** if no movement, show the verified escalation surface + prepared next action.
12. **Resolve:** official signal changes → same case progresses → resolution explains the final state.

The farmer never restarts the story.

## 3. Recovery decision model

```text
Government signal (simulated KYS) → deterministic rules → case state → recovery path type → playbook → citizen experience
```

Path types (conceptual branches from the direction):

| Type | Trigger | Experience shape |
|---|---|---|
| **A. CITIZEN_CORRECTABLE** | Official state the citizen can legitimately correct (e.g., eKYC incomplete) | Problem → Why → What needs fixing → Exact steps → Where/how → What to take → What to ask for → After → When to check again |
| **B. GOVERNMENT_ACTION** | State/system holds the next action (e.g., verification pending) | Problem → Why → Responsible authority → Current stage → Expected official window *if verified* → What Raasta is waiting for → no unnecessary action → automatic progression on signal change |
| **C. CITIZEN_DISPUTED** | Official record says X; citizen says X is wrong | Show official record → capture citizen's side (CITIZEN_REPORTED) → "You can ask for this to be reviewed" → verified review/grievance route → prepare request → citizen reviews. **Never decide government is wrong.** |
| **D. SYSTEM_PAYMENT_FAILURE** | Payment failed | What happened → why/known reason → who owns next step → reprocessing possible? → what citizen should/shouldn't do → track until credited or actionable |
| **E. NO_PROBLEM** | On-track processing | "Your payment is currently being processed" → who owns it → what happens next → official window if verified → what Raasta watches for. Do not manufacture a problem. |

## 4. Playbook schema

Every state (+ cause, for `CITIZEN_ACTION_REQUIRED`) carries a recovery playbook. **No playbook may contain invented facts** — every field is traceable to the matrix tag (VERIFIED/PENDING/UNKNOWN) and rendered accordingly.

```typescript
type RecoveryPathType =
  | "CITIZEN_CORRECTABLE" | "GOVERNMENT_ACTION" | "CITIZEN_DISPUTED"
  | "SYSTEM_PAYMENT_FAILURE" | "NO_PROBLEM";

type RecoveryPlaybook = {
  pathType: RecoveryPathType;
  headline: { en: string; hi: string };      // "Something changed" / "Everything looks on track"
  why: { en: string; hi: string };           // official-state meaning, human language
  owner: Actor | "UNKNOWN";                  // who has the next action — never a hard-coded
                                             // department unless verified for this workflow
  citizenAction: {
    required: boolean;
    action?: {
      id: CitizenActionId;
      steps: { en: string; hi: string }[];   // exact steps
      where: { en: string; hi: string };     // official channel
      take: string[];                        // what to take — verified only, else omitted
      askFor: { en: string; hi: string };    // what to say/ask for
      after: { en: string; hi: string };     // what happens afterwards
      checkAgain?: string;                   // when to check (only if verified)
    };
  };
  nextProcess: { en: string; hi: string }[]; // "What happens next" chain
  window:                                    // official window — no invented SLAs
    | { verified: false }                    // → render: "No official resolution time is available for this step."
    | { verified: true; value: string; source: string };
  raastaWatches: { en: string; hi: string }; // what the case is watching for
  ifNothingHappens: { en: string; hi: string }; // verified escalation surface, or honest "route being verified"
  resolutionCondition: { en: string; hi: string };
  provenance: { verified: string[]; pending: string[] }; // matrix tags for every fact rendered
};
```

## 5. Responsibility model

- The case answers, at every point: **"Who has the next action?"** — unmistakable in the UI.
- Actor set: CITIZEN · BANK · CSC (authorised service channel) · STATE/DISTRICT AUTHORITY · PAYMENT SYSTEM · CENTRAL SYSTEM · **UNKNOWN/NOT VERIFIED**.
- A real department/person is only named when verified for that specific workflow (matrix P-tags). Otherwise the UI says the verified category ("State verification team" as a *category*, not an invented office) — or **UNKNOWN**, honestly.

## 6. "Wait" must always have context (the zero-action evolution)

When there is no citizen action, the screen does NOT stop at "Nothing right now." It renders the **wait-context block**:

- **"You don't need to contact anyone yet."** *(active reassurance — upgraded from "do anything")*
- **What is currently happening** — plain language
- **Who owns the next action** — the actor block
- **What process happens next** — the chain
- **Official time window, if verified** — else: *"No official resolution time is available for this step."* (never an invented SLA; distinguish a service/handling target from a guaranteed resolution date)
- **What Raasta is watching for** — the specific signal (e.g., payment status change)
- **What happens if the expected progress doesn't occur** — verified escalation surface or honest "being verified"

## 7. Escalation model ("what if nothing happens?" — first-class)

- Every waiting state answers: what are we waiting for · who owns it · when should we expect movement (only if verified) · what official source supports that expectation · what happens if the window passes · what is the verified escalation route.
- Verified surfaces (matrix): Helpdesk Query Form + Appeal on pmkisan.gov.in; state grievance mechanisms (official document exists). Exact per-path routes remain PENDING — until then the UI says the route is being verified, never invents contacts.
- No invented SLAs, grievance categories, or escalation contacts.

## 8. Grievance model

- The farmer never figures out: category, wording, which facts matter, documents, chronology.
- Raasta prepares a **structured grievance** from: verified case evidence (official facts: previous credit, latest failure, official reason, dates, current owner) + the citizen's own statement (exact words, CITIZEN_REPORTED) + only verified/relevant documents.
- **"Your grievance is ready." → [Review]** — the citizen is the final authority before any handoff.
- Prototype: full prepare + review experience; final handoff **labeled simulated/demo** — never a faked successful submission to a live government system.

## 9. AI boundary (unchanged, re-affirmed)

- AI **may**: understand natural-language descriptions · detect intent · translate · explain terminology · collect missing information · structure the citizen's explanation · draft a grievance from verified facts · assist document understanding · (eventually) voice/local-language — only where it reduces effort.
- AI **must NOT**: decide official eligibility · change official government state · invent reasons, authorities, documents, timelines, escalation routes · claim an action happened when it did not.
- Architecture: `Government signal → deterministic rules → case state → recovery playbook → AI explanation/preparation`. **Rules determine reality. AI explains and prepares.**

## 10. Demo boundary

- Entry: "Let's check your PM-KISAN" — **demo registration number** (e.g., `DEMO-REG-0001`) → **simulated OTP** (displayed on screen) → **demo farmer record** (Ramesh Kumar, simulated, clearly labeled).
- Persistent labels: **"Demo case"** · **"Simulated government signal"** · the standard boundary sentence on the entry footer.
- Never imply live identity verification, live KYS, or live submission.

## 11. UX states — what the farmer sees

The farmer sees (never the machinery):

```
WHAT HAPPENED?        WHAT HAPPENS AFTER?
WHY?                  WHEN WILL IT MOVE?      (only if verified)
WHO HAS THE NEXT ACTION?   WHEN WILL IT MOVE? — or the honest "no official time available"
WHAT DO I NEED TO DO?     WHAT IF IT DOESN'T?    (verified escalation surface)
WHAT DO I NEED?            WHAT ARE YOU TRACKING FOR ME?
WHERE DO I GO?             LAST VERIFIED
```

- **Entry:** "Let's check your PM-KISAN" + registration input + EN/हिंदी immediately. No onboarding. Secondary path: *"Or tell us what happened"* (existing free-text intake).
- Radical simplicity is the metric: the UI must feel dramatically simpler than the system underneath. One problem → "Raasta owns the complexity."

## 12. Exact MVP scope

**In (minimum changes to the existing product):**
1. Entry → check flow: "Let's check your PM-KISAN" + demo identity (reg number → simulated OTP → demo farmer) — free-text intake stays as secondary path
2. Detection framing: "Something changed" / "Everything looks on track" (derived from state category — no new engine logic)
3. Recovery playbooks attached to the existing states for the six matrix paths (P1–P6) — data + renderer, engine untouched
4. Wait-context block (the zero-action evolution) rendered from the playbook when no citizen action
5. Grievance preparation for the dispute path: official record + citizen statement + structured draft + Review; handoff labeled simulated
6. Escalation section: verified surfaces + honest unknowns; no invented SLAs/contacts
7. Updated tests (journey scripts get the check preamble) + browser verification

**Out (anti-super-app, per direction §14):** dashboards · universal chatbot · agents everywhere · notification noise · social · broad service catalog · accounts/auth beyond the demo identity · generic AI assistant · voice (unless it clearly reduces effort) · features that don't materially reduce cognitive load or physical effort.

**Deferred by the matrix (not in MVP):** `BANK_DETAILS_CORRECTION`, `ELIGIBILITY_EXCLUSION`, `GRIEVANCE_OPEN` states — PENDING/UNKNOWN until the research supports them; no new engine states until then.

## 13. What code changes (minimal, honest)

- **Stays untouched:** case engine, rules, state library, provenance/evidence model, GovernmentAdapter abstraction, MockGovernmentAdapter, persistence, AI extractor interface, EN/HI foundation, confidence-without-false-certainty principle, trust boundary, the existing 28 tests (extended, not replaced).
- **Changes:** entry page + demo identity component · playbook data module (matrix-backed) · DTO + case screen renderers (wait-context block, escalation, grievance prep) · journey scripts (check preamble) · tests.
- **No new states** until the matrix upgrades PENDING → VERIFIED/UNKNOWN and proves a state change is required.

## 14. Build order (after this spec is accepted)

1. Extract operational guidelines + FAQ PDFs (requires consent for a PDF extractor install) → upgrade matrix tags
2. Lock the matrix → implement entry/check flow → playbooks → wait-context → grievance prep
3. Tests + browser verification of the complete end-to-end story
4. User test (minimum 1–3 real sessions) against the NEW entry
5. Report: research changes · verified paths · unknown paths · product-model changes · code changes · what remains simulated · end-to-end demo · tests
