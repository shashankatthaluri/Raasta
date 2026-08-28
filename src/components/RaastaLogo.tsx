import React from "react";

interface RaastaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  stage?: "r" | "transforming" | "settled";
}

/**
 * Raasta Brand Mark:
 * 1. Begins as a 100% proper, geometric Latin capital 'R' (Left vertical straight spine + clean upper bowl + diagonal leg).
 * 2. The straight vertical line lifts from the top, takes an elegant smooth turn across the loop,
 *    and with a calibrated optical gap, drops down on the right into a straight vertical pillar (aa-matra).
 * 3. The left structure stands as the Devanagari 'र', forming the iconic 'रा' (Raasta).
 */
export function RaastaLogo({
  className = "h-5 w-5",
  size,
  stage = "settled",
}: RaastaLogoProps) {
  let sizeClass = className;
  if (size === "sm") sizeClass = "h-4 w-4";
  else if (size === "md") sizeClass = "h-5 w-5";
  else if (size === "lg") sizeClass = "h-8 w-8";
  else if (size === "xl") sizeClass = "h-12 w-12";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClass} overflow-visible`}
      aria-label="Raasta Logo (R → Turn & Drop → रा)"
    >
      {/* 
        The Core Glyph:
        In Latin 'R' mode (with left spine attached), this forms the upper loop and diagonal leg.
        When the spine moves to the right, this stands alone as the Devanagari 'र'.
      */}
      <path
        d="M 5.5 4.5 H 11 C 14.8 4.5 16.5 6.8 16.5 9.5 C 16.5 12.2 14.8 13.5 11 13.5 H 5.5 M 10.5 13.5 L 16 20.5"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 
        The Moving Straight Spine:
        - stage 'r': Solid vertical line on the left at x = 5.5 (forming perfect 'R').
        - stage 'transforming': Lifts up, turns across the top header, and drops down on the right at x = 19.5.
        - stage 'settled': Locked in place on the right at x = 19.5 (forming 'रा').
      */}
      <g
        className={
          stage === "transforming"
            ? "animate-spine-turn-drop"
            : stage === "settled"
            ? "translate-x-[14px]"
            : "translate-x-0"
        }
      >
        <line
          x1={5.5}
          y1={4.5}
          x2={5.5}
          y2={20.5}
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function RaastaLogoEmblem({
  size = "md",
  className = "",
  stage = "settled",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  stage?: "r" | "transforming" | "settled";
}) {
  const containerSizes = {
    sm: "h-6 w-6 rounded-lg",
    md: "h-8 w-8 rounded-xl",
    lg: "h-12 w-12 rounded-2xl",
    xl: "h-16 w-16 rounded-3xl",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4.5 w-4.5",
    lg: "h-6 w-6",
    xl: "h-9 w-9",
  };

  return (
    <div
      className={`flex items-center justify-center bg-stone-900 text-white shadow-2xs transition-all duration-200 ${containerSizes[size]} ${className}`}
    >
      <RaastaLogo className={iconSizes[size]} stage={stage} />
    </div>
  );
}
