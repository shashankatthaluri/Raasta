import { ImageResponse } from "next/og";

export const alt = "Raasta — Citizen Recovery Layer for Public Services";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0a09",
          padding: 60,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 110,
            height: 110,
            borderRadius: 32,
            background: "#292524",
            border: "2px solid #44403c",
            marginBottom: 32,
          }}
        >
          <svg
            width="65"
            height="65"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 4.5 4.5 H 13.5 C 17 4.5 19.5 7 19.5 10.5 C 19.5 14 17 16.5 13.5 16.5 H 8.5 L 18.5 24"
              stroke="#f5f5f4"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          style={{
            fontSize: 54,
            fontWeight: 800,
            color: "#fafaf9",
            letterSpacing: "-0.03em",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Raasta · रास्ता · రాస్తా
        </div>

        <div
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: "#a8a29e",
            maxWidth: 860,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          One clear next step through government services. A persistent recovery layer for citizen entitlements and DBT schemes.
        </div>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 24px",
            borderRadius: 9999,
            background: "#1c1917",
            border: "1px solid #292524",
            fontSize: 18,
            fontWeight: 600,
            color: "#34d399",
          }}
        >
          raasta.online
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
