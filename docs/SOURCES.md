# Government Data & Source Provenance

> **Essential Disclaimer**: Raasta's prototype uses simulated government-service signals based on publicly documented PM-KISAN workflows. It is not an official PM-KISAN service and does not access live individual beneficiary data.

---

## 🏛️ Official Sources & Policy Documentation

The recovery logic, state transitions, and evidence requirements modeled in Raasta are derived directly from publicly available government notifications, standard operating procedures (SOPs), and operational guidelines published by the Ministry of Agriculture & Farmers Welfare, Government of India:

1. **PM-KISAN Operational Guidelines (Revised 2023–2024)**:
   - *Source*: Department of Agriculture & Farmers Welfare ([pmkisan.gov.in](https://pmkisan.gov.in))
   - *Procedures Modeled*: Landholding verification criteria, exclusion criteria, DBT installment disbursal mechanisms, and state nodal officer verification batches.

2. **Standard Operating Procedure for e-KYC & Aadhaar Seeding**:
   - *Source*: National Informatics Centre (NIC) & Ministry of Electronics and Information Technology (MeitY)
   - *Procedures Modeled*: OTP-based e-KYC, biometric verification at Common Service Centres (CSCs), and NPCI bank account Aadhaar-seeding pipelines.

3. **Public Financial Management System (PFMS) DBT Failure Workflows**:
   - *Source*: Controller General of Accounts, Ministry of Finance ([pfms.nic.in](https://pfms.nic.in))
   - *Procedures Modeled*: Account inactive / dormant return codes, bank merger IFSC transitions, and automated treasury retry batches.

4. **Public Grievance Redressal Mechanisms**:
   - *Source*: Centralized Public Grievance Redress and Monitoring System ([pgportal.gov.in](https://pgportal.gov.in))
   - *Procedures Modeled*: District grievance nodal escalation formats, formal dispute drafting, and handoff packets.

---

## 🔬 Distinguishing Documented Policy from Prototype Behavior

| Domain Feature | Official Policy Basis | Prototype Implementation |
|:---|:---|:---|
| **e-KYC Status & Remedy** | Mandatory biometric/OTP validation via UIDAI | Modeled in `J1_FARMER_EKYC`. Citizen action required at CSC/Portal. |
| **State Land Verification** | District revenue records audit by State Nodal Officer | Modeled in `J2_GOVT_VERIFICATION`. Citizen action is zero; state holds baton. |
| **DBT Payment Re-attempt** | PFMS automated retry after bank routing correction | Modeled in `J3_PAYMENT_FAILURE`. Farmer does not visit bank; system re-attempts. |
| **Government Signals** | State & Bank APIs push XML/JSON updates | Simulated via `MockGovernmentAdapter` using realistic signal schemas. |
| **Citizen Beneficiary Data** | Protected under Aadhaar Act & IT Act | **Zero real data.** All sample cases use synthetic 11-digit numbers (e.g. `10203040506`). |

---

## 🔌 Future Official Integration Boundary

The adapter interface (`src/adapters/index.ts`) defines an agnostic contract:

```typescript
export interface GovernmentAdapter {
  fetchCase(registrationNumber: string): Promise<CaseSnapshot | null>;
  submitCitizenEvidence(caseId: string, evidence: EvidenceSubmission): Promise<EvidenceAck>;
  pollSignal(caseId: string): Promise<GovernmentSignal | null>;
}
```

In the future, an authorized agency could implement `OfficialGovernmentAdapter` connecting to authorized DBT APIs **without altering a single line of the Case Engine, Rules Engine, or UI presentation layer**.
