# PM-KISAN Recovery Matrix

> **Data / integration boundary:** Raasta currently uses simulated government-service signals based on publicly documented PM-KISAN workflows. It does not access live individual government beneficiary data.
>
> Tag discipline: **VERIFIED** = fetched directly from an official source this session (2026-08-27) · **PENDING** = official document exists but text extraction is blocked (awaiting consent to install a PDF extractor); content not yet read · **INFERENCE** = product interpretation, clearly labeled, never presented as official fact · **UNKNOWN** = could not be verified — recorded as unknown, never invented.
>
> If a fact cannot be verified: it is represented as **unknown/unavailable**, and Raasta must not generate confident instructions from it.

---

## 1. Sources (all fetched directly 2026-08-27)

| # | Source | URL | What it gave us |
|---|---|---|---|
| S1 | PM-KISAN homepage | https://pmkisan.gov.in/ | eKYC-mandatory statement + biometric option; 23rd instalment notice; FY 2026-27 period "April-July" dashboard (eligible farmers, transfer % per state); links to official PDFs (OGs, FAQs, NPCI transfer, refund mechanism) |
| S2 | KYS — Know Your Status | https://pmkisan.gov.in/BeneficiaryStatus_New.aspx | Lookup flow: **11-digit registration number → captcha → OTP to registered mobile**; status surface fields (see §3) |
| S3 | Helpdesk Query / Grievance form | https://pmkisan.gov.in/Grievance.aspx | Query form with **Category** + **Document upload** + **Appeal** mechanism; links the official document set |
| S4 | Official document index (titles only, via S1/S3) | https://pmkisan.gov.in/Documents/*.pdf | Confirms existence of: Revised PM-KISAN Operational Guidelines (English), FAQPMKISAN, Revised FAQ, Clarifications, Amendment to OGs, PM Kisan Refund Mechanism, Aadhaar seeding of beneficiaries, Transfer of Benefits via NPCI, **Setting up of Grievance Mechanism by States** — content PENDING extraction |
| S5 | Earlier cross-check (user, via official pages) | pmkisan.gov.in (KYS, OGs, PIB) | KYS exposes payment status/bank/UTR/mode/credited/eKYC; failed transactions returned to States/UTs for verification & reprocessing; benefits can be withheld pending physical verification — to be re-confirmed against S4 PDFs |

## 2. Official identity & check flow (VERIFIED — S1/S2)

- Citizen checks status via **KYS**: enter **11-digit registration number** → captcha → **OTP sent to registered mobile number** → status page. (S2)
- Registration number lookup exists separately (mobile/Aadhaar → find registration number) — official page, per prior cross-check (S5).
- Identity therefore = **registration number + OTP**; name alone is not an identity. This anchors the demo flow: *demo registration number → simulated OTP → demo farmer record*.

## 3. Official status surface — what KYS actually exposes (VERIFIED — S2, page field labels)

| KYS field (page label) | Meaning for recovery |
|---|---|
| Payment status (latest) | What happened with the current instalment |
| UTR / UR No. (latest) | Transaction reference for the latest payment |
| Bank name (latest) | Where the payment was attempted |
| Payment mode (latest) | e.g. DBT/NPCI transfer |
| Credit / account credited (latest) | Credited status + date |
| e-KYC status (financial-year-wise) | Whether eKYC is complete for the relevant FY |
| **Reason of stop payment** | Official stated reason payments stopped |
| **Reason of ineligibility** | Official stated reason for ineligibility |
| **Date of ineligibility** | When ineligibility was recorded |
| **Date of payment revocation** | If/when a payment was revoked |
| **Recovery / Refund** | Recovery/refund indicators |

**Product implication:** the official record already carries *reasons* (stop payment, ineligibility) and *dates* — the raw material for "what changed" detection and for the citizen-dispute path ("Official record says X. You told us Y."). All of it is exposed only after OTP verification.

## 4. Recovery paths (MVP)

### P1 — E-KYC incomplete → `EKYC_REQUIRED` (citizen-correctable)

| Field | Content | Tag |
|---|---|---|
| Official state/reason | e-KYC incomplete; **"eKYC is MANDATORY for PMKISAN Registered Farmers"**; biometric-based eKYC option available | VERIFIED (S1) |
| What it actually means | Instalment cannot proceed until eKYC is recorded | INFERENCE (mandatory statement verified; exact blocking wording in OGs PENDING) |
| Can citizen correct it? | Yes — eKYC is a citizen-performed process on the official portal/CSC | VERIFIED (process page exists: "Know About eKYC Process") / details PENDING |
| Exact citizen action | Complete eKYC via official route (portal / biometric / CSC) | PENDING (S4 eKYC page + OGs) |
| Who resolves it | Central system once eKYC is recorded in KYS | INFERENCE |
| Official channel | pmkisan.gov.in eKYC process page; CSC | PENDING detail |
| Required documents/evidence | Aadhaar (biometric eKYC implies Aadhaar-based identity) | INFERENCE — PENDING verification |
| Reapply? | No — record correction, not reapplication | INFERENCE |
| After correction | eKYC status updates in KYS; instalment flow continues | INFERENCE |
| Official window | None verified | UNKNOWN — do not invent |
| How to check | KYS (S2) | VERIFIED |
| Grievance availability | Helpdesk Query Form + Appeal exist | VERIFIED (S3); category mapping PENDING |
| Escalation route | State grievance mechanism (document exists); details PENDING | VERIFIED (existence) / PENDING (route) |
| Resolution condition | KYS shows eKYC complete; payment proceeds | VERIFIED (surface) / INFERENCE (proceeds) |

### P2 — Payment failed → reprocessing → `TRANSACTION_FAILED` / `PAYMENT_REPROCESSING` (system/payment failure)

| Field | Content | Tag |
|---|---|---|
| Official state/reason | Payment status FAILED; UTR/bank/mode exposed | VERIFIED (S2) |
| What it actually means | Failed transactions are returned and made available to States/UTs for verification and reprocessing | PENDING (S4 OGs — previously cross-checked, S5) |
| Can citizen correct it? | Usually no initial action — official reprocessing path exists; do NOT auto-send to bank | PENDING (S5/OGs) |
| Exact citizen action | None initially | INFERENCE (grounded in PENDING OG claim) |
| Who resolves it | State/UT verification + payment system reprocessing | PENDING (OGs) |
| Official channel | — (system-side) | — |
| Required documents | None unless a bank/Aadhaar mapping issue is officially indicated | UNKNOWN |
| Reapply? | No | INFERENCE |
| After reprocessing | Payment processed → credited | INFERENCE |
| Official window | None verified | UNKNOWN — do not invent |
| How to check | KYS (S2) | VERIFIED |
| Grievance availability | Helpdesk form exists | VERIFIED (S3) |
| Escalation route | State grievance mechanism; repeated-failure route PENDING | VERIFIED (existence) / PENDING |
| Resolution condition | Payment credited (KYS) | VERIFIED (surface) |

### P3 — Physical verification pending → `PHYSICAL_VERIFICATION_PENDING` (government action)

| Field | Content | Tag |
|---|---|---|
| Official state/reason | Benefits can be temporarily withheld pending physical verification | PENDING (S5/OGs; S1 site documents exist) |
| What it actually means | Verification pending ≠ ineligible | INFERENCE + PENDING (OGs) |
| Can citizen correct it? | No — state process | PENDING |
| Exact citizen action | None unless officially requested | PENDING |
| Who resolves it | State/district verification machinery | PENDING (OGs) |
| Official channel | State machinery; details not enumerated | PENDING |
| Required documents | Not verified | UNKNOWN |
| Reapply? | No | INFERENCE |
| Official window | None verified | UNKNOWN |
| How to check | KYS | VERIFIED (S2) |
| Grievance availability | Helpdesk form exists | VERIFIED (S3) |
| Escalation route | State grievance mechanism | VERIFIED (existence) / PENDING (route) |
| Resolution condition | Verification complete → payment proceeds (KYS status change) | INFERENCE |

### P4 — Payment processing / on track → `PAYMENT_PROCESSING` (no problem)

| Field | Content | Tag |
|---|---|---|
| Official state/reason | Payment status PROCESSING | VERIFIED (S2) |
| What it means | Instalment in the official pipeline; instalment periods are published (e.g., FY 2026-27 period April-July) | VERIFIED (S1 dashboard) |
| Citizen action | None — do not manufacture a problem | VERIFIED (product rule) |
| Window | Instalment-period framing verified; per-beneficiary processing window UNKNOWN | VERIFIED (period) / UNKNOWN (per-beneficiary) |
| Resolution condition | Payment credited (KYS) | VERIFIED (surface) |

### P5 — Payment credited → `PAYMENT_CREDITED` (resolved)

| Field | Content | Tag |
|---|---|---|
| Official state/reason | Payment status CREDITED + UTR + bank + mode + date | VERIFIED (S2) |
| Meaning | Instalment delivered via DBT/NPCI | VERIFIED (S1 NPCI transfer doc exists; mode field S2) |
| Resolution | Case closes with the official credit evidence | VERIFIED (surface) |

### P6 — Stuck after repeated failure → `CITIZEN_ACTION_REQUIRED` (bank card / escalation)

| Field | Content | Tag |
|---|---|---|
| Official state/reason | Repeated payment failure beyond reprocessing | PENDING (OGs — retry policy) |
| Can citizen correct it? | Possibly via bank (Aadhaar/DBT mapping) or grievance — **not yet verified** | UNKNOWN/PENDING |
| Exact action | Bank/CSC/grievance route — **do not invent** until verified | UNKNOWN |
| Escalation | State grievance mechanism exists; specific route PENDING | VERIFIED (existence) / PENDING |
| Window | None verified | UNKNOWN |

### P7 — Citizen disputes official record (dispute path)

| Field | Content | Tag |
|---|---|---|
| Official state/reason | Official record says X (e.g., reason of ineligibility/stop payment) | VERIFIED (S2 reason fields) |
| What it means | Record exists; citizen disagrees | VERIFIED |
| What Raasta must do | Show official record + capture citizen's statement as CITIZEN_REPORTED; never decide government is wrong | VERIFIED (product rule) |
| Review/grievance route | Helpdesk Query Form + Appeal; state grievance mechanism | VERIFIED (existence, S3/S4) / PENDING (exact categories & route) |
| Grievance preparation | Structured from verified case evidence + citizen statement; citizen reviews before any handoff | VERIFIED (product rule) |
| Window | None verified | UNKNOWN |

## 5. Explicitly UNKNOWN (never to be invented)

- Official helpline/toll-free number (not found on homepage HTML this session)
- Any processing/handling window or SLA (none verified)
- Exact grievance categories (JS-driven form; not enumerated this session)
- State/district nodal contacts
- Document checklists for correction/bank routes
- "Reapply" requirements (not verified for any path)
- Retry/escalation policy for repeated payment failures (in OGs — PENDING)

## 6. What the matrix changed in our assumptions

1. **KYS carries official reasons and dates** (stop payment, ineligibility, revocation, recovery/refund) — the citizen-dispute and "what changed" paths are grounded in the real surface, not invented.
2. **Identity is registration number + OTP** — name-based lookup is not the official model; demo identity must mirror this.
3. **Grievance + Appeal + state grievance mechanisms are real, verified surfaces** — the escalation model can cite their existence honestly, even where route details remain PENDING.
4. **No official windows verified anywhere** — the product's honest default ("No official resolution time is available for this step") is confirmed as necessary, not a cop-out.
5. **Operational-guidelines content (reprocessing, verification holds, eKYC mechanics) remains PENDING** — the matrix's P-tags will be upgraded or downgraded once the PDFs are extracted.
