"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateCase } from "@/components/CreateCase";
import { IntakeForm } from "@/components/IntakeForm";
import { LanguageGate } from "@/components/LanguageGate";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { setStoredLanguage, type Lang } from "@/lib/i18n";

/**
 * Entry — client side. The server has already decided initialLang from the
 * cookie (see app/page.tsx): null → fresh visitor → LANGUAGE GATE; otherwise
 * the landing renders directly in the stored language (no gate flash, no
 * auto-jump — the server never paints the gate for returning visitors).
 *
 * Landing is check-first: "Let's check your PM-KISAN". The citizen never has
 * to diagnose the problem; free-text intake is the secondary path.
 *
 * Data boundary: the check uses the existing SIMULATED government adapter.
 * No live KYS integration, no live beneficiary data.
 */

const DEMO_REG_NUMBER = "10203040506"; // 11 digits, mirroring the official KYS format

const QUICK_OPTIONS: ReadonlyArray<{
  journeyId: string;
  problemType: string;
  label: { en: string; hi: string };
  emoji: string;
}> = [
  {
    journeyId: "J3_PAYMENT_FAILURE",
    problemType: "PAYMENT_MISSING",
    label: { en: "My payment didn't arrive", hi: "मेरा भुगतान नहीं आया" },
    emoji: "💰",
  },
  {
    journeyId: "J2_GOVT_VERIFICATION",
    problemType: "PAYMENT_STOPPED",
    label: { en: "My payment stopped", hi: "मेरा भुगतान रुक गया" },
    emoji: "⏸️",
  },
  {
    journeyId: "J1_FARMER_EKYC",
    problemType: "OTHER",
    label: { en: "Something else", hi: "कुछ और" },
    emoji: "❓",
  },
];

const JOURNEY_CARDS: ReadonlyArray<{
  journeyId: string;
  label: { en: string; hi: string };
  description: { en: string; hi: string };
}> = [
  {
    journeyId: "J1_FARMER_EKYC",
    label: { en: "J1 — Farmer action", hi: "J1 — किसान कार्रवाई" },
    description: {
      en: "Payment missing → e-KYC required → one action → verified → credited.",
      hi: "भुगतान नहीं आया → ई-केवाईसी आवश्यक → एक कार्रवाई → सत्यापित → जमा।",
    },
  },
  {
    journeyId: "J2_GOVT_VERIFICATION",
    label: { en: "J2 — Government action", hi: "J2 — सरकारी कार्रवाई" },
    description: {
      en: "State verification → the state has the next action → credited.",
      hi: "राज्य सत्यापन → अगली कार्रवाई राज्य की → जमा।",
    },
  },
  {
    journeyId: "J3_PAYMENT_FAILURE",
    label: { en: "J3 — Payment failure", hi: "J3 — भुगतान विफलता" },
    description: {
      en: "Failed → reprocessing → credited. The farmer does nothing.",
      hi: "विफल → दोबारा प्रोसेस → जमा। किसान को कुछ नहीं करना।",
    },
  },
  {
    journeyId: "J4_NO_ACTION",
    label: { en: "J4 — No action", hi: "J4 — कोई कार्रवाई नहीं" },
    description: {
      en: "Processing → credited. Not every problem requires a task.",
      hi: "प्रोसेस → जमा। हर समस्या के लिए कार्रवाई ज़रूरी नहीं।",
    },
  },
];

const COPY = {
  en: {
    header: "Raasta for PM-KISAN · Demo",
    checkTitle: "Let's check your PM-KISAN",
    checkSub: "Enter your PM-KISAN registration number. We'll check what changed, explain what it means, and guide you through the next step.",
    regLabel: "PM-KISAN registration number",
    regPlaceholder: "11-digit registration number",
    demoHint: "Demo — simulated government signals",
    checkButton: "Check my PM-KISAN",
    checking: "Checking…",
    checkError: "Could not check your PM-KISAN. Please try again.",
    or: "Or tell us what happened",
    orSub: "If you already know something is wrong, describe it in your own words.",
    scenarios: "Try a demo scenario",
    scenariosSub: "Four journeys, driven by simulated official signals.",
    boundary: "Demo — all government signals are simulated, based on publicly documented PM-KISAN workflows. No live individual government data is accessed.",
    principle: "Rules determine reality. AI explains reality.",
  },
  hi: {
    header: "PM-KISAN के लिए रास्ता · डेमो",
    checkTitle: "आइए आपका PM-KISAN देखें",
    checkSub: "अपना PM-KISAN पंजीकरण नंबर दर्ज करें। हम देखेंगे कि क्या बदला है, समझाएँगे कि इसका क्या मतलब है, और अगले कदम में आपका मार्गदर्शन करेंगे।",
    regLabel: "PM-KISAN पंजीकरण नंबर",
    regPlaceholder: "11 अंकों का पंजीकरण नंबर",
    demoHint: "डेमो — अनुकरणित सरकारी संकेत",
    checkButton: "मेरा PM-KISAN जाँचें",
    checking: "जाँच हो रही है…",
    checkError: "आपका PM-KISAN जाँचा नहीं जा सका। कृपया फिर कोशिश करें।",
    or: "या हमें बताएँ क्या हुआ",
    orSub: "अगर आपको पहले से पता है कि कुछ गड़बड़ है, तो अपने शब्दों में बताएँ।",
    scenarios: "डेमो परिदृश्य आज़माएँ",
    scenariosSub: "चार परिदृश्य, अनुकरणित आधिकारिक संकेतों द्वारा संचालित।",
    boundary: "डेमो — सभी सरकारी संकेत अनुकरणित हैं, सार्वजनिक रूप से प्रलेखित PM-KISAN कार्यप्रवाहों पर आधारित। किसी भी व्यक्ति का लाइव सरकारी डेटा एक्सेस नहीं किया जाता।",
    principle: "नियम वास्तविकता तय करते हैं। एआई समझाती है।",
  },
} as const;

export function HomeClient({ initialLang }: { initialLang: Lang | null }) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang | null>(initialLang);
  const [regNumber, setRegNumber] = useState(DEMO_REG_NUMBER);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fresh visitor — the language gate comes BEFORE anything else, and stays
  // until the visitor actually chooses. It never auto-advances.
  if (lang === null) {
    return (
      <LanguageGate
        onSelect={(l) => {
          setStoredLanguage(l);
          setLang(l);
        }}
      />
    );
  }

  const t = COPY[lang];

  async function check() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      // Demo check: the simulated adapter produces the case. No live KYS.
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journeyId: "J3_PAYMENT_FAILURE" }),
      });
      const json = (await res.json()) as { case?: { id: string }; error?: string };
      if (!res.ok || !json.case) {
        setError(json.error ?? t.checkError);
        setBusy(false);
        return;
      }
      router.push(`/case/${json.case.id}`);
    } catch {
      setBusy(false);
      setError(t.checkError);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-stone-500">{t.header}</p>
        <LanguageSwitcher
          lang={lang}
          onChange={(l) => {
            setStoredLanguage(l);
            setLang(l);
          }}
        />
      </div>

      {/* Primary — check first, the citizen never diagnoses */}
      <section className="mt-12">
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900">{t.checkTitle}</h1>
        <p className="mt-3 text-lg leading-relaxed text-stone-600">{t.checkSub}</p>

        <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5">
          <label htmlFor="reg-number" className="block font-medium text-stone-900">
            {t.regLabel}
          </label>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              id="reg-number"
              inputMode="numeric"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder={t.regPlaceholder}
              className="flex-1 rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-stone-900"
            />
            <button
              onClick={check}
              disabled={busy || regNumber.length !== 11}
              className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-40"
            >
              {busy ? t.checking : t.checkButton}
            </button>
          </div>
          <p className="mt-2 text-xs text-stone-400">{t.demoHint}</p>
          {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        </div>
      </section>

      {/* Secondary — natural-language intake, never the primary path */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-stone-900">{t.or}</h2>
        <p className="mt-1 text-sm text-stone-600">{t.orSub}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {QUICK_OPTIONS.map((o) => (
            <CreateCase
              key={o.journeyId}
              journeyId={o.journeyId}
              problemType={o.problemType}
              label={o.label[lang]}
              emoji={o.emoji}
              lang={lang}
            />
          ))}
        </div>
        <div className="mt-4">
          <IntakeForm lang={lang} />
        </div>
      </section>

      {/* Demo scenarios */}
      <hr className="my-10 border-stone-200" />
      <h2 className="text-lg font-semibold text-stone-900">{t.scenarios}</h2>
      <p className="mt-1 text-sm text-stone-600">{t.scenariosSub}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {JOURNEY_CARDS.map((j) => (
          <CreateCase
            key={j.journeyId}
            variant="scenario"
            journeyId={j.journeyId}
            label={j.label[lang]}
            description={j.description[lang]}
            lang={lang}
          />
        ))}
      </div>

      {/* Data boundary — kept explicit */}
      <p className="mt-10 text-xs leading-relaxed text-stone-400">
        {t.boundary} {t.principle}
      </p>
    </main>
  );
}
