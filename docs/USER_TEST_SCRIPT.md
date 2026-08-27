# Raasta — Usability Test Script (Phase 3, rev 2 — tests the RECOVERY proposition)

**Goal:** Can a real person start with only *"my money didn't come"* and navigate the
recovery journey — wait, fix, challenge, or prepare — without us beside them?
**Stance:** If a tester misunderstands something, it is a product defect. No optimistic interpretation.
**Thesis under test (corrected):** Raasta removes the *unnecessary coordination and cognitive
work* from a government-service recovery journey. Zero-action is ONE possible outcome —
sometimes the farmer fixes, sometimes challenges, sometimes prepares a grievance.

---

## Part A — Run the session

### Setup
- Give the tester only the entry screen (http://localhost:3998). Nothing else.
- Do not explain: the architecture · the case model · the recovery paths · AI ·
  PM-KISAN workflow · what the correct answer is · what Raasta does.
- Do not tell them it is a demo, and do not explain away the demo labels they see
  (the built-in "Demo case / simulated signal" markings are part of what's tested —
  trust under explicit simulation honesty). Record reactions to them; never hide them.
- Do not point at any UI element. Do not rescue. Hesitation is the product talking.

### Main scenario (most testers)
> **"You are a farmer. You were receiving PM-KISAN payments, but your latest payment
> hasn't arrived. You have your registration number. Use Raasta and do whatever you
> think you need to do."**

### Dispute scenario (at least one tester)
> **"The system says there is an issue with your PM-KISAN status. You believe the
> information is incorrect. Use Raasta to figure out what you would do."**

**Note for the facilitator:** the current build has NO dispute/grievance UI yet — that
path is spec'd but not built. That is intentional. The gold observation in this session
is the farmer's *expectation*: any "I want to challenge this", "can I respond?",
"how do I tell them it's wrong?" moment, verbatim. That expectation is the evidence
for building the dispute path. Do not build it for them, do not hint at it.

### After the interaction, ask (in order, verbatim)
1. **What happened to your payment?**
2. **What would you do next?**
3. **Who do you think is responsible right now?**
4. **If this doesn't get fixed, what would you expect Raasta to do?**
5. **Would you trust this enough to stop checking the government website yourself? Why?**

Question 5 is the critical one. **Understanding without coordination** =
"I'll wait" followed by "but I'll still check KYS every day." That means we solved
comprehension, not the behavioral problem.

Do not ask: "Did you like it?" · "Is this useful?" · "Would you use this?"

### Watch for (record everything, verbatim where possible)
- exact words (never translated into product terminology)
- hesitation, re-reading, skepticism ("is this real?")
- wrong interpretations, terminology that confused them
- where they looked / clicked (buttons vs free text vs demo controls vs details)
- whether they understood the timeline
- whether they believed "nothing to do" — or went to check elsewhere
- whether they tried to find a way to respond/dispute/contact someone
- whether they expected Raasta to submit or follow up on their behalf
- whether they trusted the information (and whether the demo labels shaped that)

### Recording grid

| Tester | Journey taken | Q1 what happened | Q2 would do next | Q3 responsible | Q4 expect Raasta to do | Q5 trust + why | Key quotes (verbatim) | Hesitations/clicks |
|---|---|---|---|---|---|---|---|---|

### Signals to listen for (never prompt — just listen)
- **Gold:** "Oh, I don't have to do anything?" → "Okay, I'll wait." → *and means it* (Q5)
- **Hurtful but valuable:** "I understand what happened, but I still don't trust it." ·
  "I don't know who the state verification team is." · "Why do I have to wait?" ·
  "I'd still call the bank." · "I don't know whether this is actually fixed." ·
  "I'll still check the portal every day." · "How do I tell them it's wrong?"

---

## Part B — Interpret honestly

### Six dimensions (score 1–3 per tester; 1 = no, 2 = partial, 3 = yes)

| Dimension | Question it answers |
|---|---|
| Comprehension | Did they understand what happened? (Q1) |
| Responsibility | Did they identify who acts next? (Q3) |
| Action | Did they know exactly what they had to do? (Q2) |
| Next state | Did they understand what happens next / after? (Q2, Q4) |
| Trust | Would they actually stop checking and wait? (Q5 — behavioral, not verbal) |
| Effort | Did the product make the situation feel easier? (observed) |

Report the spread (how many 1s/2s/3s), not just the mean.

### Outcome → next-build decision map

| If the farmer… | That means | Decision |
|---|---|---|
| understands but asks "okay, what do I do now?" | recovery UX too weak | build clearer playbooks/next-step |
| immediately knows what to do and why | good | keep |
| doesn't trust Raasta, returns to KYS | trust/provenance problem | provenance + last-verified work |
| expects Raasta to submit/follow up | end-to-end case promise is valuable | build the tracking/follow-up |
| doesn't care about tracking | tracking is noise | don't build unnecessary tracking complexity |
| tries to solve everything themselves | cognitive load not reduced | simplify further |
| says "I want to challenge this / can I respond?" (dispute tester) | dispute path is wanted | build the P7 dispute path |

### Capture exact language
Quotes are the data. "So I guess the government is checking it?" and "I don't know what
state verification means" and "Oh, I don't have to do anything?" are all gold — capture
them verbatim with the screen they were on.

### After the sessions
- KEEP → FIX → KILL, then ideally ONE high-impact change. No feature creep.
- Bring the observations back **raw** (T1…Tn, exact words, clicks, hesitations). Never
  fill gaps with invented observations — work with whatever real evidence exists.
- The next milestone is evidence, not another commit: a real person can start with
  "my money didn't come" and navigate the recovery journey without us beside them.
