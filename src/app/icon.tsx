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
          {/* Straight Top Line, U-Turn, Straight Return Line & Diagonal Line */}
          <path
            d="M 5.5 5 H 11.5 C 15.2 5 16.5 7 16.5 9 C 16.5 11 15.2 13 11.5 13 H 5.5 M 10 13 L 15.8 20.5"
            stroke="#ffffff"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Vertical Straight Line with Optical Gap */}
          <line
            x1="20"
            y1="5"
            x2="20"
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
