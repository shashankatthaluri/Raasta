import { NextResponse } from "next/server";

/**
 * POST /api/sarvam/explain
 * Body: {
 *   title: string,         — case status title (e.g. "e-KYC Required")
 *   why: string,           — explanation of why (e.g. "Your Aadhaar biometric…")
 *   action: string,        — what user must do next (e.g. "Visit CSC and complete…")
 *   actionRequired: boolean,
 *   lang: string,          — "te" | "hi" | "ta" | "kn" | "mr" | "bn" | "pa" | "en"
 * }
 *
 * Uses GPT-4o-mini to rewrite the case summary into a warm, clear spoken
 * message in the user's regional language, then Sarvam Bulbul v3 to voice it.
 * Returns: { audio: string }  (base64 WAV)
 */

const LANG_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
  kn: "Kannada",
  mr: "Marathi",
  bn: "Bengali",
  pa: "Punjabi",
};

const LANG_CODES: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  kn: "kn-IN",
  mr: "mr-IN",
  bn: "bn-IN",
  pa: "pa-IN",
};

export async function POST(request: Request) {
  const sarvamKey = process.env.SARVAM_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!sarvamKey) {
    return NextResponse.json({ error: "SARVAM_API_KEY not configured" }, { status: 503 });
  }

  let body: {
    title?: string;
    why?: string;
    action?: string;
    actionRequired?: boolean;
    documents?: string[];
    whatsappPrompt?: boolean;
    lang?: string;
  } = {};

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const lang = body.lang ?? "en";
  const langName = LANG_NAMES[lang] ?? "English";
  const langCode = LANG_CODES[lang] ?? "en-IN";
  const title = body.title ?? "";
  const why = body.why ?? "";
  const action = body.action ?? "";
  const actionRequired = body.actionRequired ?? false;
  const documents = body.documents && body.documents.length > 0 ? body.documents : [];
  const whatsappPrompt = body.whatsappPrompt ?? true;

  // Step 1: Generate a spoken advisory via GPT-4o-mini
  // Designed for HEARING, not reading — warm, simple, actionable, human voice
  let spokenText = "";

  if (openaiKey) {
    try {
      const systemPrompt = `You are a trusted, warm local helper — like a village CSC operator or friend — speaking to a farmer on a phone call in ${langName}.

RULES FOR SPOKEN AUDIO (Strict):
1. Speak warmly and naturally like a real person on a phone call.
2. Structure in 4 clear parts:
   - Greeting & current status summary (1 simple sentence).
   - What happened / why payment is on hold (1 simple sentence).
   - What the farmer must do & EXACT DOCUMENTS to carry: ${documents.length > 0 ? `Explicitly name the documents (${documents.join(", ")}) so they don't get turned away.` : "State the next step clearly."}
   - WhatsApp alert tip: Remind them to enter their phone number on this screen to get free instant WhatsApp updates the second government verification passes.
3. If no action is needed: warmly reassure them that the government is processing their case, they don't need to visit anywhere, and they can enter their phone number on this screen for WhatsApp updates.
4. Keep sentences short, clean, and unhurried. No jargon. No bullet points.
5. Respond 100% in ${langName}. Do not mix languages.
6. Length: 4–6 short sentences, under 110 words. Every word must be helpful and comforting.`;

      const userPrompt = `Case Status: ${title}
Why: ${why}
${actionRequired ? `Action required: ${action || "Please visit the center."}` : "Action required: No action needed from farmer."}
${documents.length > 0 ? `Documents to carry with them: ${documents.join(", ")}` : ""}
WhatsApp alert available: ${whatsappPrompt ? "Yes, farmer can enter phone number on screen for updates" : "No"}

Write the spoken audio message now in ${langName}. Remember: this will be heard once, so make the action, documents to bring, and WhatsApp notification crystal clear.`;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.55,
          max_tokens: 220,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        spokenText = data.choices?.[0]?.message?.content?.trim() ?? "";
      }
    } catch (err) {
      console.error("[Explain] OpenAI error:", err);
    }
  }

  // Fallback: compose from raw fields if OpenAI unavailable
  if (!spokenText) {
    const docLine = documents.length > 0 ? ` Bring: ${documents.join(", ")}.` : "";
    const actionLine = actionRequired
      ? `${action || "Please take action immediately."}${docLine}`
      : (action || "No action needed from you right now.");
    const waLine = whatsappPrompt ? " You can enter your phone number below to get instant WhatsApp updates." : "";
    spokenText = `${title}. ${why} ${actionLine}${waLine}`;
  }

  // Clamp to Bulbul v3 limit
  spokenText = spokenText.slice(0, 2000);

  // Step 2: Convert the spoken text to audio via Sarvam Bulbul v3
  try {
    const ttsRes = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": sarvamKey,
      },
      body: JSON.stringify({
        text: spokenText,
        language_code: langCode,
        model: "bulbul:v3",
        speaker: "priya",
        pace: 0.95,
        enable_preprocessing: true,
      }),
    });

    if (!ttsRes.ok) {
      const errText = await ttsRes.text();
      console.error("[Explain] Bulbul error:", errText);
      return NextResponse.json({ error: "TTS failed", spokenText }, { status: 502 });
    }

    const ttsData = (await ttsRes.json()) as { audios?: string[] };
    const audioBase64 = ttsData.audios?.[0];
    if (!audioBase64) {
      return NextResponse.json({ error: "No audio returned", spokenText }, { status: 502 });
    }

    return NextResponse.json({ audio: audioBase64, spokenText });
  } catch (err) {
    console.error("[Explain] Bulbul fetch failed:", err);
    return NextResponse.json({ error: "Could not reach Sarvam API" }, { status: 502 });
  }
}
