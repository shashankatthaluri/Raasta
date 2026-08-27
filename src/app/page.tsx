export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <p className="mb-3 text-sm font-medium text-stone-500">Raasta for PM-KISAN · Demo case</p>
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
        Government complexity.
        <br />
        One clear next step.
      </h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-stone-600">
        A citizen case system that turns complex government process states into one clear
        next step — or tells the citizen when no action is required.
      </p>
      <div className="mt-10 rounded-xl border border-stone-200 bg-white p-5 text-sm text-stone-600">
        <p className="font-medium text-stone-900">Build status — Day 2/4</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Phase 1 — Product contract: locked (docs/PRODUCT_CONTRACT.md)</li>
          <li>Phase 2 — State engine: implemented, contract-tested (npm test)</li>
          <li>Phase 3 — Schema: written, not migrated</li>
          <li>Phase 4–8: adapter · API · UI · AI · polish — next</li>
        </ul>
      </div>
      <p className="mt-8 text-sm text-stone-400">
        Rules determine reality. AI explains reality. Never make the citizen understand the
        system to use the service.
      </p>
    </main>
  );
}
