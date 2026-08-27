"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Lang } from "@/lib/i18n";

interface Props {
  journeyId: string;
  problemType?: string;
  label: string;
  description?: string;
  emoji?: string;
  variant?: "option" | "scenario";
  lang?: Lang;
}

export function CreateCase({
  journeyId,
  problemType,
  label,
  description,
  emoji,
  variant = "option",
  lang = "en",
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const busyText = lang === "hi" ? "डेमो केस खुल रहा है…" : "Opening demo case…";

  async function create() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journeyId, problemType }),
      });
      const json = (await res.json()) as { case: { id: string } };
      router.push(`/case/${json.case.id}`);
    } catch {
      setBusy(false);
    }
  }

  if (variant === "scenario") {
    return (
      <button
        onClick={create}
        disabled={busy}
        className="rounded-xl border border-stone-200 bg-white p-4 text-left transition hover:border-stone-400 disabled:opacity-50"
      >
        <p className="font-medium text-stone-900">{label}</p>
        {description && <p className="mt-1 text-sm text-stone-600">{description}</p>}
        {busy && <p className="mt-2 text-xs font-medium text-amber-700">{busyText}</p>}
      </button>
    );
  }

  return (
    <button
      onClick={create}
      disabled={busy}
      className="rounded-xl border border-stone-200 bg-white p-5 text-left transition hover:border-stone-900 disabled:opacity-50"
    >
      <p className="text-2xl">{emoji}</p>
      <p className="mt-2 font-medium text-stone-900">{label}</p>
      {description && <p className="mt-1 text-sm text-stone-600">{description}</p>}
      {busy && <p className="mt-2 text-xs font-medium text-amber-700">{busyText}</p>}
    </button>
  );
}
