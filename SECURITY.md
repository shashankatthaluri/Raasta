# Security & Privacy Policy

## 🛡️ Citizen Privacy by Design

Raasta is built as a **citizen-first public service recovery layer**. Protecting citizen privacy and handling public service data responsibly are foundational to our architectural design:

1. **Zero Real Beneficiary Data in Repository**:
   - The repository contains zero real farmer or beneficiary data.
   - All sample registration numbers (`10203040506`, `98765432101`), case identifiers, UTRs, and phone numbers are 100% synthetic mock fixtures.
2. **Simulation Boundary**:
   - In prototype and evaluation modes, all government adapter interactions are simulated (`MockGovernmentAdapter`).
   - No unauthorized access to live government production databases is attempted.
3. **No Real PII Submission**:
   - Users and evaluators should never submit real, sensitive personal identification numbers (e.g. real Aadhaar or banking passwords) into public test instances.

---

## 🔒 Reporting a Vulnerability

If you discover a security vulnerability or potential privacy issue within the Raasta codebase, please do **NOT** open a public GitHub issue.

Instead, please report it privately:
1. **GitHub Security Advisory (Recommended)**: Open a private advisory under the [Security tab](https://github.com/shashankatthaluri/Raasta/security/advisories/new).
2. **Email**: Send details directly to `shashankatthaluri@gmail.com` with subject `[SECURITY] Vulnerability Report in Raasta`.

Please include:
- A description of the issue and potential impact.
- Step-by-step reproduction instructions or a Proof of Concept (PoC).
- Any suggested remediations if available.

We will acknowledge receipt within 48 hours and work with you on a timely, responsible fix and credit.
