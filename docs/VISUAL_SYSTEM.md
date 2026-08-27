# Raasta — Visual System (proposal, awaiting approval)

> **Intent (from the panel review):** Raasta must feel like a **case-recovery system**, not a
> government status dashboard. The farmer's mental model: *"I have one problem. Raasta owns
> the complexity."* The first thing the eye lands on is the **answer** — not the process.
> **Constraint:** information architecture, functionality, copy, EN/HI, and the data boundary
> stay untouched. Zero new features. This is visual hierarchy work only.

---

## 1. The signature idea — "The Journey"

The single most distinctive visual asset: **the recovery path as a vertical journey, with the
current stage anchored, and the farmer's role visually separated from the moving process.**

```
  ●  State verification          ← CURRENT STAGE
  │     amber dot · owner badge beside it ("State verification team")
  │
  ○  Payment reprocessing
  │
  ○  Payment processing
  │
  ○  ₹2,000 credited
```

- Past = none in MVP (single current stage); future stages = dimmed circles.
- The current stage carries the **semantic color** (amber = waiting, red = citizen action,
  green = resolved) — color means something or it doesn't appear.
- A calm, slow "in motion" pulse on the current dot (not a spinner — a heartbeat: "the
  system is working, you're not").
- **The farmer is never inside the journey.** Their role lives in a separate strip below
  (see §3). That one layout decision communicates the baton concept without a word.

**Data source:** the journey is `[state title] + [chain]` — both already in the DTO. No new
data, no new fields. Implementable as a pure presentational component.

## 2. Case screen hierarchy (top → bottom)

```
Raasta for PM-KISAN · Demo                    [हिंदी ▾]
Case RAAS-DEMO-XXXX

YOUR CASE                                   ← tiny uppercase label, no box
The payment attempt was unsuccessful        ← H1 (3xl–4xl, semibold)
Payment needs further verification.         ← why, ONE short line
Payment reprocessing — the payment is being
processed again after verification.

[ ◉ Waiting · No action needed ]            ← status chip, semantic color
                                            ← the answer, in the first viewport

THE JOURNEY                                  ← tiny uppercase label
● State verification            State verification team
│
○ Payment reprocessing
│
○ Payment processing
│
○ ₹2,000 credited

NEXT MOVE   State verification team         ← responsibility strip:
YOUR PART   Nothing right now                 two lines, zero cognitive load

Last verified: Today, 1:13 pm               ← meta, secondary

What's been happening ▸                     ← quiet text links, no cards
Details ▸

Demo mode · Simulated signals   [Simulate next official signal]   [auto 3s]
Rules determine reality. AI explains reality.
```

**Why this wins:** the farmer reads the hero (what happened + why), sees the chip (the
answer: waiting / act / resolved), sees the journey (the process moves without them), sees
the strip (who + what part). Everything else is below a fold of quiet links. The four
equal-weight cards become one anchored story.

## 3. Responsibility — always two scannable lines

`NEXT MOVE` / `YOUR PART` replaces the current equally-weighted blocks. One line each, no
prose, no box. This is the "who has the next action" answer made literally unmissable.

- Waiting: `NEXT MOVE State verification team · YOUR PART Nothing right now`
- Citizen action: `NEXT MOVE You · YOUR PART Complete e-KYC` (action card then opens below
  the strip with the exact steps — the one place a container is justified, because it is
  the one interactive thing).
- Resolved: `NEXT MOVE No one · YOUR PART Nothing — your case is closed`

## 4. Entry screen — almost ridiculously simple

```
Raasta · रास्ता                            [हिंदी ▾]

Let's check your PM-KISAN
Enter your registration number.

[ 11-digit registration number      ] [ Check ]

We'll check what changed and tell you what to do next.
Demo — all government signals are simulated…

────────────── (below the fold, quiet)

Don't have your registration number?  Tell us what happened →
Demo scenarios ▸  (reveals the four cards for judges only)
```

- The check block is the product. One input row, **no card** — open on the page.
- The natural-language intake and the four demo cards lose all visual competition: they
  become quiet links below the fold. Functionality unchanged.

## 5. Visual language — kill the card density

| Now | Becomes |
|---|---|
| boxed cards everywhere | typography + spacing + hairline separators (`border-t`) |
| four equal-weight sections | one hero → one journey → one strip → quiet links |
| 4–5 container styles | 1 container style (the primary action only) |
| decorative borders | whitespace as the separator |

- **Type scale:** tiny uppercase tracking-wide labels (9–10px, muted) · H1 3xl–4xl semibold ·
  body 15–16px · meta 12–13px muted.
- **Color:** semantic only — amber (waiting), red (citizen action), green (resolved/verified),
  neutral (processing). Status chip + journey dot + resolution. Nothing decorative.
- **Trust signals kept, demoted:** "Last verified" as meta under the strip; "Official / You
  told us / AI explanation" badges stay in Details as small pills. `Rules determine reality.
  AI explains reality.` stays in the footer — unchanged.

## 6. Demo tooling

- **During testing (now):** the same controls — simulate button + auto-advance — in one
  **muted compact strip** ("Demo mode · Simulated government signals") instead of the big
  amber box. Instrumentation fully intact; visual scream removed.
- **Post-test (judge demo):** collapsible drawer, expanded only when demonstrating state
  transitions. The farmer's surface never shows it.

## 7. Scope guardrails

- **No features added.** The four recovery pieces (wait-context, dispute, grievance prep,
  follow-up) remain gated on user-test observations — this proposal does not build them,
  but the hierarchy is designed to absorb them: wait-context lands under the strip,
  dispute/grievance land as journey branches, follow-up as the case header.
- Copy, EN/HI strings, data boundary, engine, API, tests: untouched by this change.
- Pure presentational refactor of `page.tsx` (entry) + `case/[id]/page.tsx` (case screen)
  + one new `Journey` component. Tests that assert copy stay green; no new logic.

## 8. Approval checklist

1. Journey (vertical, current stage anchored, owner beside it) — approve as the signature?
2. Hero-first case screen (chip + strip in first viewport)?
3. Card → typography/separators language?
4. Entry reduced to check-only above the fold?
5. Demo controls muted strip now / drawer post-test?

---

## 9. Location-aware language pairing (spec'd post-test candidate — NOT part of this approval)

> **Status:** specced, not built. Gate: user-test observations + a deliberate translation
> decision (which languages we commit to fully translating). This section does not change
> the current approval — it documents the design so it is ready when the gates open.

### 9.1 Pattern — suggest, never lock

The entry gate shows **English + the suggested regional language** as two prominent
buttons, plus a quiet **"Other languages ▸"** link revealing the full list of
actually-supported languages. Two visible by default, all reachable in one tap.

- Location is a **default suggestion, never a lock** — a farmer geolocated to the wrong
  state must always be one tap from their language. This preserves the locked principle:
  *never require a citizen to understand a language they do not speak to choose the one
  they do.*
- **Never assert the guess.** The UI does not say "We think you're in Maharashtra" — it
  simply orders the pair. Confidence without false certainty applies to geo too.
- In-product switcher shows **all** supported languages; location only shapes the entry.

### 9.2 Suggestion sources (in priority order)

1. `navigator.language` — the device's own language setting; the best signal, free, no
   network. A phone set to मराठी almost certainly belongs to a Marathi speaker.
2. IP geolocation (server-side, when available) — enhancement only, expected to be wrong
   on mobile carriers/VPNs.
3. Fallback when both are unknown/unreliable: **English + हिंदी** (Hindi = largest
   language; the two fully-translated today).

Implementation shape: a pure `suggestedLanguage()` in `src/lib/i18n.ts` returning a
language code; gate and switcher consume it. Zero engine/API/case-model changes.

### 9.3 The translation wall (the real gate)

This pattern only earns its place **per language fully translated** — all 11 states,
5 actions, evidence/timeline labels, and chrome, AI-drafted and human-verified (the same
discipline as the recovery matrix). Showing "English + मराठी" without full Marathi copy
would violate the accessibility promise. The pattern amplifies the translation decision;
it does not replace it.

### 9.4 Demo control

Judges are VPN'd and the dev server is local, so geo is unreliable in the demo. The demo
drawer gets a **"Demo location ▾"** picker (e.g., Telangana → English + తెలుగు,
Maharashtra → English + मराठी, Delhi → English + हिंदी) so the regional-pair behavior is
demonstrable on demand, deterministically. Judge moment: *"If this farmer were in
Telangana, they'd see exactly this."*

### 9.5 Acceptance

A Maharashtra farmer sees English + मराठी prominently · a Telugu-speaking farmer can still
reach हिंदी or any supported language in one tap · the demo can simulate any state ·
no language is ever advertised before its full copy is verified.
