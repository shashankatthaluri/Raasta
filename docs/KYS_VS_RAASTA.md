# KYS vs Raasta — what the farmer receives, side by side

> Audit rule (locked): *If a Raasta screen doesn't contribute to the Raasta column, question why it exists.*
> KYS column verified from the actual page (`pmkisan.gov.in/BeneficiaryStatus_New.aspx`, fetched 2026-08-27 — field labels below are from the live form).
> Raasta column = current build (✅ exists) + locked spec (❌/⚠️ not yet built).

## The side-by-side

| KYS gives the farmer (verified) | Raasta gives the farmer |
|---|---|
| Registration number → captcha → OTP gate | Language gate → "Let's check your PM-KISAN" → registration number (demo) — **same identity model, lower barrier, no captcha** |
| **Payment status** (processing / failed / credited) | **What happened** — human title, not "status: failed" |
| UTR / UR number | The same transaction reference, inside a case (Details) |
| Bank name | The same bank, inside the case (Details) |
| Payment mode | The same mode (Details) |
| Credited status + date | **Resolution** — "₹2,000 was credited" + official evidence |
| e-KYC status (financial-year-wise) | **Can I fix it? → How** — the e-KYC action card (steps, where, after) |
| **Reason of stop payment** | **Why** — the official reason translated into human meaning |
| **Reason of ineligibility + date** | Why (ineligibility context) — never "you are ineligible" without nuance |
| **Payment revocation date** | Timeline event + evidence |
| **Recovery / Refund** indicators | Evidence row with provenance |
| — | **Who has the next action?** (the actor block — KYS never says) |
| — | **What happens next?** (the chain — KYS never says) |
| — | **What do I need to do?** ("Nothing right now" / one action — KYS never says) |
| — | **Last verified** (a timestamp — KYS shows data with no "as of" honesty) |
| — | **What's been happening** (a citizen timeline — KYS has none) |
| — | **Provenance** (Official / You told us / AI explanation — KYS has none) |
| — | **What if it doesn't move?** — ❌ spec'd, not built |
| — | **Review / grievance from the case** — ❌ spec'd (P7), not built |
| — | **Follow-up loop** (we're watching; escalation if the window passes) — ❌ spec'd, not built |

## What KYS does NOT give (the entire differentiation)

KYS is a **read-only mirror of the record**: status, references, reasons. It never answers:
who acts next · whether the citizen must act · what to do · what to take/ask ·
what happens after · what happens if nothing moves · a way to respond to a wrong
record · a persistent case · any follow-up. (The portal's grievance form is a
separate, disconnected flow.)

## Audit verdict — current screens vs the column

**Survive (they contribute):** entry/check · case screen (happened → why → actor →
action → chain) · details + provenance · timeline · last-verified · resolution ·
demo boundary. **Questioned:** demo controls — dev tooling for the demo, not
product; candidate for collapse post-test. Nothing else fails the audit.

**Missing — the build list for the frozen MVP journey (in order):**
1. **Payment-failure flow made complete** (current J3 + wait-context): what we're
   waiting for · expected official window *or* the honest "no official resolution
   time is available for this step" · what happens if it doesn't move (verified
   escalation surface).
2. **Dispute path**: "Government record says X · You told us Y" → "You can ask for
   this to be reviewed" — citizen agency, never picking sides.
3. **Grievance preparation**: "We've prepared your case" → structured grievance
   from case evidence + citizen's words → Review → handoff labeled simulated.
4. **Follow-up loop**: case persists, "We're waiting for the next official update",
   escalation surfaced if the expected window passes.

## North-star test (unchanged, this doc is the evidence base for it)

A farmer gets only *"My PM-KISAN money didn't come."* After using Raasta they can
say, unprompted: *"The payment failed because X. The next step is with Y. I need to
do Z / I don't need to act yet. If it doesn't move, Raasta will help me escalate."*
If they can say that without us explaining anything, the column is complete.
