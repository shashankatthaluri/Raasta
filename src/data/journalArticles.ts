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
    content: `When software is built for urban tech consumers, design goals are familiar:
Maximize daily active time.
Add notifications.
Keep users trapped in conversational chat loops.
Call external cloud APIs continuously.

When you design for an Indian farmer whose PM-KISAN installment has stopped, those rules completely invert:
**Every extra tap is a point of abandonment.**
**Every nested box is cognitive friction.**
**Every cloud API latency spinner is distrust.**

Here are the deliberate product engineering and UI/UX decisions we made while building Raasta—and the exact technical rationale behind each.

---

## 1. The Strict 11-Digit Strategy: Dignity Without Invasive Credential Gating

The first instinct in government fintech is often: *"Ask for Aadhaar number, then send an OTP."*

We deliberately rejected that approach.

In rural India, citizens are rightfully terrified of OTP scams, fake KYC portals, and phishing attacks. Demanding an Aadhaar OTP before a farmer can even see why their payment is stuck creates immediate anxiety and causes an 80% drop-off.

Instead, PM-KISAN uses an official **11-digit Registration Number** (e.g. '98765432101').

We implemented strict UI/UX constraints around this:
* **Strict 11-Digit Guard:** The *“Check my PM-KISAN”* button remains visibly disabled with 'opacity-40 cursor-not-allowed' until exactly 11 numeric digits are typed.
* **Zero Partial Submissions:** Preventing incomplete queries eliminates confusing server errors or empty search states.
* **Public Docket Philosophy:** An 11-digit identifier treats the status as a public recovery docket—giving the citizen full diagnosis and guidance without demanding invasive personal credentials.

---

## 2. Deterministic Pre-Rendered Audio vs. Continuous Cloud TTS Calls

Many AI prototypes call a remote Generative Text-to-Speech API every single time a user clicks *“Listen”*.

In a production civic application, this is a fatal flaw:
* **The 3-Second Cloud Latency:** Hitting a cloud TTS endpoint in rural areas with spotty 2G/3G connectivity adds 2 to 4 seconds of silence. To an anxious farmer, silence feels like a broken system.
* **API Outages & Rate Limits:** If a cloud provider encounters rate limiting or downtime, the farmer gets no explanation.
* **Network Cost:** Streaming live audio chunks repeatedly consumes unnecessary mobile data.

**Our Product Engineering Solution:**
We pre-synthesized and bundled high-fidelity bilingual audio binaries for all official case states directly on the client across 8 Indian languages (*Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, Punjabi, English*). 

When a citizen taps *“🔊 Listen (Audio)”*, playback begins in **0 milliseconds** with zero network round-trip. If a dynamic custom statement is recorded, it seamlessly falls back to fast local synthesis. 

Reliability is not an afterthought; it is built into the audio pipeline.

---

## 3. No Chatbot Bubbles: Audio-First Structured Cards

The default reaction to modern LLMs is: *“Put a chat bubble in the bottom-right corner.”*

We banned conversational chatbots.

A farmer standing at a Common Service Center in rural Warangal or Gorakhpur does not want to type back-and-forth with a chatbot asking: *“Hello! How may I assist your query today?”*

They need three concrete answers in their mother tongue in under 10 seconds:
1. *What is wrong?*
2. *Whose turn is it (mine or the government's)?*
3. *What exact sentence do I say at the counter?*

Instead of an endless conversational scroll, Raasta delivers structured, high-contrast status dockets with stationary, anchored voice controls that never jump or reposition across language changes.

---

## 4. The Physical Counter Pass: Bridging Digital Screens to Physical Desks

The fatal flaw of modern civic technology is assuming the journey finishes on a smartphone screen.

It doesn’t.

If an e-KYC biometric failure or land-seeding discrepancy occurs, the citizen must physically walk to a CSC Kendra, Tehsil office, or bank branch.

Standing before an overworked operator, citizens struggle to recall technical error codes like *“NPCI mapper inactive”*. The operator asks *“What is the problem?”*, the citizen says *“My money didn’t come”*, and the operator turns them away without resolution.

We designed the **Physical Counter Pass**:
* **Verbatim Spoken Script:** A single, precise sentence the citizen reads aloud or plays from their phone (*“Please check my Aadhaar biometric seeding on the NPCI mapper”*).
* **Substantiated Document Checklist:** Only the 2 specific documents required for *this exact failure state*—eliminating the anxiety of carrying a giant folder of irrelevant papers.

The digital interface exists to make the physical human interaction succeed.

---

## 5. The Virtual Cursor & Time-Lapse Modals in Demo Mode

In software demos, clicking a button that instantly resolves a case in 50 milliseconds feels like a parlor trick.

Citizens and evaluators know government bureaucracies do not verify land records in 50 milliseconds.

When orchestrating the autonomous recovery demonstration:
* **The Translucent Virtual Pointer:** Glides smoothly across the screen with visible hover states and tactile click ripples, showing exactly what action is being triggered.
* **Realistic Government Time-Lapse:** Between steps, Raasta shows interstitial time-lapse modals (*“⏳ 3 Days Later: Biometric log synchronized with State Nodal Directorate”*).

This builds authentic trust: Raasta does not pretend government processing is instantaneous. It proves that Raasta maintains memory across the actual days the process takes.

---

## 6. Progressive Grapheme Morphing vs. Distracting Header Motion

During the initial application reveal, the wordmark (**'Raasta · What happens next'**) writes itself out letter-by-letter across 8 Indic scripts (*Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, Punjabi, English*). 

Rather than standard block-blur crossfades, we used 'Intl.Segmenter' grapheme slicing so complex Indic conjuncts (like 'రా', 'స్తా', 'स्ता') rewrite progressively from left to right.

Critically, once the brand docks in the top header, **all progressive animations stop**:
* **In the center:** It celebrates the linguistic breadth of Indian citizens.
* **In the settled header:** It remains completely calm and static so it never steals focus from the recovery docket.

---

## Good Engineering is Removing Anxiety

At its core, Raasta’s UI/UX is not about visual decoration for design competitions.

It is about civic dignity.

When a citizen opens Raasta, they should feel that the software is calm, certain, and respectful of their intelligence and their time.

**Not a portal to get lost in. A clear path forward.**`
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
