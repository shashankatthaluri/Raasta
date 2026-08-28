import { NextResponse } from "next/server";

/**
 * POST /api/sarvam/stt
 * Receives raw audio blob from the browser microphone,
 * forwards it to Sarvam Saaras v3 and returns { transcript }.
 * Falls back gracefully if no SARVAM_API_KEY is configured.
 */
export async function POST(request: Request) {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "SARVAM_API_KEY not configured" }, { status: 503 });
  }

  const langHeader = request.headers.get("x-language") ?? "en";
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
  const languageCode = langCodeMap[langHeader] ?? "en-IN";

  let audioBuffer: ArrayBuffer;
  try {
    audioBuffer = await request.arrayBuffer();
  } catch {
    return NextResponse.json({ error: "Could not read audio data" }, { status: 400 });
  }

  if (!audioBuffer.byteLength) {
    return NextResponse.json({ error: "Empty audio" }, { status: 400 });
  }

  try {
    const form = new FormData();
    form.append("file", new Blob([audioBuffer], { type: "audio/webm" }), "audio.webm");
    form.append("model", "saaras:v3");
    form.append("language_code", languageCode);

    const res = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "api-subscription-key": apiKey,
      },
      body: form,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Sarvam STT] Error:", res.status, err);
      return NextResponse.json({ error: "Sarvam STT error", detail: err }, { status: 502 });
    }

    const data = (await res.json()) as { transcript?: string; error?: string };
    return NextResponse.json({ transcript: data.transcript ?? "" });
  } catch (err) {
    console.error("[Sarvam STT] Fetch failed:", err);
    return NextResponse.json({ error: "Could not reach Sarvam API" }, { status: 502 });
  }
}
