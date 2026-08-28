"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MicIcon } from "@/components/Icons";
import type { Lang } from "@/lib/i18n";

/**
 * Phase 7 — "Tell us what happened." (secondary path)
 * Voice-to-Text: MediaRecorder → /api/sarvam/stt (Saaras v2) → transcript.
 * Falls back to browser SpeechRecognition if Sarvam is unavailable.
 * Text-to-Text: free text → /api/cases → structured intent → deterministic engine.
 */
export function IntakeForm({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // MediaRecorder refs for Sarvam STT
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxSessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const INTAKE_COPY: Record<Lang, {
    label: string;
    hint: string;
    placeholder: string;
    submit: string;
    busy: string;
    error: string;
    voiceStart: string;
    voiceListening: string;
    voiceProcessing: string;
    micDenied: string;
    samples: string[];
  }> = {
    en: {
      label: "Tell us what happened (Speak or Type)",
      hint: "Speak or type in your own words — English or any Indian language.",
      placeholder: "e.g. I used to receive the money every time, but this month I didn't get anything.",
      submit: "Open my case",
      busy: "Opening…",
      error: "Could not open your case.",
      voiceStart: "Tap to Speak",
      voiceListening: "Recording… tap again to stop",
      voiceProcessing: "Understanding…",
      micDenied: "Microphone permission denied. Please allow access or type below.",
      samples: [
        "I used to get payments every time, but not this month.",
        "e-KYC completed but payment is still on hold.",
      ],
    },
    hi: {
      label: "हमें बताएँ क्या हुआ (बोलें या लिखें)",
      hint: "अपने शब्दों में बोलें या लिखें — हिंदी या कोई भी भाषा।",
      placeholder: "जैसे — पहले पैसे हर बार मिलते थे, इस बार नहीं आए।",
      submit: "मेरा केस खोलें",
      busy: "खुल रहा है…",
      error: "आपका केस नहीं खुल सका।",
      voiceStart: "बोलकर बताएँ",
      voiceListening: "रिकॉर्ड हो रहा है… रोकने के लिए टैप करें",
      voiceProcessing: "समझ रहे हैं…",
      micDenied: "माइक्रोफ़ोन की अनुमति अस्वीकृत। कृपया अनुमति दें या नीचे लिखें।",
      samples: [
        "पहले पैसे हर बार आते थे, इस बार नहीं आए।",
        "ई-केवाईसी कर दिया फिर भी पैसा रुका हुआ है।",
      ],
    },
    te: {
      label: "ఏమి జరిగిందో చెప్పండి (మాట్లాడండి లేదా రాయండి)",
      hint: "మీ స్వంత మాటల్లో మాట్లాడండి లేదా రాయండి — తెలుగు లేదా ఏదైనా భాష.",
      placeholder: "ఉదాహరణ — ప్రతిసారీ డబ్బులు వచ్చేవి, ఈసారి రాలేదు.",
      submit: "నా కేస్ తెరవండి",
      busy: "తెరుస్తోంది…",
      error: "మీ కేస్ తెరవడం సాధ్యం కాలేదు.",
      voiceStart: "మాట్లాడటానికి నొక్కండి",
      voiceListening: "రికార్డ్ అవుతోంది… ఆపడానికి నొక్కండి",
      voiceProcessing: "అర్థం చేసుకుంటున్నాం…",
      micDenied: "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి అనుమతి ఇవ్వండి లేదా క్రింద టైప్ చేయండి.",
      samples: [
        "ప్రతిసారీ చెల్లింపులు వచ్చేవి, కానీ ఈ నెల రాలేదు.",
        "ఇ-కెవైసి పూర్తయినా చెల్లింపు ఇంకా నిలిచిపోయింది.",
      ],
    },
    ta: {
      label: "என்ன நடந்தது என்று சொல்லுங்கள் (பேசவும் அல்லது எழுதவும்)",
      hint: "உங்கள் சொந்த வார்த்தைகளில் பேசவும் அல்லது எழுதவும் — தமிழ் அல்லது பிற மொழி.",
      placeholder: "எ.கா. வழக்கமாக பணம் வரும், ஆனால் இந்த முறை வரவில்லை.",
      submit: "என் வழக்கைத் திறக்கவும்",
      busy: "திறக்கிறது…",
      error: "உங்கள் வழக்கைத் திறக்க முடியவில்லை.",
      voiceStart: "பேச தட்டவும்",
      voiceListening: "பதிவு ஆகிறது… நிறுத்த தட்டவும்",
      voiceProcessing: "புரிந்துகொள்கிறோம்…",
      micDenied: "மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. அனுமதி வழங்கவும் அல்லது தட்டச்சு செய்யவும்.",
      samples: [
        "ஒவ்வொரு முறையும் பணம் வந்தது, இந்த மாதம் வரவில்லை.",
        "இ-கேஒய்சி முடிந்தது ஆனால் பணம் இன்னும் நிறுத்தி வைக்கப்பட்டுள்ளது.",
      ],
    },
    kn: {
      label: "ಏನಾಯಿತು ಎಂದು ತಿಳಿಸಿ (ಮಾತನಾಡಿ ಅಥವಾ ಬರೆಯಿರಿ)",
      hint: "ನಿಮ್ಮ ಸ್ವಂತ ಮಾತುಗಳಲ್ಲಿ ತಿಳಿಸಿ — ಕನ್ನಡ ಅಥವಾ ಯಾವುದೇ ಭಾಷೆ.",
      placeholder: "ಉದಾಹರಣೆಗೆ — ಪ್ರತಿ ಬಾರಿ ಹಣ ಬರುತ್ತಿತ್ತು, ಈ ಬಾರಿ ಬಂದಿಲ್ಲ.",
      submit: "ನನ್ನ ಪ್ರಕರಣವನ್ನು ತೆರೆಯಿರಿ",
      busy: "ತೆರೆಯಲಾಗುತ್ತಿದೆ…",
      error: "ಪ್ರಕರಣವನ್ನು ತೆರೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
      voiceStart: "ಮಾತನಾಡಲು ಸ್ಪರ್ಶಿಸಿ",
      voiceListening: "ರೆಕಾರ್ಡ್ ಆಗುತ್ತಿದೆ… ನಿಲ್ಲಿಸಲು ಸ್ಪರ್ಶಿಸಿ",
      voiceProcessing: "ಅರ್ಥ ಮಾಡಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ…",
      micDenied: "ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿಯನ್ನು ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಅನುಮತಿ ನೀಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.",
      samples: [
        "ಪ್ರತಿ ಬಾರಿ ಪಾವತಿ ಬರುತ್ತಿತ್ತು, ಆದರೆ ಈ ತಿಂಗಳು ಬರಲಿಲ್ಲ.",
        "ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಂಡಿದ್ದರೂ ಪಾವತಿ ಇನ್ನೂ ತಡೆಹಿಡಿಯಲಾಗಿದೆ.",
      ],
    },
    mr: {
      label: "काय घडले ते सांगा (बोला किंवा लिहा)",
      hint: "तुमच्या शब्दांत सांगा — मराठी किंवा कोणतीही भाषा.",
      placeholder: "उदा. — आधी प्रत्येक वेळी पैसे मिळायचे, या वेळी आले नाहीत.",
      submit: "माझे प्रकरण उघडा",
      busy: "उघडत आहे…",
      error: "प्रकरण उघडता आले नाही.",
      voiceStart: "बोलण्यासाठी टॅप करा",
      voiceListening: "रेकॉर्ड होत आहे… थांबण्यासाठी टॅप करा",
      voiceProcessing: "समजून घेत आहोत…",
      micDenied: "मायक्रोफोन परवानगी नाकारली. कृपया परवानगी द्या किंवा खाली टाईप करा.",
      samples: [
        "आधी प्रत्येक वेळी पैसे यायचे, पण या महिन्यात आले नाहीत.",
        "ई-केवायसी पूर्ण झाले तरी पैसे अडकले आहेत.",
      ],
    },
    bn: {
      label: "কী হয়েছে তা বলুন (বলুন বা লিখুন)",
      hint: "নিজের ভাষায় বলুন বা লিখুন — বাংলা বা যেকোনো ভাষা।",
      placeholder: "যেমন — আগে প্রতিবার টাকা পেতাম, এবার আসেনি।",
      submit: "আমার কেস খুলুন",
      busy: "খোলা হচ্ছে…",
      error: "আপনার কেস খোলা সম্ভব হয়নি।",
      voiceStart: "কথা বলতে ট্যাপ করুন",
      voiceListening: "রেকর্ড হচ্ছে… থামাতে ট্যাপ করুন",
      voiceProcessing: "বুঝে নিচ্ছি…",
      micDenied: "মাইক্রোফোন অনুমতি প্রত্যাখ্যাত। অনুগ্রহ করে অনুমতি দিন অথবা নিচে টাইপ করুন।",
      samples: [
        "আগে প্রতিবার টাকা আসত, কিন্তু এই মাসে আসেনি।",
        "ই-কেওয়াইসি সম্পন্ন হলেও টাকা এখনো আটকে আছে।",
      ],
    },
    pa: {
      label: "ਦੱਸੋ ਕੀ ਹੋਇਆ (ਬੋਲੋ ਜਾਂ ਲਿਖੋ)",
      hint: "ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਬੋਲੋ ਜਾਂ ਲਿਖੋ — ਪੰਜਾਬੀ ਜਾਂ ਕੋਈ ਵੀ ਭਾਸ਼ਾ।",
      placeholder: "ਜਿਵੇਂ — ਪਹਿਲਾਂ ਹਰ ਵਾਰ ਪੈਸੇ ਮਿਲਦੇ ਸੀ, ਇਸ ਵਾਰ ਨਹੀਂ ਆਏ।",
      submit: "ਮੇਰਾ ਕੇਸ ਖੋਲ੍ਹੋ",
      busy: "ਖੁੱਲ੍ਹ ਰਿਹਾ ਹੈ…",
      error: "ਤੁਹਾਡਾ ਕੇਸ ਨਹੀਂ ਖੁੱਲ੍ਹ ਸਕਿਆ।",
      voiceStart: "ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ",
      voiceListening: "ਰਿਕਾਰਡ ਹੋ ਰਿਹਾ ਹੈ… ਰੋਕਣ ਲਈ ਟੈਪ ਕਰੋ",
      voiceProcessing: "ਸਮਝ ਰਹੇ ਹਾਂ…",
      micDenied: "ਮਾਈਕ੍ਰੋਫੋਨ ਦੀ ਇਜਾਜ਼ਤ ਅਸਵੀਕਾਰ ਕੀਤੀ ਗਈ। ਕਿਰਪਾ ਕਰਕੇ ਇਜਾਜ਼ਤ ਦਿਓ ਜਾਂ ਹੇਠਾਂ ਲਿਖੋ।",
      samples: [
        "ਪਹਿਲਾਂ ਹਰ ਵਾਰ ਪੈਸੇ ਆਉਂਦੇ ਸੀ, ਪਰ ਇਸ ਮਹੀਨੇ ਨਹੀਂ ਆਏ।",
        "ਈ-ਕੇਵਾਈਸੀ ਹੋ ਗਈ ਹੈ ਪਰ ਪੈਸਾ ਅਜੇ ਵੀ ਰੁਕਿਆ ਹੋਇਆ ਹੈ।",
      ],
    },
  };

  const t = INTAKE_COPY[lang] ?? INTAKE_COPY.en;

  function clearTimers() {
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    if (maxSessionTimerRef.current) { clearTimeout(maxSessionTimerRef.current); maxSessionTimerRef.current = null; }
  }

  function stopRecording() {
    clearTimers();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  async function sendAudioToSarvam(blob: Blob) {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/sarvam/stt", {
        method: "POST",
        headers: { "x-language": lang },
        body: blob,
      });
      const json = (await res.json()) as { transcript?: string; error?: string };
      if (json.transcript?.trim()) {
        const fullTranscript = json.transcript.trim();
        setMessage((prev) => {
          const base = prev.trim() ? `${prev.trim()} ` : "";
          let charIndex = 0;
          const streamSpeed = Math.max(10, Math.min(25, 700 / fullTranscript.length));
          const interval = setInterval(() => {
            charIndex += 2;
            if (charIndex >= fullTranscript.length) {
              setMessage(base + fullTranscript);
              clearInterval(interval);
            } else {
              setMessage(base + fullTranscript.slice(0, charIndex));
            }
          }, streamSpeed);
          return prev;
        });
      }
    } catch (err) {
      console.error("[Sarvam STT]", err);
    } finally {
      setIsProcessing(false);
      setIsListening(false);
    }
  }

  async function toggleVoice() {
    if (isListening) {
      // Tap again = stop and transcribe
      stopRecording();
      return;
    }

    setError(null);
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError(t.micDenied);
      return;
    }

    streamRef.current = stream;
    audioChunksRef.current = [];

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "audio/ogg";

    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      setIsListening(false);
      const blob = new Blob(audioChunksRef.current, { type: mimeType });
      audioChunksRef.current = [];
      if (blob.size > 200) {
        void sendAudioToSarvam(blob);
      }
    };

    recorder.start(250); // collect chunks every 250ms
    setIsListening(true);

    // Auto-stop safety cap: 30 seconds
    maxSessionTimerRef.current = setTimeout(() => {
      stopRecording();
    }, 30000);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = message.trim();
    if (busy || !text) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const json = (await res.json()) as { case?: { id: string }; error?: string };
      if (!res.ok || !json.case) {
        setError(json.error ?? t.error);
        setBusy(false);
        return;
      }
      router.push(`/case/${json.case.id}`);
    } catch {
      setBusy(false);
      setError(t.error);
    }
  }

  const micLabel = isProcessing ? t.voiceProcessing : isListening ? t.voiceListening : t.voiceStart;

  return (
    <form
      onSubmit={submit}
      className="apple-card rounded-3xl p-6 sm:p-7 transition-all shadow-2xs border border-stone-200/80 bg-stone-50/70"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <label htmlFor="intake" className="block text-xs font-bold uppercase tracking-wider text-stone-500">
            {t.label}
          </label>
          <p className="mt-1 text-sm text-stone-600">
            {t.hint}
          </p>
        </div>

        <div className="shrink-0 pt-0.5">
          <button
            type="button"
            onClick={toggleVoice}
            disabled={isProcessing}
            className={`relative inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-2xs transition-all duration-300 active:scale-[0.97] disabled:opacity-60 cursor-pointer whitespace-nowrap ${
              isListening
                ? "bg-rose-600 text-white ring-4 ring-rose-500/20 shadow-md"
                : isProcessing
                ? "bg-amber-500 text-white ring-4 ring-amber-400/20 shadow-md"
                : "border border-stone-200/90 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-50"
            }`}
          >
          {isListening ? (
            <div className="flex items-center gap-0.5">
              <span className="h-3 w-0.5 rounded-full bg-white animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="h-4 w-0.5 rounded-full bg-white animate-[pulse_0.8s_ease-in-out_infinite_0.2s]" />
              <span className="h-2.5 w-0.5 rounded-full bg-white animate-[pulse_0.5s_ease-in-out_infinite_0.4s]" />
              <span className="h-3.5 w-0.5 rounded-full bg-white animate-[pulse_0.7s_ease-in-out_infinite_0.6s]" />
              <span className="h-2 w-0.5 rounded-full bg-white animate-[pulse_0.9s_ease-in-out_infinite_0.3s]" />
            </div>
          ) : isProcessing ? (
            <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <MicIcon className="h-3.5 w-3.5" />
          )}
          <span>{micLabel}</span>
        </button>
      </div>
    </div>

      {/* Primary Input Row */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            id="intake"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isListening ? t.voiceListening : isProcessing ? t.voiceProcessing : t.placeholder}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-900 shadow-2xs outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
          />
        </div>
        <button
          type="submit"
          disabled={busy || !message.trim()}
          className="rounded-2xl bg-stone-900 px-7 py-3.5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:bg-stone-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {busy ? t.busy : t.submit}
        </button>
      </div>

      {/* Natural Citizen Quote Questions */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-stone-200/60 pt-3">
        {t.samples.map((sample, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setMessage(sample)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200/90 bg-white px-3 py-1.5 text-xs text-stone-700 shadow-2xs transition hover:border-stone-400 hover:bg-stone-50 hover:text-stone-950 active:scale-[0.97] cursor-pointer"
          >
            <span>💬</span>
            <span>"{sample}"</span>
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs font-semibold text-rose-700">{error}</p>}
    </form>
  );
}
