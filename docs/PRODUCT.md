# Product Specification & Philosophy

> **Product Thesis**: *Government systems are designed around administrative processes. Citizens experience outcomes. Raasta connects the two.*

---

## 🏛️ The Three Core Pillars

### 1. The Recovery Case
Traditional portals treat status checks as stateless lookups. The citizen searches, sees an obscure error code ("Payment Stopped by State on Request"), closes the tab in confusion, and repeats the process next week.

A **Recovery Case** is an active, persistent docket. It binds:
- The exact failure cause in human language.
- The single next required action.
- The history of what has already happened.
- The sequence of what will happen next.

### 2. The Responsibility Baton
The fundamental question every citizen asks is: **"Whose turn is it?"**

Raasta introduces the visual **Baton Rail**:
- `YOU ✓` $\rightarrow$ `STATE VERIFICATION` $\rightarrow$ `PFMS TREASURY` $\rightarrow$ `₹2,000 CREDITED`
- When the state is verifying records, the baton is clearly with the government.
- The citizen is explicitly told: *"You don't need to do anything right now."* This eliminates unnecessary, stressful trips to bank branches or block offices.

### 3. Minimum Human Action
If technology cannot reduce human cognitive burden, it should not exist.
- Raasta reduces every multi-step bureaucratic puzzle to at most **one single next physical or digital action**.
- If no action is required, the UI collapses into a quiet, reassuring wait state.

---

## 🚫 Why Certain Things Are Deliberately NOT Automated

1. **No False SLAs or Countdown Timers**:
   - We deliberately **do not** show fake countdowns (e.g., *"Resolved in 4 days"*). Government verification batches depend on district revenue officers, field inspections, and treasury liquidity. Providing false precision destroys citizen trust.

2. **Citizen Self-Report $\neq$ Official Verification**:
   - We do not immediately mark a case as "Approved" when a user clicks a button. We transition to *"Action Reported — Awaiting State Signal"*. Trust requires total honesty about what the system knows vs. what it is waiting for.

3. **No Bureaucratic Form Dumping**:
   - When a dispute or grievance is needed, Raasta does not ask the user to fill out a 15-field government form. It automatically compiles a pre-formatted **Handoff Packet** containing exact transaction references, timestamps, and statutory citations ready for one-click submission or CSC printing.
