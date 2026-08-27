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
        className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:border-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
      >
        <span>{nativeName(lang)}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Choose your language"
          className="absolute right-0 z-20 mt-1.5 w-48 rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg"
        >
          <p className="px-2.5 py-1.5 text-xs font-medium text-stone-400">
            {lang === "hi" ? "भाषा चुनें" : "Choose your language"}
          </p>
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === lang}
              onClick={() => {
                onChange(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm font-medium transition ${
                l.code === lang
                  ? "bg-stone-900 text-white"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              {l.nativeName}
              {l.code === lang && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2.5 7.5 5.5 10.5 11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
