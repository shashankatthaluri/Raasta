import React from "react";

interface RaastaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Raasta Vector Brand Mark:
 * Authentic, iconic Devanagari 'र' glyph (रास्ता / Raasta)
 * with a subtle, perfectly-proportioned top line (Shirorekha)
 * and dynamic forward road sweep.
 */
export function RaastaLogo({
  className = "h-5 w-5",
  size,
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
      aria-label="Raasta Logo (र)"
    >
      {/* Subtle Top Line (Shirorekha) - Compact & Balanced */}
      <line
        x1={6.8}
        y1={4.5}
        x2={17.2}
        y2={4.5}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Devanagari 'र' Upper Loop & Forward Road Sweep */}
      <path
        d="M 8.5 4.5 C 13.8 4.5 16 7 16 9.8 C 16 12.5 13.8 14 8.5 14 L 16.5 20.5"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RaastaLogoEmblem({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  stage?: string;
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
      <RaastaLogo className={iconSizes[size]} />
    </div>
  );
}
