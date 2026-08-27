# Raasta — Usability Test Script (Phase 3)

**Goal:** Does Raasta reduce uncertainty and citizen effort *without the builder explaining anything?*
**Stance:** If a tester misunderstands something, it is a product defect. No optimistic interpretation.

---

## Setup (before the tester arrives)

- [ ] Fresh browser tab at the Raasta entry screen (`/`) — nothing else open
- [ ] One scenario assigned per tester (table below); do NOT show the assignment to the tester
- [ ] Recording grid ready (page 2); pen, not laptop (stay present, not typing)

## Run the session

1. Say, verbatim: *"You are a farmer who previously received PM-KISAN instalments, but this time the payment did not arrive. Use this to figure out what is happening."*
2. **Say nothing else.** No explanation of architecture, case, responsibility, AI, PM-KISAN workflow, or what the "right" answer is.
3. Let them interact naturally. Watch and record (page 2). Do not correct, help, or point at any UI element — even if they look stuck. Hesitation is data.
4. After they stop (or after ~5 minutes), ask the four questions **in order**, verbatim:
   1. *"What happened?"*
   2. *"Who needs to act now?"*
   3. *"What do you need to do?"*
   4. *"What happens next?"*
5. Then: *"If this were a real situation, would you feel comfortable stopping here and waiting?"*
6. Do not ask "Did you like it?", "Is this useful?", "Would you use this?" — these invite yes-answers.

## Scenario assignment (5 testers, all four journeys covered)

| Tester | Scenario phrasing (say this) | Target journey |
|---|---|---|
| T1 | "You used to get the money every time, but this time it didn't arrive." | J3 — failure → reprocessing (killer moment) |
| T2 | "The payments stopped after some time." | J2 — state verification |
| T3 | "Your payment didn't arrive this time, and you're not sure why." | J1 — e-KYC citizen action |
| T4 | "You just want to know what's happening with your payment." | J4 — processing → credited |
| T5 | Same as T1. | J3 (thesis journey, second data point) |

If the tester lands on a different journey than targeted, **record the journey they actually took** and mark it — deviation is data, not failure.

## Watch-for list (record during interaction)

- [ ] Exact words/answers (quote them)
- [ ] Hesitation moments (where, how long)
- [ ] Wrong interpretations (what they believed)
- [ ] Terminology that confused them (name it)
- [ ] Where they looked / what they clicked (path)
- [ ] Did they understand the timeline? ("What's been happening")
- [ ] Did they understand "Nothing right now"? (did they believe it?)
- [ ] Did they trust the information? (skepticism, re-reading, asking "is this real?")
- [ ] Did they know what to do next after each screen?

## Recording grid

| Tester | Journey | What happened? | Who acts? | What do I do? | What's next? | Hesitation / confusion |
|---|---|---|---|---|---|---|
| T1 |  |  |  |  |  |  |
| T2 |  |  |  |  |  |  |
| T3 |  |  |  |  |  |  |
| T4 |  |  |  |  |  |  |
| T5 |  |  |  |  |  |  |

## Post-test summary (after all five, fill honestly)

1. **Most common misunderstanding**
2. **Most confusing screen**
3. **Most confusing terminology**
4. **Was responsibility understood?** (who acts next — per journey)
5. **Did zero-action states feel trustworthy?** (did testers believe "nothing right now"?)
6. **Was the next-step chain understood?**
7. **Any unnecessary interaction** (anything the tester did the product made them do)
8. **One highest-impact UX change** (if none needed, say so — do not invent one)

**Do not modify the product until these observations are collected.**
Contract and architecture change only if testing reveals a genuine product-model problem.
