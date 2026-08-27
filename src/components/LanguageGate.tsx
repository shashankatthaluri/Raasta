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
];

const PROMPT_MS = 4200; // slow enough to read, calm

export function LanguageGate({ onSelect }: { onSelect: (lang: Lang) => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % PROMPTS.length), PROMPT_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col items-center justify-center px-6 py-14 text-center">
      <p className="text-sm font-medium tracking-wide text-stone-400">
        Raasta <span className="mx-1 text-stone-300">·</span> रास्ता
      </p>

      {/* Rotating prompt — grid stacking keeps natural height; pointer-events-none
          so it can never block interaction with the buttons below. */}
      <div
        aria-label="Choose your language · अपनी भाषा चुनें"
        className="pointer-events-none mt-10 grid place-items-center"
      >
        {PROMPTS.map((p, i) => (
          <p
            key={p.code}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 text-2xl font-semibold tracking-tight text-stone-900 transition-opacity duration-700 ease-out sm:text-3xl ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {p.text}
          </p>
        ))}
      </div>

      {/* Language options — always visible, always clickable, immediately. */}
      <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
        {SUPPORTED_LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => onSelect(l.code)}
            className="rounded-xl border border-stone-300 bg-white px-6 py-4 text-lg font-medium text-stone-900 transition hover:border-stone-900 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
          >
            {l.nativeName}
          </button>
        ))}
      </div>
    </main>
  );
}
