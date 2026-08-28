import React from "react";

interface RaastaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  stage?: "r" | "transforming" | "settled";
}

/**
 * Raasta Apple-Grade Mark:
 * 1. Initial State: The iconic Raasta 'र' glyph sits centered with serene poise.
 * 2. Transformation: The glyph glides smoothly to the left with Apple spring easing,
 *    while the vertical straight pillar ('ा') reveals on the right with calibrated optical space.
 * 3. Settles in harmony as the iconic 'रा' (Raasta) identity.
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

  const isCentered = stage === "r";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClass} overflow-visible`}
      aria-label="Raasta Logo (र → Shift & Reveal → रा)"
    >
      {/* 
        The Iconic Raasta 'र' Glyph:
        Starts centered in the tile, then glides left with Apple fluid spring physics
      */}
      <g
        className="transition-transform duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: isCentered ? "translate3d(1.5px, 0, 0)" : "translate3d(-2px, 0, 0)",
        }}
      >
        <path
          d="M 6.5 6 H 12 C 16 6 17.5 8 17.5 10.5 C 17.5 13 16 14.5 12 14.5 L 17.5 20.5"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* 
        The Right Vertical Pillar ('ा'):
        Reveals smoothly into place on the right with calibrated optical space
      */}
      <line
        x1={19}
        y1={6}
        x2={19}
        y2={20.5}
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        className="transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: isCentered ? 0 : 1,
          transform: isCentered ? "scaleY(0.4) translate3d(-3px, 0, 0)" : "scaleY(1) translate3d(0, 0, 0)",
          transformOrigin: "center center",
        }}
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
