"use client";

import { useEffect, useRef, useState } from "react";
import { nativeName, SUPPORTED_LANGUAGES, type Lang } from "@/lib/i18n";

/**
 * Persistent in-product language switcher.
 * - Current language is shown in its own native name (हिंदी ▾ / English ▾).
 * - Menu header is in the ACTIVE language; options always use native names.
 * - Never hidden in a settings menu — always one click away.
 * - Persistence is the caller's job (setStoredLanguage), so the gate and the
 *   in-product switch share one policy.
 */
export function LanguageSwitcher({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedOptionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);

    // Auto-scroll dropdown to selected option
    requestAnimationFrame(() => {
      if (selectedOptionRef.current) {
        selectedOptionRef.current.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    });

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex min-w-[96px] items-center justify-between gap-2 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs transition-all duration-200 hover:border-stone-400 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
      >
        <span className="transition-opacity duration-200 ease-out">{nativeName(lang)}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className={`text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Choose your language"
          className="absolute right-0 z-40 mt-1.5 w-56 max-h-[300px] overflow-y-auto rounded-2xl border border-stone-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md"
        >
          <p className="px-2.5 py-1.5 text-xs font-semibold text-stone-400">
            {
              {
                en: "Choose language",
                hi: "भाषा चुनें",
                te: "భాషను ఎంచుకోండి",
                ta: "மொழியைத் தேர்வு செய்க",
                kn: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
                mr: "भाषा निवडा",
                bn: "ভাষা নির্বাচন করুন",
                pa: "ਭਾਸ਼ਾ ਚੁਣੋ",
              }[lang] ?? "Choose language"
            }
          </p>
          {SUPPORTED_LANGUAGES.map((l) => {
            const isSelected = l.code === lang;
            return (
              <button
                key={l.code}
                ref={isSelected ? selectedOptionRef : undefined}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all duration-150 active:scale-[0.98] ${
                  isSelected
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-tight leading-normal py-0.5">{l.nativeName}</span>
                  <span className={`text-[10px] ${isSelected ? "text-stone-300" : "text-stone-400"}`}>
                    {l.englishName}
                  </span>
                </div>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7.5 5.5 10.5 11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
