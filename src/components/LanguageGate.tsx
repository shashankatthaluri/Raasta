"use client";

import { useEffect, useState } from "react";
import { SUPPORTED_LANGUAGES, type Lang } from "@/lib/i18n";

/**
 * The accessibility gate — the FIRST screen a fresh visitor sees.
 *
 * Rules (locked):
 * - No onboarding, no marketing, no "What happened?", no registration, no chatbot.
 * - The only task is choosing a language.
 * - Prompt rotates ONLY through languages the build actually translates.
 * - Subtle crossfade: calm, slow enough to read. No typewriter, no bounce,
 *   no carousel, no sound.
 * - The animation never blocks interaction — options are visible and clickable
 *   immediately.
 * - Options use native language names (हिंदी / English). Never "HI"/"EN", never flags.
 */

const PROMPTS: ReadonlyArray<{ code: Lang; text: string }> = [
  { code: "en", text: "Choose your language" },
  { code: "hi", text: "अपनी भाषा चुनें" },
  { code: "te", text: "మీ భాషను ఎంచుకోండి" },
  { code: "ta", text: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்" },
  { code: "kn", text: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
  { code: "mr", text: "तुमची भाषा निवडा" },
  { code: "bn", text: "আপনার ভাষা নির্বাচন করুন" },
  { code: "pa", text: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ" },
];

const PROMPT_MS = 3800; // slow enough to read, calm

export function LanguageGate({ onSelect }: { onSelect: (lang: Lang) => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % PROMPTS.length), PROMPT_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col items-center justify-center px-6 py-14 text-center">
      {/* Official Top Seal Pill */}
      <div className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white px-3.5 py-1 text-xs font-semibold tracking-wide text-stone-600 shadow-2xs">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        <span>Raasta · रास्ता</span>
      </div>

      {/* Rotating prompt with calm breathing animation */}
      <div
        aria-label="Choose your language"
        className="pointer-events-none mt-8 grid place-items-center"
      >
        {PROMPTS.map((p, i) => (
          <p
            key={p.code}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 text-3xl font-semibold tracking-tight text-stone-900 transition-opacity duration-700 ease-out sm:text-4xl leading-normal py-1 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {p.text}
          </p>
        ))}
      </div>

      {/* Language selection cards — Apple Wallet / Pass style */}
      <div className="mt-10 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        {SUPPORTED_LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => onSelect(l.code)}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-900 hover:shadow-md active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
          >
            <span className="text-xl font-bold tracking-tight text-stone-900 transition group-hover:text-stone-950 sm:text-2xl leading-normal py-0.5">
              {l.nativeName}
            </span>
            <span className="mt-1 text-[11px] font-medium text-stone-400">
              {l.sub}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-8 text-xs text-stone-400">
        Public Recovery Infrastructure for PM-KISAN
      </p>
    </main>
  );
}
