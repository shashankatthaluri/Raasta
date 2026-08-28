"use client";

import React from "react";

interface VirtualCursorProps {
  visible: boolean;
  x: number;
  y: number;
  clicking: boolean;
  label?: string | null;
}

export function VirtualCursor({ visible, x, y, clicking, label }: VirtualCursorProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        transition: "transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease",
      }}
      className="pointer-events-none fixed top-0 left-0 z-[999] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2"
    >
      {/* Outer Click Ripple */}
      {clicking && (
        <span className="absolute -inset-3 rounded-full border-2 border-emerald-400 bg-emerald-400/30 animate-ping" />
      )}

      {/* Pointer Cursor Circle */}
      <div
        className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-stone-900/90 text-white shadow-2xl backdrop-blur-md transition-transform duration-200 ${
          clicking ? "scale-75 bg-emerald-600 border-emerald-300 ring-4 ring-emerald-400/40" : "scale-100 ring-4 ring-stone-900/20"
        }`}
      >
        <svg
          className="h-3.5 w-3.5 fill-current text-white -rotate-45 translate-x-px"
          viewBox="0 0 24 24"
        >
          <path d="M3 3l7 18 3-7 7-3L3 3z" />
        </svg>
      </div>

      {/* Action Intent Label Pill */}
      {label && (
        <span className="whitespace-nowrap rounded-full border border-stone-800 bg-stone-900/95 px-3 py-1 text-[11px] font-semibold text-white shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          {label}
        </span>
      )}
    </div>
  );
}
