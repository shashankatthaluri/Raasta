import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1c1917",
          borderRadius: 8,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Top Line (Shirorekha) - Compact & Balanced */}
          <line
            x1={6.8}
            y1={4.5}
            x2={17.2}
            y2={4.5}
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Devanagari 'र' Upper Loop & Forward Road Sweep */}
          <path
            d="M 8.5 4.5 C 13.8 4.5 16 7 16 9.8 C 16 12.5 13.8 14 8.5 14 L 16.5 20.5"
            stroke="#ffffff"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
