# PM-KISAN Recovery Matrix

> **Data / integration boundary:** Raasta currently uses simulated government-service signals based on publicly documented PM-KISAN workflows. It does not access live individual government beneficiary data.
>
> Tag discipline: **VERIFIED** = fetched/read from an official source this session (2026-08-27) · **PENDING** = official document exists but unread this session (scanned/OCR-required or page unreachable) · **INFERENCE** = product interpretation, clearly labeled, never presented as official fact · **UNKNOWN** = could not be verified — recorded as unknown, never invented.
>
> If a fact cannot be verified: it is represented as **unknown/unavailable**, and Raasta must not generate confident instructions from it.

---

## 1. Sources (all fetched directly 2026-08-27)

| # | Source | URL | What it gave us |
|---|---|---|---|
| S1 | PM-KISAN homepage | https://pmkisan.gov.in/ | eKYC-mandatory statement + biometric option; 23rd instalment; FY 2026-27 "April-July" period dashboard; official document index |
| S2 | KYS — Know Your Status | https://pmkisan.gov.in/BeneficiaryStatus_New.aspx | Lookup flow (**11-digit registration number → captcha → OTP to registered mobile**); status surface fields (§3) |
| S3 | Helpdesk Query / Grievance form | https://pmkisan.gov.in/Grievance.aspx | Query form: **Category + Document upload + Appeal**; official document index |
| S4 | Revised PM-KISAN Operational Guidelines (English) | https://pmkisan.gov.in/Documents/RevisedPM-KISANOperationalGuidelines(English).pdf | Scheme mechanics, instalment schedule, eligibility/exclusions, **failed-transaction reprocessing**, grievance committees, bank-details reconciliation, DBT/PFMS rails (all quotes §4) |
| S5 | Original Operational Guidelines | https://pmkisan.gov.in/Documents/OPERATIONAL%20GUIDELINES.pdf | Confirms S4's failed-transaction language; exclusion/recovery provisions |
| S6 | FAQPMKISAN | https://pmkisan.gov.in/Documents/FAQPMKISAN.PDF | Instalments, Aadhaar/bank-account compulsion, **District Level Grievance Redressal Committee as the inclusion/dispute route** |
| S7 | Revised FAQ | https://pmkisan.gov.in/Documents/RevisedFAQ.pdf | Eligibility mechanics (land in own name, cut-off 01.02.2019, pooled holdings), **recovery for incorrect declaration** |
| S8 | Amendment to OG (11.03.2019) | https://pmkisan.gov.in/Documents/Amendment%20to%20OG-converted.pdf | Aadhaar mandatory 2nd instalment onwards; Aadhaar-seeded DB; State Notional Account transfer via account no + IFSC |
| S9 | Clarification on OGs | https://pmkisan.gov.in/Documents/clarification_on_OGs_of_PMKISAN.PDF | (read; minor clarifications) |
| S10 | Scanned PDFs — unread (OCR required) | Refund Mechanism · Setting up of Grievance Mechanism by States · Aadhaar seeding | Titles confirm existence only; content PENDING |
| S11 | eKYC process page | https://pmkisan.gov.in/EKYC.aspx | **Unreachable this session (SSL error)** — mandatory + biometric option verified via S1; exact steps PENDING |

## 2. Official identity & check flow (VERIFIED — S1/S2)

- KYS: **11-digit registration number → captcha → OTP sent to registered mobile** → status. (S2)
- Registration-number lookup exists separately (mobile/Aadhaar → find registration number) — per prior cross-check.
- Portal search by Name / Aadhaar / Mobile exists **for authorised officials** (S4 §9.6) — not a citizen surface.
- **Identity = registration number + OTP.** Name alone is never an identity. Demo flow mirrors this: *demo registration number → simulated OTP → demo farmer record*.

## 3. Official status surface — what KYS exposes (VERIFIED — S2)

| KYS field | Meaning for recovery |
|---|---|
| Payment status / UTR / bank name / payment mode / credit + date (latest) | What happened with the current instalment + where |
| e-KYC status (financial-year-wise) | Whether eKYC is complete for the relevant FY |
| **Reason of stop payment** | Official stated reason payments stopped |
| **Reason of ineligibility + date** | Official stated ineligibility reason/date |
| **Date of payment revocation** | If/when a payment was revoked |
| **Recovery / Refund** | Recovery/refund indicators (grounded: recovery for incorrect declaration — S7) |

## 4. Verified scheme facts (quoted from S4/S6/S7/S8)

- **Instalments:** "financial benefit of Rs.6000/- per year … in three installments of Rs.2000/- each every 4-month / trimester, i.e. April-July, August-November and December-March." (S4 §10.1)
- **Eligibility:** landholding farmer families owning cultivable land per land records; land in own name; family holdings pooled; cut-off 01.02.2019. (S4 §5; S7)
- **Payment prerequisite:** "No benefit can be given if bank account details have not been provided." Aadhaar mandatory. (S6)
- **Wrong bank details:** States/UTs "ensure speedy reconciliation in case of wrong / incomplete bank details of the beneficiary". (S4 §6.1, §10.4B)
- **Failed transactions — the core of our J3:** "Failed / unsuccessful transactions would be reported back by the banking system to the DAC&FW… Details of failed transactions would be made available to States / UTs for further **verification of beneficiary details and reprocessing**." (S4 §10.4B V–VI)
- **Payment rails:** DBT via PFMS; FTOs signed by States; State Notional Account → beneficiary accounts via account number + IFSC; any scheduled/post office/rural/cooperative bank. (S4 §10.3–10.4)
- **Credit intimation:** system-generated SMS to beneficiary. (S4 §10.4B)
- **Grievance committees:** States notify State and District Level Grievance Redressal Monitoring Committees; grievances "should be disposed off on merit **preferably within two weeks time**". (S4 §7.2) — a *handling target*, not a guaranteed resolution date.
- **Exclusion / dispute route:** "Farmers' families who are eligible but have been excluded should be provided an opportunity to represent their case." (S4 §6.4) · "can approach the **District Level Grievance Redressal Monitoring Committee** in their Districts for inclusion of their names". (S6 Q17)
- **Recovery:** "In case of incorrect declaration, the beneficiary shall be liable for recovery of transferred benefit." (S7)
- **Transparency/checks:** beneficiary lists displayed at Panchayats; ~5% of beneficiaries checked for eligibility during the year. (S4 §10.5)

## 5. Recovery paths (MVP)

### P1 — E-KYC incomplete → `EKYC_REQUIRED` (citizen-correctable)

| Field | Content | Tag |
|---|---|---|
| Official state/reason | e-KYC incomplete; "eKYC is MANDATORY for PMKISAN Registered Farmers"; biometric option available; KYS shows FY-wise eKYC status | VERIFIED (S1, S2) |
| What it means | Instalment flow requires eKYC recorded | INFERENCE (mandatory statement verified; blocking mechanics in S11 PENDING) |
| Can citizen correct it? | Yes — official eKYC process exists | VERIFIED (S1) |
| Exact citizen action | Complete eKYC via official route (portal / biometric) | PENDING (S11 unreachable; exact steps not read) |
| Who resolves it | System once recorded in KYS | INFERENCE |
| Official channel | pmkisan.gov.in eKYC process page; CSC | VERIFIED (existence) / PENDING (steps) |
| Required documents/evidence | Aadhaar-based (biometric eKYC; Aadhaar mandatory for payments) | VERIFIED (S6/S8) |
| Reapply? | No — record completion, not reapplication | INFERENCE |
| After correction | eKYC status updates in KYS; instalment flow continues | INFERENCE |
| Official window | None verified | UNKNOWN |
| How to check | KYS | VERIFIED (S2) |
| Grievance availability | Helpdesk Query Form + Appeal; district grievance committee | VERIFIED (S3, S4) |
| Escalation route | District Level Grievance Redressal Monitoring Committee | VERIFIED (S6) |
| Resolution condition | KYS shows eKYC complete; payment proceeds | VERIFIED (surface) / INFERENCE (proceeds) |

### P2 — Payment failed → reprocessing → `TRANSACTION_FAILED` / `PAYMENT_REPROCESSING` (system/payment failure)

| Field | Content | Tag |
|---|---|---|
| Official state/reason | Payment status FAILED + UTR/bank/mode exposed | VERIFIED (S2) |
| What it means | Failed transactions reported back; made available to States/UTs for **verification of beneficiary details and reprocessing** | **VERIFIED (S4 §10.4B)** |
| Can citizen correct it? | Usually no initial action — official reprocessing path exists; do NOT auto-send to bank | VERIFIED (reprocessing) / INFERENCE (no initial action) |
| Exact citizen action | None initially | INFERENCE (grounded in VERIFIED reprocessing) |
| Who resolves it | States/UTs verify beneficiary details; payment system reprocesses | **VERIFIED (S4)** |
| Official channel | System-side; bank reconciliation if wrong details are the cause (S4 §6.1) | VERIFIED |
| Required documents | None unless bank-details issue officially indicated | UNKNOWN |
| Reapply? | No | INFERENCE |
| After reprocessing | Payment processed → credited | INFERENCE |
| Official window | None verified | UNKNOWN |
| How to check | KYS | VERIFIED (S2) |
| Grievance availability | Helpdesk form; district committee | VERIFIED (S3, S6) |
| Escalation route | District Level Grievance Redressal Monitoring Committee (two-week handling target) | VERIFIED (S4, S6) |
| Resolution condition | Payment credited (KYS) | VERIFIED (surface) |

### P3 — Verification/eligibility check → `PHYSICAL_VERIFICATION_PENDING` (government action)

| Field | Content | Tag |
|---|---|---|
| Official state/reason | Stop-payment/revocation surface exists in KYS (reason + date); eligibility checks happen (~5%/year, field verification) | VERIFIED (S2, S4 §10.5) |
| What it means | **"Withheld pending physical verification" as a documented benefit-hold state: NOT FOUND in the extracted official texts this session** — the demo keeps this state but it must be labeled simulated, not official | **INFERENCE/SIMULATED — previously assumed VERIFIED (S5 cross-check), downgraded after extraction** |
| Can citizen correct it? | No — government process | PENDING |
| Exact citizen action | None unless officially requested | PENDING |
| Who resolves it | State/district machinery; district grievance committee if disputed | VERIFIED (existence) |
| Official channel | State machinery | PENDING |
| Reapply? | No | INFERENCE |
| Official window | None verified | UNKNOWN |
| How to check | KYS | VERIFIED (S2) |
| Grievance availability | District committee; disposal target ~2 weeks | VERIFIED (S4, S6) |
| Escalation route | District Level Grievance Redressal Monitoring Committee | VERIFIED (S6) |
| Resolution condition | Verification complete → payment proceeds (KYS status change) | INFERENCE |

### P4 — Payment processing / on track → `PAYMENT_PROCESSING` (no problem)

| Field | Content | Tag |
|---|---|---|
| Official state/reason | Payment status PROCESSING | VERIFIED (S2) |
| What it means | Instalment in the official pipeline; trimesters are official (Apr-Jul, Aug-Nov, Dec-Mar) | VERIFIED (S4 §10.1) |
| Citizen action | None — do not manufacture a problem | VERIFIED (product rule) |
| Window | Trimester framing verified; per-beneficiary processing window UNKNOWN | VERIFIED (period) / UNKNOWN (per-beneficiary) |
| Resolution condition | Payment credited (KYS) | VERIFIED (surface) |

### P5 — Payment credited → `PAYMENT_CREDITED` (resolved)

| Field | Content | Tag |
|---|---|---|
| Official state/reason | CREDITED + UTR + bank + mode + date; SMS intimation | VERIFIED (S2, S4) |
| Resolution | Case closes with official credit evidence | VERIFIED (surface) |

### P6 — Stuck after repeated failure → `CITIZEN_ACTION_REQUIRED` (bank/correction)

| Field | Content | Tag |
|---|---|---|
| Official state/reason | Repeated failure beyond reprocessing | PENDING (retry policy not in extracted docs) |
| Known owner | **States/UTs ensure speedy reconciliation of wrong/incomplete bank details** | VERIFIED (S4 §6.1) |
| Can citizen correct it? | Bank-details reconciliation exists as an official process; whether the citizen acts at the bank vs the state route is NOT verified | VERIFIED (process) / UNKNOWN (citizen's exact role) |
| Exact action | Bank card is INFERENCE — "show at bank" must be framed as unverified until grounded; state-reconciliation route is the verified owner | INFERENCE/UNKNOWN |
| Escalation | District grievance committee; two-week handling target | VERIFIED (S4, S6) |
| Window | None verified | UNKNOWN |

### P7 — Citizen disputes official record (dispute path)

| Field | Content | Tag |
|---|---|---|
| Official state/reason | Official record says X (reason of ineligibility / stop payment / exclusion) | VERIFIED (S2) |
| What Raasta must do | Show official record + capture citizen's statement (CITIZEN_REPORTED); never decide government is wrong | VERIFIED (product rule) |
| Review route | **"Eligible but excluded… opportunity to represent their case"** (S4 §6.4); **approach District Level Grievance Redressal Monitoring Committee** (S6 Q17) | VERIFIED |
| Grievance handling target | "Preferably within two weeks" — a target, not a guarantee; UI must say so | VERIFIED (S4 §7.2) |
| Grievance preparation | Structured from verified case evidence + citizen statement; citizen reviews; handoff labeled simulated | VERIFIED (product rule) |
| Window | Two-week handling target (grievance stage); no resolution guarantee | VERIFIED (target) / UNKNOWN (resolution) |

## 6. Explicitly UNKNOWN (never to be invented)

- Official helpline/toll-free number (not found in any extracted official text this session)
- Per-beneficiary processing window for payments/verification
- Exact grievance categories (JS-driven form; not enumerated)
- State/district nodal contacts
- Document checklists for correction/bank routes
- "Reapply" requirements (no path verified as reapplication)
- Retry/escalation policy for repeated payment failures (not in extracted docs)
- "Withheld pending physical verification" as a documented state (downgraded — see P3)
- eKYC exact process steps (S11 unreachable)

## 7. What the research changed in our assumptions

1. **J3's core claim is now officially grounded** (S4 §10.4B verbatim) — failed transactions → States/UTs verification → reprocessing. The "failed ≠ visit the bank" copy is verified, not invented.
2. **Grievance route + target are real and quotable:** District Level Grievance Redressal Monitoring Committee; disposal "preferably within two weeks" — usable as a *handling target*, explicitly not a guarantee.
3. **Bank-details issues have a verified owner:** States/UTs reconcile wrong/incomplete bank details — the stuck-path's owner is verified even though the citizen's exact action is not.
4. **"Physical verification hold" was downgraded** — previously carried as documented (prior cross-check); not found in the extracted official texts. The demo keeps the state, labeled simulated. This is exactly the kind of correction the research was for.
5. **Identity model confirmed:** registration number + OTP; name/Aadhaar/mobile search is official-side only. Demo mirrors the citizen surface.
6. **Eligibility/exclusion mechanics are rich but out of MVP scope** (land records, cut-offs, exclusions, recovery) — the matrix records them; the product must not invent guidance on them, and won't in the MVP.
