# Raasta

> **Government complexity. One clear next step.**
> रास्ता — the way forward. "Tell me what happened. Show me the way forward."

A citizen case system that turns complex government process states into one clear
next step — or tells the citizen when no action is required. Built for
**Build What Moves India** (Varun Mayya × OpenAI), scoped to **PM-KISAN**.

## Data / integration boundary — read this first

> **Raasta currently uses simulated government-service signals based on publicly documented PM-KISAN workflows. It does not access live individual government beneficiary data.**

This prototype demonstrates the **experience and decision model** that could sit on
top of authorised government signals in the future. The `GovernmentAdapter` is a
simulation layer (`MockGovernmentAdapter`): all cases are **"Demo case"** entries
driven by **"simulated government signals"**, shaped like the real KYS surface
(payment status, bank name, UTR, payment mode, credited status/date, e-KYC status).

The product does **not** connect to PM-KISAN, does not pull live farmer data, and
implies no live government API. An authorised `OfficialGovernmentAdapter` could be
added later behind the same interface **without changing the Case Engine or UX**.

## Thesis

- **Product:** Government systems are designed around processes. Citizens experience outcomes. Raasta connects the two.
- **Engineering:** Rules determine reality. AI explains reality.
- **UX:** Never make the citizen understand the system to use the service.
- **Product:** If technology cannot reduce human work, don't add it.
- **North star:** Complex system → one clear next step.
- **Trust:** Confidence without false certainty — clarity about who acts next, never unsupported promises about outcomes.

## The core interaction

Every case screen answers four questions immediately:

1. **What happened?**
2. **Who has the next action?**
3. **What do I need to do?**
4. **What happens next?**

If the citizen has no required action, the screen says: **"You don't need to do
anything right now."** The case tracks itself — no follow-up burden, notifications
only on meaningful change.

## Architecture

```text
            CITIZEN (text, EN/HI)
                 │
                 ▼
        AI INTERFACE (understand only — Phase 7)
                 │
                 ▼
          CASE ENGINE (persistence, timeline, evidence)
                 │
                 ▼
        RULES ENGINE (deterministic: state, next actor, minimum action)
                 │
        ┌────────┴─────────┐
        ▼                  ▼
  GOVERNMENT ADAPTER   AI EXPLANATION (assistive, never authority)
  ┌────────────────┐
  │ Mock (today)   │  →  Official (future, same interface)
  └────────────────┘
```

**Truth → Logic → Interpretation → Experience.** Government signals are the only
thing that may mutate official case state. The citizen completing an action is
`CITIZEN_REPORTED` and waits for an `OFFICIAL` confirmation signal before the case
claims anything is verified.

## Stack

Next.js 15 (App Router, TypeScript, Tailwind v4) · Drizzle ORM schema (PostgreSQL
via Supabase — **persistence deferred by design**; the experience runs on an
in-memory demo store) · Vitest for contract tests.

## Run it

```bash
npm install
npm run dev        # http://localhost:3998
npm test           # 18 contract + journey tests
npm run build
```

## Demo journeys (all simulated)

| # | Journey | Shows |
|---|---|---|
| J1 | Farmer action — e-KYC | One-action state; citizen self-report ≠ official confirmation |
| J2 | Government action — verification | Zero-action state; "the state has the next action" |
| J3 | Payment failure — reprocessing | Failed ≠ visit the bank; farmer does nothing |
| J4 | No action | Not every problem requires a task |

## Repository layout

```text
docs/PRODUCT_CONTRACT.md       frozen product contract (source of truth)
docs/STATE_TO_EXPERIENCE.md    state → UX mapping (frontend contract)
src/domain/                    types, state catalog (EN+HI), rules, engine, journeys
src/adapters/                  GovernmentAdapter interface + MockGovernmentAdapter
src/server/                    in-memory demo case store + case → UI projection (DTO)
src/app/api/cases/             thin API routes over the engine
src/app/                       entry + the one case screen (EN/हिंदी)
```

## Status

Day 3/4: contract frozen · state engine contract-tested · API + case experience
built and browser-verified · UX audit round fixed (timeline leaks, frozen
timestamps, invisible case ID, placeholder cards, abrupt transitions) ·
Supabase persistence implemented (activate with `DATABASE_URL` + `npm run db:push`,
no auth) · free-text AI intake live (EN + HI, deterministic extractor, LLM
drop-in behind the same interface) · **28/28 tests** · user testing next.
