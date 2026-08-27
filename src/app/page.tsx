import { CreateCase } from "@/components/CreateCase";
import { IntakeForm } from "@/components/IntakeForm";

const JOURNEY_CARDS = [
  {
    journeyId: "J1_FARMER_EKYC",
    label: "J1 — Farmer action",
    description: "Payment missing → e-KYC required → one action → verified → credited.",
  },
  {
    journeyId: "J2_GOVT_VERIFICATION",
    label: "J2 — Government action",
    description: "State verification → the state has the next action → credited.",
  },
  {
    journeyId: "J3_PAYMENT_FAILURE",
    label: "J3 — Payment failure",
    description: "Failed → reprocessing → credited. The farmer does nothing.",
  },
  {
    journeyId: "J4_NO_ACTION",
    label: "J4 — No action",
    description: "Processing → credited. Not every problem requires a task.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <p className="text-sm font-medium text-stone-500">
        Raasta for PM-KISAN · Demo
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">
        What happened?
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-stone-600">
        Tell us what happened. We&apos;ll show you what it means, who acts next,
        and what you need to do.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <CreateCase
          journeyId="J3_PAYMENT_FAILURE"
          problemType="PAYMENT_MISSING"
          label="My payment didn&apos;t arrive"
          emoji="💰"
        />
        <CreateCase
          journeyId="J2_GOVT_VERIFICATION"
          problemType="PAYMENT_STOPPED"
          label="My payment stopped"
          emoji="⏸️"
        />
        <CreateCase
          journeyId="J1_FARMER_EKYC"
          problemType="OTHER"
          label="Something else"
          emoji="❓"
        />
      </div>

      <div className="mt-6">
        <IntakeForm />
      </div>

      <div className="mt-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-500">
        🎙️ Voice intake lands in the next build — for now, tell us in writing above.
      </div>

      <hr className="my-10 border-stone-200" />
      <h2 className="text-lg font-semibold text-stone-900">Try a demo scenario</h2>
      <p className="mt-1 text-sm text-stone-600">
        Four journeys, driven by simulated official signals.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {JOURNEY_CARDS.map((j) => (
          <CreateCase
            key={j.journeyId}
            variant="scenario"
            journeyId={j.journeyId}
            label={j.label}
            description={j.description}
          />
        ))}
      </div>

      <p className="mt-10 text-xs leading-relaxed text-stone-400">
        Demo — all government signals are simulated, based on publicly documented
        PM-KISAN workflows. No live individual government data is accessed.
        Rules determine reality. AI explains reality.
      </p>
    </main>
  );
}
