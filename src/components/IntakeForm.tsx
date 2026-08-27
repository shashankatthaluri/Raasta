"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Phase 7 — "Tell us what happened."
 * Free text → structured intent (server-side) → deterministic case engine.
 * The only AI capability in the MVP.
 */
export function IntakeForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = message.trim();
    if (busy || !text) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const json = (await res.json()) as { case?: { id: string }; error?: string };
      if (!res.ok || !json.case) {
        setError(json.error ?? "Could not open your case.");
        setBusy(false);
        return;
      }
      router.push(`/case/${json.case.id}`);
    } catch {
      setBusy(false);
      setError("Could not open your case.");
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-stone-200 bg-white p-5">
      <label htmlFor="intake" className="block font-medium text-stone-900">
        Tell us what happened
      </label>
      <p className="mt-0.5 text-sm text-stone-500">
        In your own words — English or हिंदी. We&apos;ll figure out what it means; you won&apos;t
        need to explain it again.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id="intake"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. I used to receive the money every time, but this month I didn't get anything."
          className="flex-1 rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-stone-900"
        />
        <button
          type="submit"
          disabled={busy || !message.trim()}
          className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-40"
        >
          {busy ? "Opening…" : "Open my case"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </form>
  );
}
