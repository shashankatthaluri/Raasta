import React from "react";

interface RaastaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  stage?: "r" | "transforming" | "settled";
}

/**
 * Raasta Brand Mark:
 * Starts as Latin capital 'R', then the left vertical stroke
 * glides smoothly across to the right, evolving into the Devanagari 'रा' (Raa - for Raasta)
 * with the left 'र' curve & diagonal road sweep and the right 'ा' vertical pillar.
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

  // In 'r' mode, the stroke is on the left (x = 5.5).
  // In 'settled' mode, it has moved to the right (x = 18.5) to form the Devanagari 'रा' matra.
  const isLeft = stage === "r";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClass} overflow-visible`}
      aria-label="Raasta Logo (R → रा)"
    >
      {/* Devanagari 'र' / Upper Loop & Sweeping Road Leg */}
      <path
        d="M 6 4.5 C 13 4.5 15.5 7.2 15.5 10.5 C 15.5 13.8 13 15.5 6.5 15.5 L 14.5 20.5"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* The Evolving Vertical Stroke:
          Translates from x=5.5 (forming English 'R') to x=18.5 (forming Hindi 'रा') */}
      <line
        x1={isLeft ? 5.5 : 18.5}
        y1={4.5}
        x2={isLeft ? 5.5 : 18.5}
        y2={20.5}
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        className="transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
      />
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
