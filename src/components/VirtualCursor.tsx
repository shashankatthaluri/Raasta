"use client";

import React from "react";

interface VirtualCursorProps {
  visible: boolean;
  x: number;
  y: number;
  clicking: boolean;
  label?: string | null;
}

export function VirtualCursor({ visible, x, y, clicking }: VirtualCursorProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        transition: "transform 650ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className="pointer-events-none fixed top-0 left-0 z-[999] select-none"
    >
      {/* Click ripple */}
      {clicking && (
        <span className="absolute -top-3 -left-3 h-10 w-10 rounded-full border border-stone-400/40 bg-stone-400/10 animate-ping pointer-events-none" />
      )}

      {/* Authentic OS pointer arrow — no tooltip */}
      <div className={`transition-transform duration-100 ${clicking ? "scale-90" : "scale-100"}`}>
        <svg
          className="h-5 w-5 drop-shadow-sm"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 2.5L8.75 17.5L11.25 11.25L17.5 8.75L2.5 2.5Z"
            fill="#1c1917"
            stroke="#ffffff"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
