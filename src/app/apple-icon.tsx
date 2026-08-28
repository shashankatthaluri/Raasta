import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: 40,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Devanagari 'र' Upper Loop & Road Sweep */}
          <path
            d="M 6 4.5 C 13 4.5 15.5 7.2 15.5 10.5 C 15.5 13.8 13 15.5 6.5 15.5 L 14.5 20.5"
            stroke="#ffffff"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Devanagari 'ा' Vertical Pillar (Aa-Matra) */}
          <line
            x1="19.2"
            y1="4.5"
            x2="19.2"
            y2="20.5"
            stroke="#ffffff"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
