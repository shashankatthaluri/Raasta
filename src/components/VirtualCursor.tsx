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
      className="pointer-events-none fixed top-0 left-0 z-[999] flex items-start gap-1.5 select-none"
    >
      {/* Authentic OS Pointer Arrow */}
      <div className={`relative transition-transform duration-150 ${clicking ? "scale-90" : "scale-100"}`}>
        {/* Click Ring Ripple */}
        {clicking && (
          <span className="absolute -top-2 -left-2 h-8 w-8 rounded-full border-2 border-emerald-500 bg-emerald-400/30 animate-ping pointer-events-none" />
        )}

        <svg
          className="h-6 w-6 drop-shadow-md"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Classic Pointer Arrow Shape */}
          <path
            d="M3 3L10.5 21L13.5 13.5L21 10.5L3 3Z"
            fill="#1c1917"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Action Intent Label Pill */}
      {label && (
        <span className="mt-4 -ml-1 whitespace-nowrap rounded-full border border-stone-800/80 bg-stone-900/90 px-2.5 py-0.5 text-[10px] font-medium text-stone-200 shadow-lg backdrop-blur-xs animate-in fade-in duration-200">
          {label}
        </span>
      )}
    </div>
  );
}
