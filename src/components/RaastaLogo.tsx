import React from "react";

interface RaastaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

/**
 * Raasta Devanagari 'र' (Ra) Vector Mark:
 * An authentic, distinctive glyph representing 'र' (रास्ता / Raasta)
 * with the signature horizontal Shirorekha top bar and dynamic road sweep.
 *
 * Starts as Latin 'R' and the left vertical spine sweeps to the top
 * to settle into the Devanagari Hindi 'र'.
 */
export function RaastaLogo({ className = "h-5 w-5", size, animated = true }: RaastaLogoProps) {
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
      aria-label="Raasta Logo (र / Ra)"
    >
      {/* Top Shirorekha Bar (Morphs smoothly from left spine to top bar) */}
      <path
        d="M 4 4.5 H 20"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={
          animated
            ? "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top-left"
            : ""
        }
      />
      {/* Devanagari 'र' Upper Bowl & Forward Road Sweep */}
      <path
        d="M 8 4.5 C 13.8 4.5 16.5 7.2 16.5 10.5 C 16.5 13.8 13.8 15.8 8.5 15.8 L 17 21.5"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={
          animated
            ? "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            : ""
        }
      />
    </svg>
  );
}

export function RaastaLogoEmblem({
  size = "md",
  className = "",
  animated = true,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
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
      <RaastaLogo className={iconSizes[size]} animated={animated} />
    </div>
  );
}
