export interface JournalArticle {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  readTime: string;
  date: string;
  category: string;
  sources: { title: string; url?: string; type: "OFFICIAL" | "RAASTA_SYNTHESIS" | "DESIGN_DECISION" }[];
  content: string;
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: "why-government-status-isnt-enough",
    number: "01",
    title: "Why Government Status Isn't Enough",
    subtitle: "A status can tell you what happened. It doesn't always tell you what happens next.",
    readTime: "5 min read",
    date: "August 2026",
    category: "The Problem",
    sources: [
      { title: "PM-KISAN Operational Guidelines (Ministry of Agriculture)", url: "https://pmkisan.gov.in/", type: "OFFICIAL" },
      { title: "DBT Direct Benefit Transfer Bharat Portal", url: "https://dbtbharat.gov.in/", type: "OFFICIAL" },
      { title: "Raasta Recovery Case Architecture", type: "RAASTA_SYNTHESIS" },
    ],
    content: `Your payment didn't arrive.

You check the portal.

**Payment Status: Failed.**

Now what?

That question sounds simple. It isn't.

You might need to figure out whether the problem is related to your bank account, verification, eligibility, payment processing, or something else entirely.

Then comes the harder part.

Who needs to act?

You?
Your bank?
A state department?
The payment system?
Someone else?

And if you do need to act, where do you go?
What do you take with you?
What exactly do you ask for?
What happens after you've done it?
And what do you do if nothing changes?

None of these questions are answered by a status line.

That's the gap we observed.

---

## Government systems already contain a lot of information

The answer isn't to build another portal.

For PM-KISAN, there are already systems for checking beneficiary records, completing e-KYC, handling grievances, and disbursing funds.

The machinery exists.

The problem is what happens **between the citizen and that machinery**.

A citizen sees one piece of information in one place, another piece somewhere else, and then has to connect the dots themselves. They become the person responsible for coordinating the journey.

That's an invisible workload.

---

## A failed payment isn't the end of the story

Consider a simple journey.

A payment attempt fails. The citizen shouldn't have to become an investigator.

A useful experience should be able to answer:

**What happened?**
> The payment attempt was unsuccessful.

**Why?**
> Here is the reason available from the official record.

**Whose turn is it?**
> The state verification team.

**What do I need to do?**
> Nothing right now.

**What's next?**
> Verification → reprocessing → payment processing.

And if the citizen does need to act, the answer should become equally specific:

> Go to your bank.
> Bring the specific documents relevant to this issue.
> Ask for this exact check.
> Then Raasta preserves the case context.

The goal isn't more information. It's **less work to understand the information that already exists.**

---

## That's why we're building Raasta

Raasta isn't trying to replace PM-KISAN.
It isn't trying to recreate government portals.
It isn't trying to decide whether the government is right or wrong.

It sits around the citizen's journey.

The core idea is simple:

> **Government systems know what happened. Raasta helps the citizen understand what happens next.**

That means maintaining a recovery case, identifying who holds the next action, preparing the citizen only when their involvement is necessary, and preserving context as the case moves forward.

Sometimes the right answer is:
> **You need to act.**

Sometimes it's:
> **You don't need to do anything right now.**

Both are useful answers. The important thing is knowing which one is true.

---

## The real product isn't the status page

A status page answers a point in time. A recovery experience answers a journey.

**What happened → why → whose turn → what you need to do → what happens next → what if nothing changes → resolution.**

We are not trying to make citizens better at navigating government.

We are trying to make government processes require less navigation from citizens.`
  },
  {
    slug: "citizen-shouldnt-be-project-manager",
    number: "02",
    title: "The Citizen Shouldn't Be the Project Manager",
    subtitle: "The hidden work between government systems is still work.",
    readTime: "5 min read",
    date: "August 2026",
    category: "The Insight",
    sources: [
      { title: "CSC Special Purpose Vehicle Service Delivery Manual", type: "OFFICIAL" },
      { title: "NPCI Aadhaar Payment Bridge (APB) Guidelines", type: "OFFICIAL" },
      { title: "Raasta Responsibility Baton Principle", type: "RAASTA_SYNTHESIS" },
    ],
    content: `There is a strange thing about digital government services.

We often measure whether a service is available online:
Can you apply online?
Can you check your status online?
Can you submit a grievance online?

Those are important questions. But there is another question we rarely ask:

> **How much coordination does the citizen still have to do?**

Imagine a benefit stops arriving.

The citizen checks the portal.
Then calls someone.
Then visits a bank.
Then talks to a CSC operator.
Then checks the portal again.

Someone asks for a reference number. They search for it.
Someone asks what happened previously. They explain the story again.

The system may be digital. **The coordination isn't.**

---

## The invisible tax

The citizen pays in:
* Time.
* Travel.
* Repetition.
* Uncertainty.
* Memory.

And sometimes simply the mental energy required to keep asking:
> *"What am I supposed to do now?"*

That work rarely appears in an official workflow diagram. But it is still part of the citizen's experience.

---

## What changed our minds

When we started, we thought about summarizing portal statuses.

Then we realized: a summary still leaves the citizen holding the entire coordination problem.

Instead of optimizing for another status screen, we started asking how much coordination the software could absorb.

That led to three core principles:

### 1. The Recovery Case
Instead of asking the citizen to remember what happened across multiple interactions, the case remembers:
* The official evidence.
* The citizen's statement.
* The actions taken.
* The timeline.
* The current state.
* The next step.

The case becomes the memory.

---

### 2. The Responsibility Baton
At any point, there should be a clear answer to:
> **Whose turn is it?**

If it's the citizen:
> *Here is exactly what you need to do.*

If it's the bank:
> *Here is what the bank needs to check.*

If it's the state:
> *The state has the next action.*

If it's the payment system:
> *The payment system is processing.*

The baton should move. The citizen shouldn't have to chase it around.

---

### 3. Minimum Human Action
We don't want to automate what cannot be automated.

If a citizen needs to complete an in-person verification, software cannot pretend to do it for them.

Instead, it should make their part as small and clear as possible:
* Where do you go?
* What do you bring?
* What do you say?
* What happens afterward?

Then stop asking them to think about things that no longer require them.

---

## The goal isn't zero interaction

It's **zero unnecessary interaction**.

A good system shouldn't say:
> *"You don't need to do anything."*

and leave you wondering whether your case fell into a void.

It should say:
> **You don't need to do anything right now.**
> **We're waiting for:** State verification.
> **Responsibility:** State verification team.
> **Next:** Payment reprocessing.
> **If the case remains unchanged:** We'll show you the next available review or grievance route.

Now waiting has context.

---

## That's the kind of software we want to build

The citizen should get to be the citizen.

Not the database.
Not the project manager.
Not the person carrying the entire state of their case in their head.`
  },
  {
    slug: "when-do-nothing-is-good-ux",
    number: "03",
    title: "When \"Do Nothing\" Is Actually Good UX",
    subtitle: "Why removing work matters more than adding features.",
    readTime: "5 min read",
    date: "August 2026",
    category: "Product Philosophy",
    sources: [
      { title: "PFMS Public Financial Management System Re-processing Cycle Docs", type: "OFFICIAL" },
      { title: "Raasta State Machine & Signal Traps", type: "DESIGN_DECISION" },
    ],
    content: `Most software is designed around action.

Click something.
Submit something.
Check something.
Refresh something.
Open a notification.
Do something.

In government services, sometimes the citizen's action is **not** what is missing.

The system needs to act.

And when that happens, asking the citizen to keep doing things doesn't make the system better. It just moves the uncertainty onto them.

---

## Consider an in-flight verification

A citizen sees:
**Payment unsuccessful.**

Their natural reaction is:
> *"What should I do?"*

A conventional interface might send them searching across pages, helplines, or bank branches.

A better experience first determines whether there is actually an action required from the citizen.

If there isn't, the answer should be direct:

# **You don't need to do anything right now.**

That is only half the experience. The sentence becomes useful when it is followed by context:

> **We're waiting for:** Official state verification and payment reprocessing.
> **Responsibility:** State verification team.
> **Next:** Payment processing.
> **If your case remains unchanged:** We'll show you the next available review or grievance route.

Now "do nothing" isn't abandonment. It's a decision.

---

## Waiting needs honest information

People don't necessarily need a fabricated guarantee. They need to know what they are waiting for.

If an official resolution timeline isn't documented, inventing one is worse than admitting it.

So Raasta is deliberate about saying:
> **No official resolution timeline is available for this step.**

That sentence might feel less comforting than a fake countdown timer. We think it is more trustworthy.

The product should never manufacture certainty simply because uncertainty makes a cleaner interface.

---

## And when action is needed, make it singular

If the citizen is the next actor, Raasta says so directly:
> **Your action: Complete e-KYC.**

Then provide only the requirements substantiated for that action.

The principle is symmetrical:
**When you need to act, make the action clear.**
**When you don't, get out of the way.**

---

## A different way to measure UX

Traditional product thinking often asks:
> *How quickly did the user complete the flow?*

We think another metric matters:
> **How much unnecessary work did the user have to perform?**

If a citizen opens Raasta, understands that the state has the next action, and closes the tab without visiting three other websites—that is a successful interaction.

Nothing moved on the screen.

But something important happened:
> *"I know where my case stands. I know whose turn it is. I don't need to chase it right now."*

That's good UX.`
  },
  {
    slug: "why-raasta-doesnt-let-ai-decide",
    number: "04",
    title: "Why Raasta Doesn't Let AI Decide",
    subtitle: "AI understands the citizen. Deterministic rules determine reality.",
    readTime: "5 min read",
    date: "August 2026",
    category: "The Technology",
    sources: [
      { title: "OpenAI GPT-4o-mini Classification Layer", type: "RAASTA_SYNTHESIS" },
      { title: "Deterministic Finite State Machine (engine.ts)", type: "DESIGN_DECISION" },
      { title: "Government of India AI & Public Digital Goods Safety Framework", type: "OFFICIAL" },
    ],
    content: `A citizen won't always describe a government problem in structured administrative terms.

They might write or say:
> *"Bhai pichhle do mahine se paisa nahi aaya."*

Or:
> *"Mera naam sahi hai lekin reject dikha raha hai."*

Or simply:
> *"Payment nahi mila."*

People don't speak in database schemas.

That's where AI is useful. It can understand how people naturally describe a problem across spoken vernaculars, Hindi, and Hinglish. It can identify the likely intent.

But that is where the boundary must remain.

---

## AI understands the citizen. Rules determine the case.

That's one of the most important architectural decisions in Raasta.

Suppose the official record says:
**Payment: Failed**

The citizen says:
> *"Everything is correct on my side."*

AI should not decide:
> *"The government record is wrong."*

It should preserve the disagreement cleanly:

**OFFICIAL RECORD:**
Payment attempt was unsuccessful.

**YOU TOLD US:**
Everything is correct on my side.

Now the case contains both facts. The responsible authority decides what they mean.

---

## The same discipline applies to time

An AI model could easily generate something comforting:
> *"Your payment will arrive in 7–14 days."*

If there is no official basis for that timeline, the system must not say it.

The correct answer remains:
> **No official resolution timeline is available for this step.**

Trust is more valuable than a confident sentence.

---

## AI does not manufacture instructions

If a bank action is required, Raasta provides only the requirements that are actually substantiated for that issue.

Not an exhaustive list of ten generic documents because it looks thorough.

Only what the evidence supports.

The principle is simple:
> **AI can make the citizen's words easier to understand. It cannot make facts up.**

---

## The architectural separation

The AI layer produces structured intent.

Then the deterministic engine handles the case transitions:

$$\\text{Citizen language} \\longrightarrow \\text{Intent understanding} \\longrightarrow \\text{Deterministic rules} \\longrightarrow \\text{Official evidence} \\longrightarrow \\text{Citizen action}$$

We don't want an autonomous AI government agent.

We want something more predictable and more useful: a system that knows the difference between:
> *"I understand what you mean."*

and
> *"I know what the government will do."*

The first is where language models help.
The second requires evidence.`
  },
  {
    slug: "designing-for-the-counter",
    number: "05",
    title: "Designing for the Counter: What We Learned Building Raasta",
    subtitle: "Software for citizens is often designed for screens. Real life happens at physical desks.",
    readTime: "6 min read",
    date: "August 2026",
    category: "Design & Craft",
    sources: [
      { title: "Common Service Center (CSC) Counter Workflow Observations", type: "OFFICIAL" },
      { title: "Deterministic Finite State Machine Architecture", type: "DESIGN_DECISION" },
      { title: "Bilingual Translation & Speech Verification", type: "RAASTA_SYNTHESIS" },
    ],
    content: `When we started building Raasta, many of our initial assumptions turned out to be wrong.

We thought about dashboards. We thought about chat interfaces. We thought about live API streaming.

Then we looked closely at how a citizen actually experiences a failed PM-KISAN installment.

Here are the practical lessons we learned, what we refused to build, and why.

---

## 1. Why language selection is the front door, not a corner setting

In standard software, language selection is usually placed in the top corner as a small dropdown.

When a citizen whose primary language is Hindi or Telugu arrives at an unfamiliar page, English text with a tiny corner setting signals that the tool wasn't designed with them in mind.

**What we decided:**
We made language selection the first explicit step before showing forms or technical terms. Once the citizen chooses their language, the switcher docks into the top bar and stays accessible without dominating the screen.

We also followed a strict rule: **only offer languages that are fully translated and verified.** We chose complete, accurate coverage over a long list of half-translated options.

---

## 2. Public dockets over invasive credential gating

Our first instinct was: *should we ask for an Aadhaar number or mobile OTP?*

We realized that in public service troubleshooting, asking for OTPs right away creates immediate friction and distrust. Citizens are wary of OTP prompts on unfamiliar sites, and family members checking on behalf of an elder often don't have the linked phone on hand.

**What we decided:**
PM-KISAN uses an 11-digit Registration Number. We treat this as a **public recovery docket**.

Any valid 11-digit pattern lets the citizen or field worker diagnose the case, understand the evidence, and see the recovery path—without collecting private passwords or triggering unnecessary verification hurdles.

---

## 3. Why voice is deliberate, not a continuous chat loop

We initially experimented with conversational voice bots.

In practice, a citizen standing near a busy counter or roadside kiosk does not want an endless spoken conversation with an AI assistant.

They need three things:
1. What is the issue?
2. Whose turn is it?
3. What do I do next?

**What we decided:**
* We replaced open-ended chat loops with **structured case cards**.
* Voice playback is on-demand: when a citizen taps "Listen", it plays a concise, pre-verified summary in their language.
* Speech input is scoped strictly to capturing the citizen's problem statement, converting it into structured intent, and immediately handing it off to deterministic rules.

---

## 4. Making long-running processes observable

In real life, government recovery doesn't happen in 100 milliseconds. An e-KYC biometric synchronization can take 3 days; an NPCI bank mapper update can take 48 hours.

When demonstrating the product lifecycle, jumping straight to a "Resolved" screen felt misleading. It hid the reality of how cases actually move through government systems.

**What we decided:**
To make long-running recovery observable during demonstrations, we introduced visible lifecycle transitions and realistic time-lapse markers (*"3 Days Later: Biometric log synchronized with State Nodal"*).

This communicates how the system maintains state and memory across the actual days a case takes, rather than pretending government bureaucracy is instant.

---

## 5. Physical counter readiness: "Where to Go" and "What to Bring"

A digital diagnosis is incomplete if the citizen still gets turned away at a physical office.

If an e-KYC biometric mismatch occurs, the citizen must walk into a Common Service Center or bank branch. If they don't know the exact issue, they say *"my money didn't come"*, and a busy operator may not know which record to inspect.

**What we decided:**
We built the **Physical Counter Pass**:
* **Exact destination:** Tells the citizen whether their step is at a Bank, a CSC, or a State Nodal office.
* **Minimum document checklist:** Lists only the specific papers required for that exact failure, rather than a generic folder of documents.
* **Clear statement:** Provides the exact phrase to say at the desk (*"Please check my Aadhaar biometric seeding on the NPCI mapper"*).

---

## The real craft was restraint

The hardest part of building Raasta wasn't adding more features.

It was removing things:
* No chatbot bubbles.
* No fabricated resolution dates.
* No invasive credential walls.
* No pretending that digital tools replace physical desks.

Good public software doesn't try to be clever. It tries to be **clear, reliable, and respectful of people's time.**`
  },
  {
    slug: "what-if-services-were-designed-around-recovery",
    number: "06",
    title: "What If Government Services Were Designed Around Recovery?",
    subtitle: "Most digital services are designed around the happy path. Real life happens when something fails.",
    readTime: "6 min read",
    date: "August 2026",
    category: "The Bigger Vision",
    sources: [
      { title: "Ministry of Agriculture & Farmers Welfare PM-KISAN Annual Report", type: "OFFICIAL" },
      { title: "CPGRAMS Centralized Public Grievance Redressal and Monitoring System", url: "https://pgportal.gov.in/", type: "OFFICIAL" },
      { title: "Raasta Public Recovery Protocol", type: "RAASTA_SYNTHESIS" },
    ],
    content: `Most digital services are designed around the happy path.

You apply.
You submit.
You get approved.
You receive the benefit.

Real life isn't a happy-path diagram.

Applications get delayed.
Payments fail.
Records don't match.
Verification is required.
A citizen disagrees with a status.
A process moves across departments.

And eventually someone asks:
> **"Now what?"**

That's where public digital services need a different design model.

---

## Design for the recovery, not just the transaction

A transaction-oriented system asks:
> *Did the payment succeed?*

A recovery-oriented system asks:
> **If it didn't, what happens next?**

That creates a different lifecycle:

### 1. Detect
Something failed or stopped.
**Payment unsuccessful.**

### 2. Diagnose
Understand the available official record.
**Why did it happen?**

### 3. Assign responsibility
Identify the next actor.
**Whose turn is it?**

### 4. Act
If the citizen needs to do something:
**What exactly? Where? With what documents?**

### 5. Follow up
If the citizen doesn't need to act:
**What are we waiting for?**

### 6. Escalate
If the expected progress doesn't occur:
**What is the legitimate review or grievance route?**

### 7. Resolve
The case reaches an outcome.
**Payment credited.**

This is the recovery loop.

---

## PM-KISAN is where we started

We chose PM-KISAN because it is a concrete, high-impact public service.

The official infrastructure already exists. Our job isn't to recreate it.

Our job is to explore what happens when a citizen has to move across the boundaries between those systems.

In our current build, government signals are simulated from publicly documented PM-KISAN workflows. We don't access live beneficiary data.

That boundary matters. We are proving the **product model first**.

---

## The model goes beyond one scheme

The same pattern appears across public services:
* A pension doesn't arrive.
* A scholarship is stuck in verification.
* A certificate application has a discrepancy.
* A land record doesn't match an identity document.
* A subsidy payment doesn't move.

Different departments. Different systems. Different rules.

The citizen's question remains the same:
> **What happened?**
> **What happens next?**

---

## The opportunity

We don't need another portal for every department.

We need better connective tissue around the citizen's journey:
* A persistent recovery case.
* A clear responsibility baton.
* Minimum human action.
* Evidence attached to the record.
* A legitimate recovery path when something goes wrong.

We started with a simple observation:

> **The hardest part of many government services isn't finding the status. It's figuring out what to do after the status.**

We are not trying to make citizens better at navigating government.

We are trying to make government processes require less navigation from citizens.

---

## **Raasta**
### **What happens next.**`
  }
];
