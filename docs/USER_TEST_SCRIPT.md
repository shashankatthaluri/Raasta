# Raasta — Usability Test Script (Phase 3)

**Goal:** Does Raasta reduce uncertainty and citizen effort *without the builder explaining anything?*
**Stance:** If a tester misunderstands something, it is a product defect. No optimistic interpretation.

---

## Part A — Run the session

### Setup (before the tester arrives)

- [ ] Fresh browser tab at the Raasta entry screen (`/`) — nothing else open
- [ ] One scenario assigned per tester (table below); do NOT show the assignment to the tester
- [ ] Recording grid ready (Part A); pen, not laptop (stay present, not typing)

### Run the session

1. Say, verbatim: *"You are a farmer who previously received PM-KISAN instalments, but this time the payment did not arrive. Use this to figure out what is happening."*
2. **Say nothing else.** No explanation of architecture, case, responsibility, AI, PM-KISAN workflow, or what the "right" answer is.
3. Let them interact naturally. Watch and record (Part A grid). Do not correct, help, or point at any UI element — even if they look stuck. Hesitation is data. (If they click "Simulate next official signal", record it — that is observation, not something to prevent.)
4. After they stop (or after ~5 minutes), ask the four questions **in order**, verbatim:
   1. *"What happened?"*
   2. *"Who needs to act now?"*
   3. *"What do you need to do?"*
   4. *"What happens next?"*
5. Then: *"If this were a real situation, would you feel comfortable stopping here and waiting?"*
6. Do not ask "Did you like it?", "Is this useful?", "Would you use this?" — these invite yes-answers.

### Scenario assignment (minimum 1–3 real sessions — five if feasible, never fabricated)

**Time-boxed: do not wait for five people.** One genuinely observed session beats five
manufactured ones; three reveal a repeated pattern. If only T1 is reachable, work with
that. Assign journeys to whichever testers you get, prioritising J3 (the thesis moment);
cover as many journeys as possible.

| Tester | Scenario phrasing (say this) | Target journey |
|---|---|---|
| T1 | "You used to get the money every time, but this time it didn't arrive." | J3 — failure → reprocessing (killer moment) |
| T2 | "The payments stopped after some time." | J2 — state verification |
| T3 | "Your payment didn't arrive this time, and you're not sure why." | J1 — e-KYC citizen action |
| T4 | "You just want to know what's happening with your payment." | J4 — processing → credited |
| T5 | Same as T1. | J3 (second data point, optional) |

If the tester lands on a different journey than targeted, **record the journey they actually took** and mark it — deviation is data, not failure.

### Watch-for list (record during interaction)

- [ ] Exact words/answers (quote them verbatim)
- [ ] Hesitation moments (where, how long)
- [ ] Wrong interpretations (what they believed)
- [ ] Terminology that confused them (name it, quote it)
- [ ] Where they looked / what they clicked (path)
- [ ] Did they understand the timeline? ("What's been happening")
- [ ] Did they understand "Nothing right now"? (did they believe it?)
- [ ] Did they trust the information? (skepticism, re-reading, asking "is this real?")
- [ ] Did they know what to do next after each screen?
- [ ] **Entry path:** did they use the buttons, the free-text field, or a scenario card? Did they read the intake hint?
- [ ] **Confidence without false certainty:** did any tester read an unsupported promise into the copy ("payment will definitely arrive")? Or did certainty stay at "who acts next"?

### Signals to listen for (never prompt for these — just listen)

**Hurtful (valuable evidence):**
- "I understand what happened, but I still don't trust it."
- "I don't know who the state verification team is."
- "Why do I have to wait?"
- "I'd still call the bank."
- "I don't know whether this is actually fixed."

**Gold:**
- "Oh, I don't have to do anything." → "I'll wait until it tells me something changed."

Capture any of these **verbatim**, with the screen they were on.

### Recording grid

| Tester | Journey | What happened? | Who acts? | What do I do? | What's next? | Hesitation / confusion |
|---|---|---|---|---|---|---|
| T1 |  |  |  |  |  |  |
| T2 |  |  |  |  |  |  |
| T3 |  |  |  |  |  |  |
| T4 |  |  |  |  |  |  |
| T5 |  |  |  |  |  |  |

---

## Part B — Interpretation rules

### 1. Comprehension ≠ Trust. Score every journey on six dimensions.

| Dimension | Question |
|---|---|
| **Comprehension** | Did they understand what happened? |
| **Responsibility** | Did they identify who acts next? |
| **Action** | Did they know exactly what they had to do? |
| **Next state** | Did they understand what happens next? |
| **Trust** | Would they actually stop checking and wait? |
| **Effort** | Did the product make the situation feel easier? |

Scoring key per dimension: **1 = no · 2 = partial/hesitant · 3 = yes.**
**Trust is behavioral, not verbal.** "I understand the state has the next action" + "I'd still check the portal every day" = Trust 1. Solving comprehension without solving the checking behavior is not success.

### 2. Capture exact language. Never translate.

Quote testers verbatim, even when messy:

| If they say… | That is… |
|---|---|
| "Oh, I don't have to do anything?" | **Potentially the strongest signal** — zero-action landed |
| "I don't know what state verification means." | A terminology defect |
| "So I guess the government is checking it?" | Comprehension in their own framing — note the gap |

Do not rewrite their words into product terminology in your notes. Their vocabulary is the data.

### 3. After T1–T5: three decisions only.

1. **Keep** — what people understood immediately. Don't touch it.
2. **Fix** — the biggest *repeated* confusion. One change, highest impact.
3. **Kill** — anything that looked clever but did not reduce effort.

No feature creep. No "while we're here, let's add…".

### Scoring grid (fill per tester)

| Tester | Journey | Comp. | Resp. | Action | Next | Trust | Effort | Key quotes (verbatim) |
|---|---|---|---|---|---|---|---|---|
| T1 |  |  |  |  |  |  |  |  |
| T2 |  |  |  |  |  |  |  |  |
| T3 |  |  |  |  |  |  |  |  |
| T4 |  |  |  |  |  |  |  |  |
| T5 |  |  |  |  |  |  |  |  |

### Post-test summary (after all five, fill honestly)

1. **Most common misunderstanding**
2. **Most confusing screen**
3. **Most confusing terminology**
4. **Was responsibility understood?** (who acts next — per journey)
5. **Did zero-action states feel trustworthy?** (did testers believe "nothing right now" — and would they stop checking?)
6. **Was the next-step chain understood?**
7. **Any unnecessary interaction** (anything the tester did the product made them do)
8. **One highest-impact UX change** (if none needed, say so — do not invent one)

**Do not modify the product until these observations are collected.**
Contract and architecture change only if testing reveals a genuine product-model problem.
Bring the observations back **raw**, even if messy.

---

## Part C — Report format (bring back after the five sessions)

Per tester, in this shape (fill from raw notes — do not polish):

```text
T1
Journey:
What happened:
Who acts:
What do I do:
What's next:
Trust (1-3 + one-line why):
Exact quotes:
Hesitations:
Clicks:
```

…through T5 (if fewer testers were reached, number them T1…Tn and report what you have —
**never fill gaps with invented observations**; we work with whatever real evidence exists).

Plus the **aggregate six-dimension scores**: per dimension (Comprehension,
Responsibility, Action, Next state, Trust, Effort) list the five scores and the
spread — e.g. `Trust: 3,1,2,2,1 → mean 1.8`. The spread matters as much as the mean.

Then we decide: **KEEP → FIX → KILL**, ideally one high-impact change.
