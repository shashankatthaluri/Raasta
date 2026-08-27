# Raasta — State → Experience Mapping

> **The product isn't the state machine. The product is how the state machine is translated into human experience.**
> Companion to `PRODUCT_CONTRACT.md` v1.1 (frozen). This document is the frontend contract: the UI renders this mapping and nothing else.

**Master rule: NEVER expose internal government/engineering terminology as the primary citizen experience.**
Technical state → human meaning → responsibility → minimum human action → next step.
`TRANSACTION_FAILED` is never the UI. "Your payment attempt was unsuccessful." is the UI.

The primary case screen must answer four questions immediately:
1. **What happened?**
2. **Who has the next action?**
3. **What do I need to do?**
4. **What happens next?**

If the citizen has no required action, the primary experience explicitly says: **"You don't need to do anything right now."**

---

## Summary table

| State | Category | Human headline (EN) | Next actor | Citizen action | Color |
|---|---|---|---|---|---|
| PAYMENT_EXPECTED | informational | We're checking your payment | The payment system | none | neutral |
| PAYMENT_CHECK | informational (internal) | — never shown — | The payment system | none | neutral |
| EKYC_REQUIRED | **action-required** | Your e-KYC needs to be completed | You | COMPLETE_EKYC | red |
| EKYC_VERIFIED | informational | Your e-KYC is verified | The payment system | none | neutral |
| PAYMENT_PROCESSING | informational | Your payment is being processed | The payment system | none | neutral |
| PHYSICAL_VERIFICATION_PENDING | waiting | Your benefit is temporarily on hold | State verification team | none (unless officially requested) | amber |
| TRANSACTION_FAILED | waiting | The payment attempt was unsuccessful | State verification team | none (initially) | amber |
| PAYMENT_REPROCESSING | informational | Your payment is being processed again | The payment system | none | neutral |
| CITIZEN_ACTION_REQUIRED | **action-required** | We need one thing from you | You | exactly one action | red |
| PAYMENT_CREDITED | resolved | Your payment was credited | No one | none | green |
| RESOLVED | resolved | Your case is resolved | No one | none | green |

---

## Per-state mapping

### S1 `PAYMENT_EXPECTED` — informational
- **Headline:** We're checking your payment / हम आपके भुगतान की जाँच कर रहे हैं
- **Explanation:** We're looking at your latest payment status. / हम आपकी नवीनतम भुगतान स्थिति देख रहे हैं।
- **Next actor:** The payment system · **CTA:** none
- **Chain:** Payment check → Payment processing → ₹2,000 credited
- **Progressive disclosure L4:** nothing yet. **L5:** nothing.
- **Last verified:** shown when the first signal lands.
- **Notification:** none (transient state).
- **Design note:** entry state; resolves within moments in the demo.

### S2 `PAYMENT_CHECK` — informational (internal)
- **Never rendered.** Resolves in one engine pass. No copy, no notification.

### S3 `EKYC_REQUIRED` — action-required
- **Headline:** Your e-KYC needs to be completed / आपका ई-केवाईसी पूरा करना आवश्यक है
- **Explanation:** Your e-KYC must be completed before the payment can proceed. It takes a few minutes through the official PM-KISAN portal or a CSC.
- **Next actor:** You · **Primary CTA:** **Complete e-KYC** (one button; secondary link "Open the official PM-KISAN portal ↗")
- **After the CTA:** "Your case will continue automatically after official confirmation."
- **Wait state after action:** "Action done — waiting for official confirmation" (status updates can take time). The case does NOT claim verified on self-report.
- **Chain:** e-KYC complete → Payment processing → ₹2,000 credited
- **L4 details:** e-KYC status (incomplete), the official portal link. **L5:** "e-KYC is the yearly identity verification for PM-KISAN beneficiaries."
- **Notification:** **prominent** — "Your case needs one thing from you."
- **Design note:** one action, one button, zero ambiguity. Red accent.

### S4 `EKYC_VERIFIED` — informational
- **Headline:** Your e-KYC is verified / आपका ई-केवाईसी सत्यापित हो गया है
- **Explanation:** Your case will continue automatically. / आपका मामला अपने आप आगे बढ़ेगा।
- **Next actor:** The payment system · **CTA:** none
- **Chain:** Payment processing → ₹2,000 credited
- **L4:** e-KYC verified date. **L5:** verification source.
- **Notification:** normal state-change — "Your PM-KISAN case changed."

### S5 `PAYMENT_PROCESSING` — informational
- **Headline:** Your payment is being processed / आपका भुगतान प्रोसेस हो रहा है
- **Explanation:** The payment system is working on your installment.
- **Next actor:** The payment system · **CTA:** none
- **Your action:** **Nothing right now.** We're waiting for the next update.
- **Chain:** Payment processing → ₹2,000 credited
- **L4:** payment status, last verified. **L5:** processing pipeline stages (only if asked).
- **Notification:** state-change only.
- **Design note:** neutral; the calmest possible screen.

### S6 `PHYSICAL_VERIFICATION_PENDING` — waiting
- **Headline:** Your benefit is temporarily on hold / आपका लाभ अस्थायी रूप से रोका गया है *(headline states the state; the nuance lives in Why)*
- **Explanation:** Your eligibility is being verified. **This is not a rejection.** / आपकी पात्रता की जाँच चल रही है। यह अस्वीकृति नहीं है।
- **Next actor:** State verification team · **CTA:** none
- **Your action:** **Nothing right now.** We're waiting for the next update. We'll tell you when something changes.
- **Chain:** Eligibility verification → Payment processing → ₹2,000 credited
- **L4:** verification status (pending). **L5:** "Benefits can be temporarily withheld pending physical verification (official guidelines)."
- **Notification:** state-change only; never "check again" nudges.
- **Design note:** this state may last days in reality — the zero-action reassurance is the whole point. Amber.

### S7 `TRANSACTION_FAILED` — waiting (the killer demo state)
- **Headline:** The payment attempt was unsuccessful / भुगतान का प्रयास सफल नहीं हो सका
- **Explanation:** The payment attempt needs further verification. **Payment reprocessing — the payment is being processed again after verification.**
- **Next actor:** State verification team · **CTA:** none
- **Your action:** **Nothing right now.** We're waiting for the next update. We'll tell you when something changes.
- **Chain:** State verification → Payment reprocessing → Payment processing → ₹2,000 credited
- **L4:** payment status (failed), reprocessing availability, last verified. **L5:** "Failed transactions are reported back and made available to States/UTs for verification and reprocessing (operational guidelines)."
- **Notification:** state-change only.
- **Design note:** **NEVER say "visit your bank" here.** The official reprocessing path exists. This screen is where the judge asks "what does the farmer do?" — and the answer is nothing. Amber.

### S8 `PAYMENT_REPROCESSING` — informational
- **Headline:** Your payment is being processed again / आपका भुगतान दोबारा प्रोसेस किया जा रहा है
- **Explanation:** The payment is being processed again after verification. / सत्यापन के बाद भुगतान फिर से प्रोसेस किया जा रहा है।
- **Next actor:** The payment system · **CTA:** none
- **Your action:** **Nothing right now.**
- **Chain:** Payment reprocessing → Payment processing → ₹2,000 credited
- **L4:** payment status (reprocessing). **L5:** retry context.
- **Notification:** state-change only.
- **Design note:** quiet; follows TRANSACTION_FAILED seamlessly.

### S9 `CITIZEN_ACTION_REQUIRED` — action-required
- **Headline:** We need one thing from you / हमें आपसे एक काम करना है
- **Explanation:** One specific action will move your case forward.
- **Next actor:** You · **Primary CTA:** exactly one action, e.g.:
  - **Show this card at your bank** — bank card: "I need help resolving an Aadhaar/DBT mapping issue related to my PM-KISAN payment." + case ID, issue, evidence, next step
  - **Show this case at a CSC** — case summary card
  - **Prepare your grievance** — draft prepared
  - **Provide the requested information**
- **After the CTA:** "Your case will continue after [bank/CSC] confirms."
- **Chain:** Your action → Payment processing → ₹2,000 credited
- **L4:** the action card (statement + case details). **L5:** reason code.
- **Notification:** **prominent** — "Your case needs one thing from you."
- **Design note:** the bank card kills "what do I even say at the bank?" — AI's best legitimate job here. Red.

### S10 `PAYMENT_CREDITED` — resolved
- **Headline:** **₹2,000 was credited to your account** (amount from official signal) / आपके खाते में ₹2,000 जमा कर दिए गए हैं
- **Explanation:** Your PM-KISAN installment was paid to your bank account.
- **Next actor:** No one · **CTA:** none · **Your action:** nothing.
- **L4:** UTR, bank name, payment mode, credited date — all OFFICIAL.
- **Notification:** "Your PM-KISAN case changed — payment credited."
- **Design note:** the relief screen. Green. Case is closed; show resolution + "Start another case".

### S11 `RESOLVED` — resolved
- **Headline:** Your case is resolved / आपका मामला हल हो गया है
- **Explanation:** There is nothing more you need to do.
- **Next actor:** No one · **CTA:** none.
- **L4:** resolution reason (credited / no-action / escalated).
- **Notification:** none further (silence after resolution).

---

## Cross-cutting rules for the frontend

1. **The four questions are literal section labels** on the case screen: What happened? · Why? · Who has the next action? · What do I need to do? · What happens next?
2. **Zero-action is an active reassurance**, never a disabled-looking "No action required": "You don't need to do anything right now." + "We're waiting for the next update. We'll tell you when something changes."
3. **One action, one button.** No five-button screens. Secondary links are allowed (official portal), never competing CTAs.
4. **Progressive disclosure:** L1 title → L2 why → L3 who acts → L4 details (evidence) → L5 technical (only if requested). The citizen never sees PFMS/FTO/NPCI/state codes unless they ask.
5. **Evidence is shown with its provenance badge** (Official / You told us / System / AI explanation) — this is the trust surface.
6. **"Last verified" is always a concrete timestamp** — never "live", never "Updated just now" without a real authorised integration.
7. **Notifications:** no change → silence · meaningful change → notify · citizen action required → notify prominently.
8. **No** onboarding, dashboards, chatbot bubbles, AI animations, gamification, or decorative complexity. The UI must feel dramatically simpler than the underlying system.
9. **Confidence without false certainty:** every statement is traceable to a signal or an actor. Never promise outcomes the system cannot verify — "the state has the next action" is the ceiling of certainty.
10. **Language is access, not settings:** the first screen is a language gate (native names only, no abbreviations/flags, animated prompt that never blocks interaction); the product never requires a citizen to understand a language they do not speak in order to choose the one they do. Persist the choice; keep the switcher one click away inside the product.

## Free-text intake (Phase 7 — the one AI capability)

"Tell us what happened" — a sentence in English or हिंदी becomes structured intent:

```text
message → { service: PM_KISAN, intent: PAYMENT_MISSING | PAYMENT_STOPPED | OTHER,
            context: [PREVIOUSLY_RECEIVED], language: en | hi } → deterministic engine
```

- The citizen's words are **CITIZEN_REPORTED evidence** ("You told us: …"), never OFFICIAL.
- The detected language becomes the **UI default** — a Hindi message opens a Hindi case.
- Intent maps to a demo journey; if extraction fails or is absent, the deterministic journeys are untouched.
- AI extracts intent only. **It never decides government state.** (LLM extractor is a drop-in behind the same interface when a key is configured; the deterministic rule extractor is active today — no key, tested.)

## UI structure (consolidated)

```text
/                     Entry — "What happened?" + demo scenario picker
/case/:id             The one screen: status block, action/wait, chain,
                      details (L4), timeline, demo controls, resolution
```
Deliberate simplification of the contract's route list: action, details and resolution render **inline** on the single case screen — the four-question block must never be broken across pages.
