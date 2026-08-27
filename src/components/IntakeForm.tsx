"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Lang } from "@/lib/i18n";

/**
 * Phase 7 — "Tell us what happened." (secondary path)
 * Free text → structured intent (server-side) → deterministic case engine.
 * The only AI capability in the MVP.
 */
export function IntakeForm({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t =
    lang === "hi"
      ? {
          label: "हमें बताएँ क्या हुआ",
          hint: "अपने शब्दों में — हिंदी या English। हम समझ लेंगे; आपको दोबारा समझाना नहीं पड़ेगा।",
          placeholder: "जैसे — पहले पैसे हर बार मिलते थे, इस बार नहीं आए।",
          submit: "मेरा केस खोलें",
          busy: "खुल रहा है…",
          error: "आपका केस नहीं खुल सका।",
        }
      : {
          label: "Tell us what happened",
          hint: "In your own words — English or हिंदी. We'll figure out what it means; you won't need to explain it again.",
          placeholder: "e.g. I used to receive the money every time, but this month I didn't get anything.",
          submit: "Open my case",
          busy: "Opening…",
          error: "Could not open your case.",
        };

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
        setError(json.error ?? t.error);
        setBusy(false);
        return;
      }
      router.push(`/case/${json.case.id}`);
    } catch {
      setBusy(false);
      setError(t.error);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-stone-200 bg-white p-5">
      <label htmlFor="intake" className="block font-medium text-stone-900">
        {t.label}
      </label>
      <p className="mt-0.5 text-sm text-stone-500">{t.hint}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id="intake"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.placeholder}
          className="flex-1 rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-stone-900"
        />
        <button
          type="submit"
          disabled={busy || !message.trim()}
          className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-40"
        >
          {busy ? t.busy : t.submit}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </form>
  );
}
