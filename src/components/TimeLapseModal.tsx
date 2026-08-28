"use client";

import React from "react";
import type { Lang } from "@/lib/i18n";

interface TimeLapseModalProps {
  active: boolean;
  daysText: Record<Lang, string> | string;
  title: Record<Lang, string> | string;
  description: Record<Lang, string> | string;
  lang: Lang;
}

export function TimeLapseModal({ active, daysText, title, description, lang }: TimeLapseModalProps) {
  if (!active) return null;

  const t = (val: Record<Lang, string> | string) => {
    if (typeof val === "string") return val;
    return val[lang] ?? val.en ?? "";
  };

  // Apple-style: no page blur, no dark overlay. A subtle floating pill banner
  // anchored near the bottom — like time-skip captions in documentaries.
  return (
    <div className="pointer-events-none fixed bottom-8 inset-x-0 z-[150] flex items-end justify-center px-4 animate-in slide-in-from-bottom-2 fade-in duration-500">
      <div className="flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-white/92 px-5 py-3.5 shadow-lg shadow-stone-900/8 backdrop-blur-md">

        {/* Slim pulsing clock icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-200/70">
          <svg className="h-4 w-4 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
            {t(daysText)}
          </span>
          <span className="text-sm font-semibold text-stone-900">
            {t(title)}
          </span>
        </div>

        {/* Thin progress bar at the bottom edge of the pill */}
        <div className="ml-3 h-0.5 w-20 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 animate-[timeLapseFill_2200ms_ease-in-out_forwards]" />
        </div>
      </div>
    </div>
  );
}
