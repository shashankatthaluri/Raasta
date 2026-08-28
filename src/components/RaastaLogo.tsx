import React from "react";

interface RaastaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  stage?: "r" | "transforming" | "settled";
}

/**
 * Raasta Brand Mark:
 * Geometric precision:
 * - Straight top line
 * - Smooth U-turn
 * - Straight return line
 * - Perfect diagonal line
 * - With calibrated space: the straight line vertically standing on the right (forming 'रा' after traveling from the left 'R' position).
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
        The Core Shape:
        1. Straight top line: M 5.5 5 H 11.5
        2. U-turn: C 15.2 5 16.5 7 16.5 9 C 16.5 11 15.2 13 11.5 13
        3. Straight return line: H 5.5
        4. Perfect diagonal line: M 10 13 L 15.8 20.5
      */}
      <path
        d="M 5.5 5 H 11.5 C 15.2 5 16.5 7 16.5 9 C 16.5 11 15.2 13 11.5 13 H 5.5 M 10 13 L 15.8 20.5"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 
        The Vertical Straight Line:
        - stage 'r': Attached straight on the left at x = 5.5 (forming perfect Latin 'R').
        - stage 'transforming': Lifts from top, takes a turn over the head, and drops on the right.
        - stage 'settled': Stands vertically straight on the right at x = 20 with calibrated space (forming 'रा').
      */}
      <g
        className={
          stage === "transforming"
            ? "animate-spine-turn-drop"
            : stage === "settled"
            ? "translate-x-[14.5px]"
            : "translate-x-0"
        }
      >
        <line
          x1={5.5}
          y1={5}
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
