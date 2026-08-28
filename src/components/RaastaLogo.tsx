import React from "react";

interface RaastaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Raasta Ambigramic Vector Mark:
 * A seamless fusion of the Latin capital 'R' (with the left vertical spine removed)
 * and the Devanagari Hindi glyph 'र' (ra).
 * Symbolizes the open, unblocked road (रास्ता) to rightful entitlements.
 */
export function RaastaLogo({ className = "h-5 w-5", size }: RaastaLogoProps) {
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
      className={sizeClass}
      aria-label="Raasta Logo (R / र)"
    >
      {/* Top Shirorekha / Upper 'R' & 'र' Loop and Dynamic Road Sweep */}
      <path
        d="M 4.5 4.5 H 13.5 C 17 4.5 19.5 7 19.5 10.5 C 19.5 14 17 16.5 13.5 16.5 H 8.5 L 18.5 24"
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
