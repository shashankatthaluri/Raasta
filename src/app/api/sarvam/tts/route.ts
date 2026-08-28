import { NextResponse } from "next/server";

/**
 * POST /api/sarvam/tts
 * Body: { text: string, lang: string }
 * Returns base64-encoded WAV audio from Sarvam Bulbul v3.
 * Falls back gracefully if no SARVAM_API_KEY is configured.
 */
export async function POST(request: Request) {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "SARVAM_API_KEY not configured" }, { status: 503 });
  }

  let body: { text?: string; lang?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const langCodeMap: Record<string, string> = {
    en: "en-IN",
    hi: "hi-IN",
    te: "te-IN",
    ta: "ta-IN",
    kn: "kn-IN",
    mr: "mr-IN",
    bn: "bn-IN",
    pa: "pa-IN",
  };
  const languageCode = langCodeMap[body.lang ?? "en"] ?? "en-IN";

  // priya: warm female voice supported across all languages in Bulbul v3
  const speaker = "priya";

  try {
    const res = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        text: text.slice(0, 2500), // Bulbul v3 max 2500 chars
        language_code: languageCode,
        model: "bulbul:v3",
        speaker,
        pace: 1.0,
        enable_preprocessing: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Sarvam TTS] Error:", res.status, err);
      return NextResponse.json({ error: "Sarvam TTS error", detail: err }, { status: 502 });
    }

    const data = (await res.json()) as { audios?: string[]; request_id?: string };
    const audioBase64 = data.audios?.[0];
    if (!audioBase64) {
      return NextResponse.json({ error: "No audio in response" }, { status: 502 });
    }

    return NextResponse.json({ audio: audioBase64 });
  } catch (err) {
    console.error("[Sarvam TTS] Fetch failed:", err);
    return NextResponse.json({ error: "Could not reach Sarvam API" }, { status: 502 });
  }
}
