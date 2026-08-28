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
    readTime: "6 min read",
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

That question sounds simple.

It isn't.

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

None of these questions are necessarily answered by a status.

That's the gap we're interested in.

---

## Government systems already contain a lot of information

The answer isn't to build another portal.

For PM-KISAN, there are already systems for checking beneficiary information, completing required processes, handling grievances, and processing payments.

The machinery exists.

The problem is often what happens **between the citizen and that machinery**.

A citizen sees one piece of information in one place, another piece somewhere else, and then has to connect the dots themselves.

They become the person responsible for coordinating the journey.

That's an invisible workload.

---

## A failed payment isn't the end of the story

Consider a simple journey.

A payment attempt fails.

The citizen shouldn't have to become an investigator.

A useful experience should be able to answer:

**What happened?**
> The payment attempt was unsuccessful.

**Why?**
> Here's the reason available from the official record.

**Whose turn is it?**
> The state verification team.

**What do I need to do?**
> Nothing right now.

**What's next?**
> Verification → reprocessing → payment processing.

And if the citizen does need to act, the answer should become equally specific:

> Go to your bank.
> Bring the documents relevant to this issue.
> Ask for this specific check.
> Then Raasta keeps the case context.

The goal isn't more information.

It's **less work to understand the information that already exists.**

---

## That's why we're building Raasta

Raasta isn't trying to replace PM-KISAN.

It isn't trying to recreate government portals.

It isn't trying to decide whether the government is right or wrong.

It sits around the citizen's journey.

The core idea is simple:

> **Government systems know what happened. Raasta helps the citizen understand what happens next.**

That means maintaining a recovery case, identifying who has the next action, preparing the citizen only when their involvement is necessary, and preserving the context as the case moves forward.

Sometimes the right answer is:

> **You need to act.**

Sometimes it's:

> **You don't need to do anything right now.**

Both are useful answers.

The important thing is knowing which one is true.

---

## The real product isn't the status page

A status page answers a question.

A recovery experience answers a journey.

**What happened → why → whose turn → what you need to do → what happens next → what if nothing changes → resolution.**

That's the experience we're trying to build.

Not another place to check a status.

A way to stop checking everything yourself.`
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

We often measure whether a service is available online.

Can you apply online?

Can you check your status online?

Can you submit a grievance online?

Those are important questions.

But there is another question we don't ask often enough:

> **How much coordination does the citizen still have to do?**

Imagine a benefit stops arriving.

The citizen checks the portal.

Then calls someone.

Then visits a bank.

Then talks to a CSC operator.

Then checks the portal again.

Someone asks for a reference number.

They search for it.

Someone asks what happened previously.

They explain the story again.

The system may be digital.

**The coordination isn't.**

---

## This is the invisible tax

The citizen pays in:

**Time.**

**Travel.**

**Repetition.**

**Uncertainty.**

**Memory.**

And sometimes simply the mental energy required to keep asking:

> "What am I supposed to do now?"

That work rarely appears in the official journey.

But it is still part of the journey.

---

## We think software should absorb more of it

This is the principle behind Raasta.

### 1. The Recovery Case

Instead of asking the citizen to remember what happened across multiple interactions, the case remembers.

The official evidence.

The citizen's statement.

The actions taken.

The timeline.

The current state.

The next step.

The case becomes the memory.

---

### 2. The Responsibility Baton

At any point, there should be a clear answer to:

> **Whose turn is it?**

If it's the citizen:
> Here's exactly what you need to do.

If it's the bank:
> Here's what the bank needs to check.

If it's the state:
> The state has the next action.

If it's the payment system:
> The payment system is processing.

The baton should move.

The citizen shouldn't have to chase it around.

---

### 3. Minimum Human Action

We don't want to automate everything.

Some things genuinely require the citizen.

If you need to complete a process, **Raasta shouldn't pretend it can do that for you.**

Instead, it should make your part as small and clear as possible.

Where do you go?

What do you bring?

What do you say?

What happens afterward?

Then stop asking you to think about things that no longer require you.

---

## The goal isn't zero interaction

It's **zero unnecessary interaction**.

That's an important difference.

A good system shouldn't say:

> "You don't need to do anything."

and leave you wondering whether your case has disappeared.

It should say:

> **You don't need to do anything right now.**
>
> **We're waiting for:** State verification.
>
> **Responsibility:** State verification team.
>
> **Next:** Payment reprocessing.
>
> **If the case remains unchanged:** We'll show you the next available review or grievance route.

Now waiting has context.

---

## That's the kind of software we want to build

Not software that makes citizens better at navigating bureaucracy.

Software that makes **bureaucratic coordination less of the citizen's job.**

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

But government services have a different problem.

Sometimes the citizen's action is **not** what is missing.

The system needs to act.

And when that happens, asking the citizen to keep doing things doesn't make the system better.

It just moves the uncertainty onto them.

---

## Consider a payment that has failed

A citizen sees:

**Payment unsuccessful.**

Their natural reaction is:

> "What should I do?"

A bad experience might send them looking for another page.

Then another.

Then a helpline.

Then a bank.

Then back to the portal.

A better experience first determines whether there is actually something the citizen needs to do.

If there isn't, the answer should be simple:

# **You don't need to do anything right now.**

But that's only half the experience.

The sentence becomes useful when it is followed by context.

> **We're waiting for:** Official state verification and payment reprocessing.
>
> **Responsibility:** State verification team.
>
> **Next:** Payment processing.
>
> **If your case remains unchanged:** We'll show you the next available review or grievance route.

Now "do nothing" isn't abandonment.

It's a decision.

---

## Waiting needs information

People don't necessarily need a guaranteed deadline.

They need to know what they're waiting for.

That's an important distinction.

If an official resolution timeline isn't available, inventing one is worse than admitting it.

So Raasta should be comfortable saying:

> **No official resolution timeline is available for this step.**

That sentence might feel less impressive.

We think it's more trustworthy.

The product should never manufacture certainty simply because uncertainty makes a better interface.

---

## And sometimes the answer really is action

If the citizen is the next actor, Raasta should say so.

Not:

> "Please check your details."

But:

> **Your action: Complete e-KYC.**

Then provide the verified route and only the requirements relevant to that action.

The principle is symmetrical:

**When you need to act, make the action clear.**

**When you don't, get out of the way.**

---

## This changes how we measure UX

Traditional product thinking often asks:

> How quickly did the user complete the flow?

We think another metric matters:

> **How much unnecessary work did the user have to perform?**

If a citizen opens Raasta, understands that the state has the next action, and closes the page without visiting three other websites—

**that can be a successful interaction.**

Nothing happened on the screen.

But something important happened in the citizen's mind:

> **"I know where my case stands. I know whose turn it is. I don't need to chase it right now."**

That's good UX.`
  },
  {
    slug: "why-raasta-doesnt-let-ai-decide",
    number: "04",
    title: "Why Raasta Doesn't Let AI Decide",
    subtitle: "AI understands the citizen. Deterministic rules determine reality.",
    readTime: "6 min read",
    date: "August 2026",
    category: "The Technology",
    sources: [
      { title: "OpenAI GPT-4o-mini Classification Layer", type: "RAASTA_SYNTHESIS" },
      { title: "Deterministic Finite State Machine (engine.ts)", type: "DESIGN_DECISION" },
      { title: "Government of India AI & Public Digital Goods Safety Framework", type: "OFFICIAL" },
    ],
    content: `A citizen won't always describe a government problem in structured language.

They might write:

> "Bhai pichhle do mahine se paisa nahi aaya."

Or:

> "Mera naam sahi hai lekin reject dikha raha hai."

Or simply:

> "Payment nahi mila."

People don't speak in database fields.

That's where AI can help.

It can understand what someone is trying to say.

It can identify the likely intent.

It can work across natural language, including Hindi, Telugu, Tamil, Kannada, Marathi, Bengali, Punjabi, and Hinglish.

But that's where we want the boundary to be.

---

## AI understands the citizen.

**Rules determine the case.**

That's one of the most important architectural decisions in Raasta.

Suppose the official record says:

**Payment: Failed**

The citizen says:

> "Everything is correct on my side."

AI should not conclude:

> "The government is wrong."

It should preserve the disagreement.

**OFFICIAL RECORD:**
Payment attempt was unsuccessful.

**YOU TOLD US:**
Everything is correct on my side.

Now the case contains both facts.

The authority decides what they mean.

---

## The same principle applies to time

An AI system could easily produce something reassuring:

> "Your payment should arrive within 7–14 days."

But if there is no official basis for that timeline, we shouldn't say it.

The correct answer is:

> **No official resolution timeline is available for this step.**

Trust is more valuable than a confident sentence.

---

## And AI doesn't get to manufacture instructions

If a bank action is required, Raasta should only provide requirements that are actually substantiated for that issue.

Not:

> "Bring Aadhaar, PAN card, two photographs, passbook, cancelled cheque, land documents, and three witnesses."

because it sounds comprehensive.

Only provide what the evidence supports.

The principle is simple:

> **AI can make the experience easier to understand. It cannot make the underlying facts up.**

---

## This is why the architecture matters

The AI layer produces structured intent.

Then the deterministic product engine handles the actual case logic.

That means:

**Citizen language**
↓
**AI understanding**
↓
**Structured intent**
↓
**Deterministic rules**
↓
**Official evidence**
↓
**Citizen experience**

The AI helps Raasta understand what the person said.

It doesn't decide what the government record means.

---

## We don't want an AI government agent

We want something more boring—and more useful.

A system that knows the difference between:

> **"I understand what you mean."**

and

> **"I know what the government will do."**

The first is something AI can help with.

The second requires evidence.

That distinction is central to Raasta.`
  },
  {
    slug: "designing-for-the-counter",
    number: "05",
    title: "Designing for the Counter: The UI/UX Architecture of Raasta",
    subtitle: "Software for citizens is often designed for screens. Real life happens at physical counters.",
    readTime: "7 min read",
    date: "August 2026",
    category: "Design & Craft",
    sources: [
      { title: "Common Service Center (CSC) Counter Workflow Study", type: "OFFICIAL" },
      { title: "Apple Human Interface Guidelines on Typography & Sensory Motion", type: "DESIGN_DECISION" },
      { title: "Sarvam AI Multilingual Speech Architecture", type: "RAASTA_SYNTHESIS" },
    ],
    content: `When building software for civic infrastructure and rural citizens, conventional consumer UX guidelines often lead teams astray.

In consumer apps, success is measured in daily engagement, notification clicks, and endless chat loops.

In civic recovery systems, success is the exact opposite: **minimizing human anxiety, eliminating unnecessary travel, and giving citizens immediate physical readiness.**

Here is an honest field guide to the engineering and design decisions we made while building Raasta—and the practical lessons learned for anyone building for the next billion users.

---

## 1. Why Language is Front-and-Center, Not Hidden in a Corner Dropdown

In standard web design, language selectors are tucked into the top-right corner as a tiny 12px globe icon.

For rural and non-English-first citizens, this is an immediate barrier.

If a farmer in Warangal or Gorakhpur lands on a page showing English text with a hidden corner dropdown, their first thought is: *"This portal is not meant for me."* They close the tab within three seconds.

**What we learned:**
* Language is not a secondary setting; it is the **entry gate of trust**.
* By placing the language selection as a prominent, welcoming card right after the intro, the citizen chooses their mother tongue (*Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, Punjabi, English*) before encountering a single complex form.
* Once selected, the language switcher docks smoothly into the top bar, staying out of the way for the rest of the recovery journey.

---

## 2. The 11-Digit Input Strategy: Safe Public Dockets Over Invasive Credential Gating

The default instinct when building government prototypes is to ask for an Aadhaar number and trigger an OTP.

In practice, this creates two massive problems:
1. **Fear of Scams:** Farmers are frequently targeted by phishing attacks and fake KYC portals. Asking for OTPs immediately triggers suspicion.
2. **Access Drop-off:** If a family member is checking a status on behalf of an elderly parent, they often don't have immediate access to the linked SIM card.

**Our Approach:**
PM-KISAN uses an official **11-digit Registration Number** (e.g. '98765432101').
* We strictly enforce the 11-digit format: the check button remains disabled with 'opacity-40 cursor-not-allowed' until all 11 digits are present, preventing partial server requests.
* By treating the identifier as a public recovery docket, any valid 11-digit number allows citizens, evaluators, and field workers to test and understand realistic state transitions (Payment Failure, Land Seeding Discrepancy, e-KYC Pending) without risking private data or requiring invasive credentials.

---

## 3. Why Audio is One-Time & Cached, Not Continuous Generative Cloud Calls

Many AI voice prototypes stream audio by making continuous remote cloud API calls every time a user interacts.

In rural field conditions, this breaks down rapidly:
* **The 3-Second Latency Gap:** Spotty 2G/3G connectivity turns cloud TTS into 3 to 4 seconds of dead silence, making the application feel frozen.
* **Acoustic Chaos:** At a crowded Common Service Center or Tehsil office, auto-playing continuous audio causes confusion and privacy concerns.
* **Unbounded Cloud Costs:** Repeated API calls for identical state explanations quickly become financially unsustainable.

**The Engineering Solution:**
* **Pre-Rendered Deterministic Audio:** We pre-synthesized high-fidelity audio explanations for official government states directly on the client across all 8 supported Indian languages.
* **Instant 0ms Playback:** When a citizen taps *“🔊 Listen (Audio)”*, playback begins immediately without a server round-trip.
* **On-Demand Control:** Audio is triggered strictly when the citizen requests it, giving them complete privacy and control in public environments.

---

## 4. Protecting Speech-to-Text from Misuse & Hallucination

Allowing open microphone input into an AI backend creates serious vulnerability risks: background farm noise, runaway token costs, and prompt injection attempts.

To solve this, we implemented a layered guard:
* **Audio Chunk Duration & Silence Truncation:** Voice recordings are limited to concise 15-second windows with automatic silence detection, preventing accidental background streaming.
* **Intent-Only Classification:** The audio is transcribed and passed strictly through a scoped classification layer that maps what the citizen said to structured civic categories (e.g. 'PAYMENT_MISSING', 'EKYC_PENDING').
* **Deterministic Guardrails:** The AI is never allowed to invent case states, create fake government dates, or alter official records. It only translates citizen voice into structured intent.

---

## 5. Why We Built the "Magic Demo" Button

Civic recovery processes in real life take days or weeks. A land record verification takes 3 days; an NPCI bank mapper sync takes 48 hours.

When presenting to evaluators, judges, or training village field workers, you cannot ask someone to wait 14 days to observe how the software manages state transitions.

**The Purpose of the Magic Button:**
* **Autonomous Demonstration:** It simulates a full 4-step recovery journey in 30 seconds.
* **Virtual Cursor & Time-Lapse Modals:** Instead of an instant, fake 50ms transition, a translucent virtual pointer glides to each action, and interstitial calendar cards appear (*“⏳ 3 Days Later: Biometric log synchronized with State Nodal”*).
* **Teaching the Lifecycle:** It visually proves *how software carries state and memory across time*, turning an abstract architecture into something tangible and easy to evaluate.

---

## 6. Physical Counter Readiness: "Where to Go" and "Documents to Carry"

A digital diagnosis is completely useless if a citizen travels 15 kilometers to a government office only to be sent home because they were missing a photocopy.

Civic software must bridge the gap between digital screens and physical counters:
* **Exact Destination Guidance:** Raasta explicitly tells the citizen whether their next step is at a **Bank Branch**, a **Common Service Center (CSC)**, or their **State Agriculture Nodal Office**.
* **Substantiated 2-Document Checklist:** Rather than displaying a terrifying list of 10 generic documents, Raasta calculates the *minimum substantiated papers* needed for that specific failure code (e.g. just Aadhaar + Bank Passbook for NPCI seeding).
* **Verbatim Spoken Script:** A single sentence the citizen can read aloud or play at the desk (*“Please check my Aadhaar biometric seeding on the NPCI mapper”*), preventing miscommunication with busy counter operators.

---

## What We Learned as Builders

Building for public digital infrastructure is not about demonstrating technological complexity.

It is about **exercising restraint**.

The hardest part of the engineering wasn't adding more AI or more features. It was removing unnecessary steps, pre-rendering audio so it works with zero latency, and designing software that respects the citizen's time and dignity.

If you are building public technology, we hope these lessons help you build systems that genuinely serve people.`
  },
  {
    slug: "what-if-services-were-designed-around-recovery",
    number: "06",
    title: "What If Government Services Were Designed Around Recovery?",
    subtitle: "Most digital services are designed around the happy path. Real life happens when something fails.",
    readTime: "7 min read",
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

But real life isn't a happy-path diagram.

Applications get stuck.

Payments fail.

Information doesn't match.

Verification is required.

A citizen disagrees with a record.

A process moves from one department to another.

And eventually someone asks:

> **"Now what?"**

That's where we think public digital services need a different design model.

---

## Design for the recovery, not just the transaction

A transaction-oriented system asks:

> Did the payment succeed?

A recovery-oriented system asks:

> **If it didn't, what happens next?**

That creates a different architecture.

### 1. Detect
Something changed.
**Payment unsuccessful.**

### 2. Diagnose
Understand the available evidence.
**Why did it happen?**

### 3. Assign responsibility
Identify the next actor.
**Whose turn is it?**

### 4. Act
If the citizen needs to do something:
**What exactly?**

### 5. Follow up
If the citizen doesn't need to act:
**What are we waiting for?**

### 6. Escalate
If the expected progress doesn't happen:
**What is the next legitimate route?**

### 7. Resolve
The case reaches an outcome.
**Payment credited.**

This is the recovery loop.

---

## PM-KISAN is where we're starting

We chose PM-KISAN because it gives us a concrete problem to work against.

The official ecosystem already contains significant infrastructure.

Our job isn't to recreate it.

Our job is to explore what happens when a citizen has to move across the boundaries between those systems.

For the current build, government signals are simulated from publicly documented PM-KISAN workflows. We don't access live individual beneficiary data.

That boundary matters.

We're building and testing the **product model first**.

---

## But the model goes beyond one scheme

The same question appears in many public services.

A pension doesn't arrive.

A scholarship is stuck.

A certificate application needs correction.

A land record doesn't match.

A passport process is delayed.

A subsidy doesn't move.

Different departments.

Different systems.

Different rules.

But the citizen's fundamental question often remains:

> **What happened?**

And then:

> **What happens next?**

---

## That's the opportunity

We don't need another portal for every department.

We need better connective tissue around the citizen's journey.

A persistent case.

A clear responsibility baton.

Minimum human action.

Evidence that remains attached to the case.

A legitimate recovery path when something goes wrong.

And an interface that doesn't make people become experts in government systems just to receive something they're entitled to.

---

## The larger idea behind Raasta

We started with a simple observation:

> **The hardest part of many government services isn't finding the status. It's figuring out what to do after the status.**

So we're building around that moment.

Not around another dashboard.

Not around another chatbot.

Not around AI for its own sake.

Around recovery.

Because a public service shouldn't only work when everything goes right.

**It should know what to do when something goes wrong.**

And perhaps the simplest way to describe what we're building is still:

# **Raasta**

### **What happens next.**`
  }
];
