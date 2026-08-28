# Security & Privacy Policy

## 🛡️ Privacy by Design

Raasta is built as a **citizen-first public service recovery layer**. Protecting citizen privacy and handling government data responsibly are foundational to our architectural design:

1. **Zero PII Storage by Default**:
   - The platform never stores plain-text Aadhaar numbers or unredacted financial credentials.
   - Registration numbers are strictly treated as reference identifiers.
2. **Simulation Boundary**:
   - In prototype and evaluation modes, all government adapter interactions are simulated (`MockGovernmentAdapter`).
   - No unauthorized access to live government production databases is attempted.
3. **Data Minimization**:
   - Only minimum necessary fields required to determine the single next recovery action are processed.

---

## 🔒 Reporting a Vulnerability

If you discover a security vulnerability or potential privacy issue within the Raasta codebase, please do **NOT** open a public GitHub issue.

Instead, please report it privately via email:
- **Email**: `shashankatthaluri@gmail.com`
- **Subject**: `[SECURITY] Vulnerability Report in Raasta`

Please include:
- A description of the issue and potential impact.
- Step-by-step reproduction instructions or a Proof of Concept (PoC).
- Any suggested remediations if available.

We will acknowledge receipt within 48 hours and work with you on a timely, responsible fix and credit.
