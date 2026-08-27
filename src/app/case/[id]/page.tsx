"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LanguageToggle, type Lang } from "@/components/LanguageToggle";
import type { CaseDTO } from "@/server/dto";

/**
 * The one screen that matters — PRODUCT_CONTRACT.md §14, STATE_TO_EXPERIENCE.md.
 * Answers four questions immediately: What happened? · Why? · Who acts next? ·
 * What do I need to do? · What happens next?
 */

const COLOR_DOT: Record<string, string> = {
  green: "bg-green-600",
  amber: "bg-amber-600",
  red: "bg-red-600",
  neutral: "bg-stone-400",
};

const SOURCE_BADGE: Record<string, { label: string; cls: string }> = {
  OFFICIAL: { label: "Official", cls: "border-green-200 bg-green-50 text-green-800" },
  CITIZEN_REPORTED: { label: "You told us", cls: "border-stone-200 bg-stone-100 text-stone-700" },
  SYSTEM_DERIVED: { label: "System", cls: "border-blue-200 bg-blue-50 text-blue-800" },
  AI_INTERPRETED: { label: "AI explanation", cls: "border-violet-200 bg-violet-50 text-violet-800" },
};

const REASSURANCE: Record<Lang, string[]> = {
  en: ["We're waiting for the next update.", "We'll tell you when something changes."],
  hi: ["हम अगले अपडेट की प्रतीक्षा कर रहे हैं।", "कुछ बदलेगा तो हम आपको बता देंगे।"],
};

const CONFIRMATION_NOTE: Record<Lang, string> = {
  en: "Official confirmation can take some time.",
  hi: "आधिकारिक पुष्टि में कुछ समय लग सकता है।",
};

function timeLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  if (d.toDateString() === now.toDateString()) return `Today, ${time}`;
  const date = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${date}, ${time}`;
}

export default function CasePage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CaseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [auto, setAuto] = useState(false);
  const [busy, setBusy] = useState(false);
  const [changed, setChanged] = useState<{ en: string; hi: string } | null>(null);
  const prevState = useRef<string | null>(null);
  const firstLoad = useRef(true);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/cases/${id}`);
      if (!res.ok) {
        setError("This case could not be found.");
        return;
      }
      const json = (await res.json()) as { case: CaseDTO };
      if (!mounted.current) return;
      setData(json.case);
      // "Something changed" — the contract's demo moment, surfaced as a banner.
      if (!firstLoad.current && prevState.current && prevState.current !== json.case.currentState) {
        setChanged(json.case.title);
      }
      prevState.current = json.case.currentState;
      firstLoad.current = false;
    } catch {
      if (mounted.current) setError("Something went wrong while loading this case.");
    }
  }, [id]);

  useEffect(() => {
    mounted.current = true;
    setLang((localStorage.getItem("raasta_lang") as Lang) ?? "en");
    load();
    const t = setInterval(load, 2000);
    return () => {
      mounted.current = false;
      clearInterval(t);
    };
  }, [load]);

  const simulate = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      await fetch(`/api/cases/${id}/simulate-signal`, { method: "POST" });
      await load();
    } finally {
      setBusy(false);
    }
  }, [id, load, busy]);

  async function doAction(actionId: string) {
    if (busy) return;
    setBusy(true);
    try {
      await fetch(`/api/cases/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => {
      if (data?.demo?.nextSignalLabel) void simulate();
    }, 3000);
    return () => clearInterval(t);
  }, [auto, data?.demo?.nextSignalLabel, simulate]);

  useEffect(() => {
    if (!changed) return;
    const t = setTimeout(() => setChanged(null), 4500);
    return () => clearTimeout(t);
  }, [changed]);

  function setLanguage(l: Lang) {
    setLang(l);
    localStorage.setItem("raasta_lang", l);
  }

  const t = (o: { en: string; hi: string }) => o[lang];

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-stone-900">{error}</h1>
        <Link href="/" className="mt-4 inline-block font-medium text-amber-700 hover:underline">
          Start a new case
        </Link>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20">
        <p className="text-stone-500">Opening your case…</p>
      </main>
    );
  }

  const resolved = data.stateCategory === "resolved";

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      {changed && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-900">
          {lang === "hi" ? "कुछ बदला —" : "Something changed —"} {changed[lang]}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-stone-500">Raasta for PM-KISAN</p>
          {data.isDemo && (
            <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
              Demo case
            </span>
          )}
        </div>
        <LanguageToggle lang={lang} onChange={setLanguage} />
      </div>
      <p className="mt-1.5 font-mono text-xs text-stone-400">Case {data.id}</p>

      {/* What happened? */}
      <section className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
          {lang === "hi" ? "क्या हुआ?" : "What happened?"}
        </p>
        <h1 className={`mt-2 text-3xl font-semibold tracking-tight ${resolved ? "status-green" : ""}`}>
          {t(data.title)}
        </h1>
      </section>

      {/* Why? */}
      <section className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
          {lang === "hi" ? "क्यों?" : "Why?"}
        </p>
        <p className="mt-1.5 text-base leading-relaxed text-stone-700">{t(data.why)}</p>
      </section>

      {/* Who has the next action? */}
      <section className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
          {lang === "hi" ? "अगला कदम किसका है?" : "Who has the next action?"}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${COLOR_DOT[data.color] ?? "bg-stone-400"}`} />
          <p className="text-base font-medium text-stone-900">{t(data.nextActorLabel)}</p>
        </div>
      </section>

      {/* What do I need to do? */}
      <section className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
          {lang === "hi" ? "मुझे क्या करना है?" : "What do I need to do?"}
        </p>
        <div className="mt-2">
          {data.yourAction.required && data.yourAction.action ? (
            <ActionCard data={data} lang={lang} busy={busy} onDone={doAction} />
          ) : data.yourAction.awaitingConfirmation ? (
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="font-medium text-stone-800">{t(data.yourAction.text)}</p>
              <p className="mt-1 text-sm text-stone-600">{CONFIRMATION_NOTE[lang]}</p>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
              <p className="text-lg font-medium text-amber-900">
                {lang === "hi" ? "आपको अभी कुछ नहीं करना है।" : "You don't need to do anything right now."}
              </p>
              {REASSURANCE[lang].map((line) => (
                <p key={line} className="mt-0.5 text-sm text-stone-700">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* What happens next? */}
      {data.chain.en.length > 0 && (
        <section className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            {lang === "hi" ? "आगे क्या होगा?" : "What happens next?"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {data.chain[lang].map((step, i) => (
              <span key={`${step}-${i}`} className="flex items-center gap-2">
                <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700">
                  {step}
                </span>
                {i < data.chain.en.length - 1 && <span className="text-stone-400">↓</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {data.lastVerifiedAt && (
        <p className="mt-6 text-sm text-stone-500">
          {lang === "hi" ? "अंतिम जाँच:" : "Last verified:"} {timeLabel(data.lastVerifiedAt)}
        </p>
      )}

      {/* Resolution */}
      {resolved && (
        <section className="mt-8 rounded-xl border border-green-200 bg-green-50/70 p-6">
          {data.credited.amount !== null && (
            <p className="text-2xl font-semibold text-green-900">
              ₹{data.credited.amount.toLocaleString("en-IN")}{" "}
              {lang === "hi" ? "आपके खाते में जमा कर दिए गए हैं" : "was credited to your account"}
            </p>
          )}
          {data.resolution && <p className="mt-1 text-sm text-stone-700">{data.resolution.note}</p>}
          <p className="mt-2 text-sm font-medium text-green-800">
            {lang === "hi" ? "आपका मामला बंद हो गया है।" : "Your case is closed."}
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-green-800 px-4 py-2 text-sm font-medium text-white hover:bg-green-900"
          >
            {lang === "hi" ? "नया मामला शुरू करें" : "Start another case"}
          </Link>
        </section>
      )}

      {/* Demo controls — honest simulation surface */}
      {data.isDemo && data.demo && !resolved && (
        <div className="mt-8 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-amber-900">
                {lang === "hi" ? "डेमो नियंत्रण — अनुकरणित सरकारी संकेत" : "Demo controls — simulated government signals"}
              </p>
              <p className="mt-0.5 text-stone-600">
                {data.demo.journeyName} · {lang === "hi" ? "चरण" : "step"} {data.demo.step}/{data.demo.totalSteps}
              </p>
              {data.demo.nextSignalLabel && (
                <p className="text-stone-500">
                  {lang === "hi" ? "अगला:" : "Next:"} {data.demo.nextSignalLabel}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-stone-600">
                <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
                {lang === "hi" ? "ऑटो-एडवांस (3 सेकंड)" : "Auto-advance (3s)"}
              </label>
              <button
                onClick={() => void simulate()}
                disabled={!data.demo?.nextSignalLabel || busy}
                className="rounded-lg border border-amber-600 px-4 py-2 font-medium text-amber-800 transition hover:bg-amber-100 disabled:opacity-40"
              >
                {lang === "hi" ? "अगला आधिकारिक संकेत अनुकरणित करें" : "Simulate next official signal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline — "What's been happening" */}
      <section className="mt-8">
        <details className="group rounded-xl border border-stone-200 bg-white">
          <summary className="cursor-pointer list-none px-5 py-4 font-medium text-stone-900">
            {lang === "hi" ? "अब तक क्या हुआ?" : "What's been happening"}
            <span className="float-right text-stone-400 transition group-open:rotate-90">›</span>
          </summary>
          <ol className="border-t border-stone-100 px-5 py-4">
            {[...data.timeline].reverse().map((e) => (
              <li key={e.id} className="flex gap-3 py-1.5 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-300" />
                <div>
                  <p className="text-stone-800">{e.humanLabel}</p>
                  <p className="text-xs text-stone-400">{timeLabel(e.createdAt)}</p>
                </div>
              </li>
            ))}
          </ol>
        </details>
      </section>

      {/* Details — progressive disclosure L4, with provenance badges */}
      <section className="mt-3">
        <details className="group rounded-xl border border-stone-200 bg-white">
          <summary className="cursor-pointer list-none px-5 py-4 font-medium text-stone-900">
            {lang === "hi" ? "विवरण" : "Details"}
            <span className="float-right text-stone-400 transition group-open:rotate-90">›</span>
          </summary>
          <div className="space-y-2 border-t border-stone-100 px-5 py-4">
            {data.evidence.length === 0 && (
              <p className="text-sm text-stone-500">No verified details yet.</p>
            )}
            {data.evidence.map((e) => {
              const badge = SOURCE_BADGE[e.sourceType] ?? SOURCE_BADGE.SYSTEM_DERIVED;
              return (
                <div key={e.id} className="rounded-lg border border-stone-100 bg-stone-50/60 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${badge.cls}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs text-stone-400">{timeLabel(e.verifiedAt)}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-stone-800">{e.value}</p>
                  <p className="mt-0.5 text-xs text-stone-400">{e.source}</p>
                </div>
              );
            })}
          </div>
        </details>
      </section>

      <p className="mt-10 text-center text-xs text-stone-400">
        {lang === "hi"
          ? "नियम वास्तविकता तय करते हैं। AI वास्तविकता समझाता है।"
          : "Rules determine reality. AI explains reality."}
      </p>
    </main>
  );
}

function ActionCard({
  data,
  lang,
  busy,
  onDone,
}: {
  data: CaseDTO;
  lang: Lang;
  busy: boolean;
  onDone: (actionId: string) => void;
}) {
  const action = data.yourAction.action;
  if (!action) return null;
  const t = (o: { en: string; hi: string }) => o[lang];

  return (
    <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
      <p className="text-lg font-medium text-red-900">{t(action.title)}</p>
      <p className="mt-1 text-sm leading-relaxed text-stone-700">{t(action.why)}</p>

      {action.card && (
        <div className="mt-3 rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-sm font-semibold text-stone-900">{action.card.heading}</p>
          <p className="mt-1 text-sm italic text-stone-700">“{action.card.statement}”</p>
          <ul className="mt-2 list-disc pl-5 text-xs text-stone-500">
            {action.card.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => onDone(action.id)}
          disabled={busy}
          className="rounded-lg bg-red-700 px-5 py-2.5 font-medium text-white transition hover:bg-red-800 disabled:opacity-50"
        >
          {busy ? "…" : t(action.title)}
        </button>
        {action.href && (
          <a
            href={action.href}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-stone-600 underline-offset-2 hover:underline"
          >
            {lang === "hi" ? "आधिकारिक PM-KISAN पोर्टल खोलें ↗" : "Open the official PM-KISAN portal ↗"}
          </a>
        )}
      </div>
      <p className="mt-3 text-sm text-stone-600">{t(action.after)}</p>
    </div>
  );
}
