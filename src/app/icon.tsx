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
          {/* Iconic 'र' Glyph */}
          <path
            d="M 4.5 6 H 10 C 14 6 15.5 8 15.5 10.5 C 15.5 13 14 14.5 10 14.5 L 15.5 20.5"
            stroke="#ffffff"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Vertical Pillar ('ा') */}
          <line
            x1="19"
            y1="6"
            x2="19"
            y2="20.5"
            stroke="#ffffff"
            strokeWidth="2.75"
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
