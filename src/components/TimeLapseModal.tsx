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

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative max-w-sm w-full rounded-3xl border border-stone-800 bg-stone-900/95 p-6 text-white shadow-2xl text-center animate-in zoom-in-95 duration-300">
        {/* Animated Calendar/Clock Beacon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner">
          <svg className="h-6 w-6 text-amber-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>

        {/* Days Badge */}
        <span className="mt-3.5 inline-block rounded-full bg-amber-400/20 px-3 py-1 font-mono text-xs font-bold text-amber-300 border border-amber-400/30 uppercase tracking-wide">
          {t(daysText)}
        </span>

        {/* Title */}
        <h3 className="mt-2.5 text-base font-bold text-stone-100">
          {t(title)}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-stone-400 leading-relaxed">
          {t(description)}
        </p>

        {/* Realistic Time-Lapse Progress Track */}
        <div className="mt-5 overflow-hidden rounded-full bg-stone-800 h-1.5">
          <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 animate-[timeLapseFill_2200ms_ease-in-out_forwards]" />
        </div>
      </div>
    </div>
  );
}
