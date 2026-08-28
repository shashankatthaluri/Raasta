"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { GlossaryText } from "@/components/Glossary";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Confetti } from "@/components/Confetti";
import { VirtualCursor } from "@/components/VirtualCursor";
import { TimeLapseModal } from "@/components/TimeLapseModal";
import { RaastaLogoEmblem } from "@/components/RaastaLogo";
import {
  ArrowLeftIcon,
  SpeakerIcon,
  StopIcon,
  MicIcon,
  ScaleIcon,
  SparklesIcon,
  PrinterIcon,
  CopyIcon,
  CheckIcon,
  PlayIcon,
  PauseIcon,
} from "@/components/Icons";
import { getStoredLanguage, setStoredLanguage, type Lang } from "@/lib/i18n";
import { CASE_PAGE_COPY } from "@/lib/caseTranslations";
import type { CaseDTO } from "@/server/dto";


const SOURCE_BADGE: Record<string, { label: Record<Lang, string>; cls: string }> = {
  OFFICIAL: {
    label: {
      en: "Official",
      hi: "आधिकारिक",
      te: "అధికారిక రికార్డు",
      ta: "அதிகாரப்பூர்வ பதிவு",
      kn: "ಅಧಿಕೃತ ದಾಖಲೆ",
      mr: "अधिकृत नोंद",
      bn: "অফিসিয়াল রেকর্ড",
      pa: "ਅਧਿਕਾਰਤ ਰਿਕਾਰਡ",
    },
    cls: "border-green-200 bg-green-50 text-green-800",
  },
  CITIZEN_REPORTED: {
    label: {
      en: "You told us",
      hi: "आपने बताया",
      te: "మీరు చెప్పినది",
      ta: "நீங்கள் கூறியது",
      kn: "ನೀವು ಹೇಳಿದ್ದು",
      mr: "तुम्ही सांगितलेले",
      bn: "আপনি যা বলেছেন",
      pa: "ਤੁਹਾਡਾ ਬਿਆਨ",
    },
    cls: "border-stone-200 bg-stone-100 text-stone-700",
  },
};

const CONFIRMATION_NOTE: Record<Lang, string> = {
  en: "Official confirmation can take some time.",
  hi: "आधिकारिक पुष्टि में कुछ समय लग सकता है।",
  te: "అధికారిక నిర్ధారణకు కొంత సమయం పట్టవచ్చు.",
  ta: "அதிகாரப்பூர்வ உறுதிப்படுத்தலுக்கு சிறிது நேரம் ஆகலாம்.",
  kn: "ಅಧಿಕೃತ ದೃಢೀಕರಣಕ್ಕೆ ಸ್ವಲ್ಪ ಸಮಯ ಹಿಡಿಯಬಹುದು.",
  mr: "अधिकृत पुष्टीसाठी थोडा वेळ लागू शकतो.",
  bn: "অফিসিয়াল নিশ্চিতকরণের জন্য কিছু সময় লাগতে পারে।",
  pa: "ਅਧਿਕਾਰਤ ਪੁਸ਼ਟੀ ਲਈ ਕੁਝ ਸਮਾਂ ਲੱਗ ਸਕਦਾ ਹੈ।",
};

function timeLabel(iso: string, lang: Lang): string {
  const d = new Date(iso);
  const now = new Date();
  const t = CASE_PAGE_COPY[lang] ?? CASE_PAGE_COPY.en;
  const time = d.toLocaleTimeString(t.locale, { hour: "numeric", minute: "2-digit" });
  if (d.toDateString() === now.toDateString()) return `${t.todayPrefix}, ${time}`;
  const date = d.toLocaleDateString(t.locale, { day: "numeric", month: "short" });
  return `${date}, ${time}`;
}

export default function CasePage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CaseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = getStoredLanguage();
    if (stored) {
      setLang(stored);
    }
  }, []);
  const cp = CASE_PAGE_COPY[lang] ?? CASE_PAGE_COPY.en;
  const [auto, setAuto] = useState(false);
  const [busy, setBusy] = useState(false);
  const [changed, setChanged] = useState<{ en: string; hi: string } | null>(null);
  const [pushNotification, setPushNotification] = useState<{
    title: string;
    body: string;
    type?: "update" | "prompt_phone" | "subscribed";
  } | null>(null);

  const [showDisputeInput, setShowDisputeInput] = useState(false);
  const [disputeText, setDisputeText] = useState("");
  const [regInput, setRegInput] = useState("");
  const [linkingReg, setLinkingReg] = useState(false);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [copiedGrievance, setCopiedGrievance] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechLoading, setIsSpeechLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Proactive notification channel subscription
  const [phoneInput, setPhoneInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Guided Demo Walkthrough states
  const [highlightSection, setHighlightSection] = useState<string | null>(null);
  const [demoStatusText, setDemoStatusText] = useState<{ en: string; hi: string } | null>(null);
  const [isTypingPhone, setIsTypingPhone] = useState(false);
  const [autoGrievance, setAutoGrievance] = useState<{
    token: string;
    submittedAt: string;
    department: string;
    status: string;
  } | null>(null);
  const [isSubmittingGrievance, setIsSubmittingGrievance] = useState(false);
  const isPlayingMagicRef = useRef(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cursor, setCursor] = useState<{
    visible: boolean;
    x: number;
    y: number;
    clicking: boolean;
    label?: string | null;
  }>({ visible: false, x: 0, y: 0, clicking: false, label: null });

  const [timeLapse, setTimeLapse] = useState<{
    active: boolean;
    daysText: Record<Lang, string> | string;
    title: Record<Lang, string> | string;
    description: Record<Lang, string> | string;
  } | null>(null);

  useEffect(() => {
    if (pushNotification) {
      // Give more time (12s) if asking to enter phone number so user can type comfortably
      const delay = pushNotification.type === "prompt_phone" ? 12000 : 5500;
      const t = setTimeout(() => {
        setPushNotification(null);
      }, delay);
      return () => clearTimeout(t);
    }
  }, [pushNotification]);

  /** Stop any currently playing audio */
  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsSpeechLoading(false);
  }

  /** Haptic feedback via Vibration API — silently ignored on unsupported devices */
  function haptic(strength: "light" | "medium" | "heavy" = "light") {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      const ms: Record<string, number> = { light: 8, medium: 18, heavy: 35 };
      try { navigator.vibrate(ms[strength] ?? 8); } catch { /* noop */ }
    }
  }

  /**
   * Speaks the exact case summary currently visible on screen.
   * Matches the user's active language and current case state with 100% precision.
   */
  async function speakCaseSummary(caseData: {
    title: string;
    why: string;
    action: string;
    actionRequired: boolean;
    documents?: string[];
    whatsappPrompt?: boolean;
    journeyId?: string;
  }) {
    if (isSpeaking || isSpeechLoading) {
      stopAudio();
      return;
    }

    setIsSpeechLoading(true);

    // Build the exact spoken text corresponding to what is on the screen right now
    const textPieces = [
      caseData.title,
      caseData.why,
      caseData.actionRequired
        ? caseData.action
          ? (lang === "hi" ? `आपकी कार्रवाई: ${caseData.action}` : `Your action: ${caseData.action}`)
          : ""
        : lang === "hi"
        ? "वर्तमान में आपकी ओर से किसी कार्रवाई की आवश्यकता नहीं है — सिस्टम प्रोसेस कर रहा है।"
        : "No action required from you right now — the system is processing your case.",
    ].filter(Boolean);

    const fullSpokenText = textPieces.join(". ");

    // 1. Try Browser Native SpeechSynthesis (Instant, 100% exact text match, zero server lag)
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(fullSpokenText);
        
        const langMap: Record<string, string> = {
          en: "en-IN",
          hi: "hi-IN",
          te: "te-IN",
          ta: "ta-IN",
          kn: "kn-IN",
          mr: "mr-IN",
          bn: "bn-IN",
          pa: "pa-IN",
        };
        utterance.lang = langMap[lang] || "en-IN";
        utterance.rate = 0.95;

        utterance.onstart = () => {
          setIsSpeechLoading(false);
          setIsSpeaking(true);
        };
        utterance.onend = () => stopAudio();
        utterance.onerror = () => stopAudio();

        window.speechSynthesis.speak(utterance);
        return;
      } catch (err) {
        console.warn("[speechSynthesis] Native speech fallback", err);
      }
    }

    // 2. Try Dynamic Server TTS API if available
    try {
      const res = await fetch("/api/sarvam/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: caseData.title,
          why: caseData.why,
          action: caseData.action,
          actionRequired: caseData.actionRequired,
          documents: caseData.documents,
          whatsappPrompt: caseData.whatsappPrompt,
          lang,
        }),
      });

      if (res.ok) {
        const json = (await res.json()) as { audio?: string };
        if (json.audio) {
          const byteCharacters = atob(json.audio);
          const byteArray = new Uint8Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
          }
          const blob = new Blob([byteArray], { type: "audio/wav" });
          const url = URL.createObjectURL(blob);

          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => { stopAudio(); URL.revokeObjectURL(url); };
          audio.onerror = () => { stopAudio(); URL.revokeObjectURL(url); };

          setIsSpeechLoading(false);
          setIsSpeaking(true);
          void audio.play();
          return;
        }
      }
    } catch (err) {
      console.error("[speakCaseSummary] Server TTS fallback error", err);
    }

    setIsSpeechLoading(false);
  }

  const prevState = useRef<string | null>(null);
  const firstLoad = useRef(true);
  const mounted = useRef(true);
  // Track consecutive failures — only show error after 3 in a row
  const failCount = useRef(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/cases/${id}`);
      if (!res.ok) {
        failCount.current += 1;
        // Only show error if: this is the first ever load (no data yet) AND it's a genuine 404,
        // OR we've had 5+ consecutive failures (persistent server problem).
        if (res.status === 404 && firstLoad.current) {
          // Definitive case not found — show error immediately
          setError(cp.caseNotFound);
          setData(null);
        } else if (failCount.current >= 5 && !firstLoad.current) {
          // Persistent server problem after data was already loaded — show gentle error
          // but don't wipe data (keep showing what we had)
          setError(cp.caseLoadError);
        }
        // Otherwise: transient hiccup — silently ignore, keep showing existing data
        return;
      }

      // Success — reset failure counter
      failCount.current = 0;

      const json = (await res.json()) as { case: CaseDTO };
      const next = json.case;
      if (!mounted.current) return;

      // Clear any stale error now that we have fresh data
      setError(null);

      if (firstLoad.current) {
        firstLoad.current = false;
        prevState.current = next.currentState;
        setData(next);
        return;
      }

      if (prevState.current && prevState.current !== next.currentState) {
        setChanged({
          en: `Status updated: ${next.title.en}`,
          hi: `स्थिति अपडेट हुई: ${next.title.hi}`,
        });
        const targetPhone = phoneInput || "98765 43210";
        setPushNotification({
          title: lang === "hi" 
            ? `व्हाट्सएप अलर्ट · +91 ${targetPhone}` 
            : `WhatsApp Alert · +91 ${targetPhone}`,
          body: lang === "hi" 
            ? `केस #${next.id}: ${next.title.hi}। ${next.yourAction.required ? "आपकी कार्रवाई आवश्यक है।" : "कोई कदम उठाने की आवश्यकता नहीं है — सिस्टम प्रोसेस कर रहा है।"}`
            : `Case #${next.id}: ${next.title.en}. ${next.yourAction.required ? "Action required from you." : "No action required from you — system is processing."}`,
        });
      }
      prevState.current = next.currentState;
      setData(next);
    } catch {
      // Network-level failure (fetch itself threw) — treat same as non-ok response
      if (mounted.current) {
        failCount.current += 1;
        if (failCount.current >= 5 && !firstLoad.current) {
          setError(cp.caseLoadError);
        }
        // If data is already loaded, silently ignore transient network errors
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, lang, phoneInput]);

  useEffect(() => {
    mounted.current = true;
    failCount.current = 0;
    firstLoad.current = true;
    setLang((localStorage.getItem("raasta_lang") as Lang) ?? "en");
    load();
    const t = setInterval(load, 8000);
    return () => {
      mounted.current = false;
      clearInterval(t);
    };
  }, [load]);

  async function doAction(actionId: string) {
    if (busy) return;
    setBusy(true);
    try {
      await fetch(`/api/cases/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId }),
      });
      const phone = phoneInput.trim();
      if (isSubscribed && phone) {
        setPushNotification({
          title: lang === "hi" ? `व्हाट्सएप अपडेट · +91 ${phone}` : `WhatsApp Update · +91 ${phone}`,
          body: lang === "hi" 
            ? "आपकी कार्रवाई दर्ज हो गई है। आधिकारिक पुष्टि की प्रतीक्षा की जा रही है।"
            : "Your action was recorded. Waiting for official central confirmation.",
          type: "update",
        });
      } else {
        setPushNotification({
          title: lang === "hi" ? "कार्रवाई दर्ज · व्हाट्सएप अलर्ट सक्रिय करें" : "Action Recorded · Enable WhatsApp Alerts",
          body: lang === "hi" 
            ? "आपकी कार्रवाई दर्ज हो गई है। जब अगला सरकारी सिग्नल आए तो व्हाट्सएप पर तुरंत अपडेट पाने के लिए नंबर दर्ज करें:"
            : "Your action was recorded. Enter your number below to get live WhatsApp notifications when the next official signal arrives:",
          type: "prompt_phone",
        });
      }
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function submitLinkReg() {
    if (!regInput.trim() || regInput.trim().length !== 11 || linkingReg) return;
    setLinkingReg(true);
    try {
      const res = await fetch(`/api/cases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber: regInput.trim() }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.case) setData(json.case);
        setPushNotification({
          title: cp.linkRegSuccess,
          body: `${cp.linkRegPlaceholder}: ${regInput.trim()}`,
          type: "update",
        });
      }
    } catch {
      // ignore
    } finally {
      setLinkingReg(false);
    }
  }

  async function submitDispute() {
    if (!disputeText.trim() || busy) return;
    setBusy(true);
    try {
      await fetch(`/api/cases/${id}/dispute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statement: disputeText.trim() }),
      });
      setDisputeText("");
      setShowDisputeInput(false);
      await load();
    } finally {
      setBusy(false);
    }
  }

  function copyGrievance(text: string) {
    void navigator.clipboard.writeText(text);
    setCopiedGrievance(true);
    setTimeout(() => setCopiedGrievance(false), 2500);
  }

  const submitAutonomousGrievance = useCallback(async () => {
    if (isSubmittingGrievance || autoGrievance) return;
    setIsSubmittingGrievance(true);
    await new Promise((r) => setTimeout(r, 1100));
    const token = `CPGRAMS/2026/PMKISAN/${Math.floor(10000 + Math.random() * 90000)}-A`;
    const record = {
      token,
      submittedAt: new Date().toISOString(),
      department: "Ministry of Agriculture and Farmers Welfare (PM-KISAN Nodal Cell)",
      status: "UNDER_OFFICIAL_NODAL_INVESTIGATION",
    };
    setAutoGrievance(record);
    setIsSubmittingGrievance(false);

    setPushNotification({
      title: lang === "hi" ? "शिकायत दर्ज · CPGRAMS" : "Grievance Dispatched · CPGRAMS",
      body: lang === "hi"
        ? `टोकन #${token}: आपकी शिकायत सीधे मंत्रालय नोडल अधिकारी को भेज दी गई है।`
        : `Token #${token}: Neutral grievance auto-dispatched to Ministry Nodal Cell on your behalf.`,
    });
  }, [isSubmittingGrievance, autoGrievance, lang]);

  const resetCase = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/cases/${id}/reset`, { method: "POST" });
      if (res.ok) {
        const json = await res.json();
        if (json.case) setData(json.case);
        setShowConfetti(false);
        setAuto(false);
        setHighlightSection(null);
        setDemoStatusText(null);
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    } finally {
      setBusy(false);
    }
  }, [id]);

  async function moveCursorToElement(elemId: string, label?: string) {
    if (typeof window === "undefined") return;
    const el = document.getElementById(elemId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    await new Promise((r) => setTimeout(r, 450));
    const rect = el.getBoundingClientRect();
    setCursor({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      clicking: false,
      label: label || null,
    });
    await new Promise((r) => setTimeout(r, 700));
    setCursor((prev) => ({ ...prev, clicking: true }));
    await new Promise((r) => setTimeout(r, 220));
    setCursor((prev) => ({ ...prev, clicking: false }));
    await new Promise((r) => setTimeout(r, 250));
  }

  const playMagicDemo = useCallback(async () => {
    if (auto) {
      isPlayingMagicRef.current = false;
      setAuto(false);
      setHighlightSection(null);
      setDemoStatusText(null);
      setCursor({ visible: false, x: 0, y: 0, clicking: false, label: null });
      setTimeLapse(null);
      return;
    }

    isPlayingMagicRef.current = true;
    setAuto(true);
    setShowConfetti(false);

    try {
      // -----------------------------------------------------------------
      // STAGE 1: Real-time pointer glide & phone number typing
      // -----------------------------------------------------------------
      if (!isSubscribed) {
        setHighlightSection("whatsapp");
        setDemoStatusText({
          en: "Step 1/4: Connecting citizen phone (+91 98765 43210) to live recovery daemon...",
          hi: "चरण 1/4: नागरिक के फोन (+91 98765 43210) को लाइव रिकवरी एजेंट से जोड़ा जा रहा है...",
        });

        // 1. Move virtual cursor to WhatsApp input
        await moveCursorToElement("whatsapp-subscription-card", "Typing Phone Number...");

        setIsTypingPhone(true);
        setPhoneInput("");
        const targetPhone = "9876543210";
        for (let i = 1; i <= targetPhone.length; i++) {
          if (!isPlayingMagicRef.current) return;
          await new Promise((r) => setTimeout(r, 65));
          setPhoneInput(targetPhone.slice(0, i));
        }
        setIsTypingPhone(false);

        // 2. Move virtual cursor to submit button & click
        await moveCursorToElement("whatsapp-submit-btn", "Enabling WhatsApp Alerts...");
        setIsSubscribed(true);
        setCursor((prev) => ({ ...prev, visible: false }));

        // Deliver instant WhatsApp Welcome Alert
        setPushNotification({
          title: lang === "hi" 
            ? "📱 व्हाट्सएप अलर्ट सक्रिय (+91 98765 43210)" 
            : "📱 WhatsApp Alerts Connected (+91 98765 43210)",
          body: lang === "hi"
            ? `केस #${data?.id || ""}: लाइव ट्रैकिंग शुरू हो गई है। सरकारी सिग्नल्स का पहला अपडेट भेजा जा रहा है।`
            : `Case #${data?.id || ""}: Live recovery tracking connected. Initial state check dispatching to WhatsApp.`,
        });

        await new Promise((r) => setTimeout(r, 1800));
      }

      // -----------------------------------------------------------------
      // MULTI-STEP PROGRESSION LOOP WITH VIRTUAL CURSOR & TIME-LAPSE
      // -----------------------------------------------------------------
      let loopCount = 0;
      while (isPlayingMagicRef.current && loopCount < 8) {
        loopCount++;

        // 1. Fetch freshest case snapshot
        const checkRes = await fetch(`/api/cases/${id}`);
        if (!checkRes.ok) break;
        const checkJson = (await checkRes.json()) as { case: CaseDTO };
        const currentCase = checkJson.case;
        setData(currentCase);

        // Check if resolved / credited
        if (currentCase.stateCategory === "resolved" || currentCase.demo?.complete) {
          setHighlightSection("resolution");
          setShowConfetti(true);
          setCursor((prev) => ({ ...prev, visible: false }));
          setDemoStatusText({
            en: "🎉 Relief settled! ₹2,000 credit confirmed into bank account.",
            hi: "🎉 राहत राशि जमा! ₹2,000 बैंक खाते में ट्रांसफर हो गए हैं।",
          });
          if (typeof window !== "undefined") {
            document.getElementById("resolution-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
          }

          setPushNotification({
            title: lang === "hi"
              ? "🎉 व्हाट्सएप अंतिम सूचना (4/4 समाधान)"
              : "🎉 WhatsApp Final Alert (4/4 Resolved)",
            body: lang === "hi"
              ? `₹2,000 पीएम-किसान आपके स्टेट बैंक खाते में जमा कर दिए गए हैं (UTR: DEMO-UTR-2026-0001)। केस पूरा हुआ।`
              : `₹2,000 PM-KISAN successfully credited to your State Bank of India account (UTR: DEMO-UTR-2026-0001). Case settled.`,
          });

          await new Promise((r) => setTimeout(r, 4500));

          // Auto-return to the initial Solution Page (Step 1/4) so the page is ready and actionable again
          try {
            const resetRes = await fetch(`/api/cases/${id}/reset`, { method: "POST" });
            if (resetRes.ok) {
              const resetJson = await resetRes.json();
              if (resetJson.case) setData(resetJson.case);
            }
          } catch {}

          setShowConfetti(false);
          setAuto(false);
          setHighlightSection(null);
          setDemoStatusText(null);
          isPlayingMagicRef.current = false;
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          break;
        }

        // 2. If Citizen Action required (e.g. e-KYC or Grievance)
        if (currentCase.yourAction.required && currentCase.yourAction.action) {
          setHighlightSection("action");
          setDemoStatusText({
            en: `Step ${currentCase.demo?.step ?? 1}/${currentCase.demo?.totalSteps ?? 4}: Performing citizen requirement on portal...`,
            hi: `चरण ${currentCase.demo?.step ?? 1}/${currentCase.demo?.totalSteps ?? 4}: पोर्टल पर नागरिक प्रक्रिया पूरी की जा रही है...`,
          });

          // Move cursor directly to the action button with visible click wave
          await moveCursorToElement("action-btn", "Clicking 'I Completed This Step'...");
          if (!isPlayingMagicRef.current) return;

          // Complete action on behalf of citizen
          await fetch(`/api/cases/${id}/action`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ actionId: currentCase.yourAction.action.id }),
          });
          setCursor((prev) => ({ ...prev, visible: false }));

          // ⏳ Time-Lapse Pop-up Card: 3 Days Later (Biometric Sync)
          setTimeLapse({
            active: true,
            daysText: {
              en: "⏳ 3 Days Later",
              hi: "⏳ 3 दिन बाद",
              te: "⏳ 3 రోజుల తర్వాత",
              ta: "⏳ 3 நாட்களுக்குப் பிறகு",
              kn: "⏳ 3 ದಿನಗಳ ನಂತರ",
              mr: "⏳ 3 दिवसांनंतर",
              bn: "⏳ ৩ দিন পরে",
              pa: "⏳ 3 ਦਿਨਾਂ ਬਾਅਦ",
            },
            title: {
              en: "Biometric e-KYC Sync & Verification",
              hi: "बायोमेट्रिक ई-केवाईसी सिंक और सत्यापन",
              te: "బయోమెట్రిక్ ఇ-కెవైసి సింక్ & ధృవీకరణ",
              ta: "பயோமெட்ரிக் இ-கேஒய்சி சரிபார்ப்பு",
              kn: "ಬಯೋಮೆಟ್ರಿಕ್ ಇ-ಕೆವೈಸಿ ಪರಿಶೀಲನೆ",
              mr: "बायोमेट्रिक ई-केवायसी पडताळणी",
              bn: "বায়োমেট্রিক ই-কেওয়াইসি যাচাইকরণ",
              pa: "ਬਾਇਓਮੈਟ੍ਰਿਕ ਈ-ਕੇਵਾਈਸੀ ਤਸਦੀਕ",
            },
            description: {
              en: "CSC operator biometric log synced with UIDAI and Central PM-KISAN Portal.",
              hi: "सीएससी बायोमेट्रिक रिकॉर्ड यूआईडीएआई एवं पीएम-किसान केंद्रीय पोर्टल पर सत्यापित।",
              te: "CSC కేంద్రం బయోమెట్రిక్ రికార్డు UIDAI మరియు PM-KISAN పోర్టల్లో ధృవీకరించబడింది.",
              ta: "CSC பயோமெட்ரிக் பதிவு UIDAI மற்றும் PM-KISAN போர்ட்டலில் சரிபார்க்கப்பட்டது.",
              kn: "CSC ಬಯೋಮೆಟ್ರಿಕ್ ದಾಖಲೆಯು UIDAI ಮತ್ತು PM-KISAN ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿದೆ.",
              mr: "सीएससी बायोमेट्रिक नोंदणी यूआयडीएआय व पीएम-किसान पोर्टलवर पडताळली गेली.",
              bn: "সিএসসি বায়োমেট্রিক রেকর্ড ইউআইডিএআই এবং পিএম-কিসান পোর্টালে যাচাই সম্পন্ন।",
              pa: "ਸੀਐਸਸੀ ਬਾਇਓਮੈਟ੍ਰਿਕ ਰਿਕਾਰਡ UIDAI ਅਤੇ PM-KISAN ਪੋਰਟਲ 'ਤੇ ਤਸਦੀਕ ਹੋ ਗਿਆ।",
            },
          });

          await new Promise((r) => setTimeout(r, 2400));
          setTimeLapse(null);

          // Dispatch citizen action WhatsApp notification
          setPushNotification({
            title: lang === "hi"
              ? `📱 व्हाट्सएप अपडेट (3 दिन बाद · चरण ${currentCase.demo?.step ?? 1}/${currentCase.demo?.totalSteps ?? 4})`
              : `📱 WhatsApp Update (3 Days Later · Step ${currentCase.demo?.step ?? 1}/${currentCase.demo?.totalSteps ?? 4})`,
            body: lang === "hi"
              ? `✅ नागरिक कार्रवाई दर्ज: बायोमेट्रिक ई-केवाईसी पूर्ण। सरकारी पोर्टल पर पुष्टि दर्ज।`
              : `✅ Action recorded: Requirement submitted. Awaiting central nodal confirmation.`,
          });

          await new Promise((r) => setTimeout(r, 1600));
        }

        // 3. Inject next official government signal
        if (!isPlayingMagicRef.current) return;
        setHighlightSection("baton");
        const currentStep = currentCase.demo?.step ?? 1;
        const totalSteps = currentCase.demo?.totalSteps ?? 4;
        const nextStep = Math.min(totalSteps, currentStep + 1);

        if (nextStep === 3) {
          // ⏳ Time-Lapse Pop-up Card: 2 Days Later (State Nodal Review)
          setTimeLapse({
            active: true,
            daysText: {
              en: "⏳ 2 Days Later",
              hi: "⏳ 2 दिन बाद",
              te: "⏳ 2 రోజుల తర్వాత",
              ta: "⏳ 2 நாட்களுக்குப் பிறகு",
              kn: "⏳ 2 ದಿನಗಳ ನಂತರ",
              mr: "⏳ 2 दिवसांनंतर",
              bn: "⏳ ২ দিন পরে",
              pa: "⏳ 2 ਦਿਨਾਂ ਬਾਅਦ",
            },
            title: {
              en: "State Nodal Land Record Clearance",
              hi: "राज्य नोडल भूमि रिकॉर्ड स्वीकृति",
              te: "రాష్ట్ర నోడల్ భూ రికార్డుల ఆమోదం",
              ta: "மாநில நோடல் நிலப் பதிவு அனுமதி",
              kn: "ರಾಜ್ಯ ನೋಡಲ್ ಭೂ ದಾಖಲೆ ಅನುಮೋದನೆ",
              mr: "राज्य नोडल जमीन नोंद मंजुरी",
              bn: "রাজ্য নোডাল জমি রেকর্ড অনুমোদন",
              pa: "ਰਾਜ ਨੋਡਲ ਜ਼ਮੀਨੀ ਰਿਕਾਰਡ ਮਨਜ਼ੂਰੀ",
            },
            description: {
              en: "District Agriculture Officer cleared eligibility audit and forwarded batch to PFMS Treasury.",
              hi: "जिला कृषि अधिकारी ने पात्रता जांच पूरी कर बैच को पीएफएमएस ट्रेजरी को भेजा।",
              te: "జిల్లా వ్యవసాయ అధికారి అర్హత పరిశీలన పూర్తి చేసి PFMS ట్రెజరీకి పంపారు.",
              ta: "மாவட்ட வேளாண் அதிகாரி தகுதி தணிக்கையை முடித்து PFMS கருவூலத்திற்கு அனுப்பினார்.",
              kn: "ಜಿಲ್ಲಾ ಕೃಷಿ ಅಧಿಕಾರಿಯು ಅರ್ಹತಾ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಳಿಸಿ PFMS ಖಜಾನೆಗೆ ಕಳುಹಿಸಿದ್ದಾರೆ.",
              mr: "जिल्हा कृषी अधिकाऱ्यांनी पात्रता तपासणी पूर्ण करून तुकडी पीएफएमएसकडे पाठवली.",
              bn: "জেলা কৃষি আধিকারিক যোগ্যতা যাচাই সম্পন্ন করে পিএফএমএস ট্রেজারিতে পাঠালেন।",
              pa: "ਜ਼ਿਲ੍ਹਾ ਖੇਤੀਬਾੜੀ ਅਧਿਕਾਰੀ ਨੇ ਯੋਗਤਾ ਜਾਂਚ ਪੂਰੀ ਕਰਕੇ ਬੈਚ PFMS ਨੂੰ ਭੇਜਿਆ।",
            },
          });
          await new Promise((r) => setTimeout(r, 2400));
          setTimeLapse(null);
        } else if (nextStep === 4) {
          // ⏳ Time-Lapse Pop-up Card: 24 Hours Later (DBT Release)
          setTimeLapse({
            active: true,
            daysText: {
              en: "⏳ 24 Hours Later",
              hi: "⏳ 24 घंटे बाद",
              te: "⏳ 24 గంటల తర్వాత",
              ta: "⏳ 24 மணி நேரத்திற்குப் பிறகு",
              kn: "⏳ 24 ಗಂಟೆಗಳ ನಂತರ",
              mr: "⏳ 24 तासांनंतर",
              bn: "⏳ ২৪ ঘণ্টা পরে",
              pa: "⏳ 24 ਘੰਟਿਆਂ ਬਾਅਦ",
            },
            title: {
              en: "PFMS Direct Treasury Transfer",
              hi: "पीएफएमएस डायरेक्ट ट्रेजरी ट्रांसफर",
              te: "PFMS ప్రత్యక్ష ట్రెజరీ బదిలీ",
              ta: "PFMS நேரடி கருவூலப் பரிமாற்றம்",
              kn: "PFMS ನೇರ ಖಜಾನೆ ವರ್ಗಾವಣೆ",
              mr: "पीएफएमएस थेट ट्रेझरी ट्रान्सफर",
              bn: "পিএফএমএস সরাসরি ট্রেজারি হস্তান্তর",
              pa: "PFMS ਸਿੱਧਾ ਖਜ਼ਾਨਾ ਤਬਾਦਲਾ",
            },
            description: {
              en: "Central PFMS issued DBT payment mandate to State Bank of India gateway.",
              hi: "केंद्रीय पीएफएमएस ने स्टेट बैंक गेटवे को ₹2,000 डीबीटी भुगतान आदेश जारी किया।",
              te: "కేంద్ర PFMS స్టేట్ బ్యాంక్ గేట్‌వేకు ₹2,000 DBT బదిలీ ఆదేశాలు జారీ చేసింది.",
              ta: "மத்திய PFMS ஸ்டேட் வங்கி நுழைவாயிலுக்கு ₹2,000 DBT கட்டண ஆணையை வழங்கியது.",
              kn: "ಕೇಂದ್ರ PFMS ಸ್ಟೇಟ್ ಬ್ಯಾಂಕ್ ಗೇಟ್‌ವೇಗೆ ₹2,000 DBT ಪಾವತಿ ಆದೇಶ ನೀಡಿದೆ.",
              mr: "केंद्रीय पीएफएमएसने स्टेट बँक गेटवेला ₹2,000 डीबीटी पेमेंट आदेश जारी केला.",
              bn: "কেন্দ্রীয় পিএফএমএস স্টেট ব্যাংক গেটওয়েতে ₹২,০০০ ডিবিটি পেমেন্ট নির্দেশ পাঠাল।",
              pa: "ਕੇਂਦਰੀ PFMS ਨੇ ਸਟੇਟ ਬੈਂਕ ਗੇਟਵੇ ਨੂੰ ₹2,000 DBT ਭੁਗਤਾਨ ਆਦੇਸ਼ ਜਾਰੀ ਕੀਤਾ।",
            },
          });
          await new Promise((r) => setTimeout(r, 2400));
          setTimeLapse(null);
        }

        if (typeof window !== "undefined") {
          document.getElementById("baton-rail")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        const simRes = await fetch(`/api/cases/${id}/simulate-signal`, { method: "POST" });
        const simJson = await simRes.json();
        if (simJson.case) {
          setData(simJson.case);

          if (simJson.case.stateCategory === "resolved" || simJson.case.demo?.complete) {
            setHighlightSection("resolution");
            setShowConfetti(true);
            setDemoStatusText({
              en: "🎉 Relief settled! ₹2,000 credit confirmed into bank account.",
              hi: "🎉 राहत राशि जमा! ₹2,000 बैंक खाते में ट्रांसफर हो गए हैं।",
            });
            if (typeof window !== "undefined") {
              document.getElementById("resolution-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
            }

            setPushNotification({
              title: lang === "hi"
                ? "🎉 व्हाट्सएप अंतिम सूचना (4/4 समाधान)"
                : "🎉 WhatsApp Final Alert (4/4 Resolved)",
              body: lang === "hi"
                ? `₹2,000 पीएम-किसान आपके स्टेट बैंक खाते में जमा कर दिए गए हैं (UTR: DEMO-UTR-2026-0001)। केस पूरा हुआ।`
                : `₹2,000 PM-KISAN successfully credited to your State Bank of India account (UTR: DEMO-UTR-2026-0001). Case settled.`,
            });

            await new Promise((r) => setTimeout(r, 3500));
            setAuto(false);
            isPlayingMagicRef.current = false;
            break;
          }

          setPushNotification({
            title: lang === "hi"
              ? `📱 व्हाट्सएप अपडेट (चरण ${simJson.case.demo?.step ?? nextStep}/${totalSteps})`
              : `📱 WhatsApp Update (Step ${simJson.case.demo?.step ?? nextStep}/${totalSteps})`,
            body: lang === "hi"
              ? `सरकारी सिग्नल प्राप्त: ${simJson.case.title.hi}। अगला चरण प्रोसेस हो रहा है।`
              : `Official Signal Received: ${simJson.case.title.en}. Next stage processing.`,
          });
        }

        await new Promise((r) => setTimeout(r, 2200));
      }
    } finally {
      setAuto(false);
      isPlayingMagicRef.current = false;
      setCursor({ visible: false, x: 0, y: 0, clicking: false, label: null });
      setTimeLapse(null);
    }
  }, [auto, isSubscribed, id, lang, data?.id]);

  useEffect(() => {
    if (!changed) return;
    const t = setTimeout(() => setChanged(null), 4500);
    return () => clearTimeout(t);
  }, [changed]);

  function setLanguage(l: Lang) {
    setLang(l);
    setStoredLanguage(l);
  }

  const t = (o: string | Record<string, string> | null | undefined) => {
    if (!o) return "";
    if (typeof o === "string") return o;
    return o[lang] ?? (lang === "hi" ? o.hi : o.en) ?? o.en ?? "";
  };

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <Link
            href="/"
            className="group relative flex h-8 w-8 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-2xl border border-stone-200/80 bg-stone-100/80 text-stone-700 shadow-2xs transition-all duration-200 ease-out hover:scale-105 hover:bg-stone-200/80 active:scale-95 active:bg-stone-300/80 focus:outline-none focus:ring-2 focus:ring-stone-400/40"
            title={cp.backToCheck}
          >
            <ArrowLeftIcon className="h-4 w-4 text-stone-700 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
          </Link>
          <div className="flex items-center gap-2">
            <RaastaLogoEmblem size="sm" />
            <p className="text-xs font-bold uppercase tracking-wider text-stone-900 truncate">
              {cp.schemeTitle}
            </p>
          </div>
          <LanguageSwitcher lang={lang} onChange={setLanguage} />
        </div>

        <div className="mt-10 rounded-3xl border border-stone-200/80 bg-white p-8 sm:p-10 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50/80 text-amber-800 border border-amber-200/70 shadow-2xs">
            <svg className="h-7 w-7 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <h1 className="mt-5 text-xl font-bold tracking-tight text-stone-950 sm:text-2xl">
            {error}
          </h1>
          <p className="mt-2.5 text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            {lang === "hi"
              ? "इस संदर्भ के लिए कोई सक्रिय रिकवरी रिकॉर्ड नहीं मिला। कृपया अपने 11-अंकीय नंबर की पुष्टि करें या नई जांच शुरू करें।"
              : "We couldn't locate an active recovery docket for this reference. Please check your 11-digit number or start a new inquiry."}
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-stone-800 active:scale-[0.98] w-full sm:w-auto cursor-pointer"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              <span>{cp.startNewCase}</span>
            </Link>
            <a
              href="https://pmkisan.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-stone-200 bg-stone-50 px-5 py-3 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950 active:scale-[0.98] w-full sm:w-auto"
            >
              <span>Official Portal</span>
              <span className="text-stone-400">↗</span>
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <Link
            href="/"
            className="group relative flex h-8 w-8 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-2xl border border-stone-200/80 bg-stone-100/80 text-stone-700 shadow-2xs transition-all duration-200 ease-out hover:scale-105 hover:bg-stone-200/80 active:scale-95 active:bg-stone-300/80 focus:outline-none focus:ring-2 focus:ring-stone-400/40"
            title={cp.backToCheck}
          >
            <ArrowLeftIcon className="h-4 w-4 text-stone-700 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
          </Link>
          <p className="text-xs font-bold uppercase tracking-wider text-stone-900 truncate">
            {cp.schemeTitle}
          </p>
          <LanguageSwitcher lang={lang} onChange={setLanguage} />
        </div>

        <div className="mt-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
          <p className="mt-4 text-sm font-medium text-stone-600 animate-pulse">{cp.openingCase}</p>
        </div>
      </main>
    );
  }

  const resolved = data.stateCategory === "resolved";

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Confetti active={resolved || showConfetti} />
      <VirtualCursor
        visible={cursor.visible}
        x={cursor.x}
        y={cursor.y}
        clicking={cursor.clicking}
        label={cursor.label}
      />
      {timeLapse && (
        <TimeLapseModal
          active={timeLapse.active}
          daysText={timeLapse.daysText}
          title={timeLapse.title}
          description={timeLapse.description}
          lang={lang}
        />
      )}

      {/* Apple Dynamic Island / Floating Toast — Pinned to viewport, always visible without scrolling */}
      {pushNotification && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-5 inset-x-0 mx-auto max-w-md z-50 px-4 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300 ease-out"
        >
          <div className="pointer-events-auto overflow-hidden rounded-2xl border border-stone-800/80 bg-stone-900/95 text-white p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:scale-[1.01]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                  <WhatsAppIcon className="h-3 w-3" />
                </span>
                <p className="text-[11px] font-semibold tracking-wide text-stone-300">
                  {pushNotification.title}
                </p>
              </div>
              <button
                onClick={() => setPushNotification(null)}
                aria-label="Dismiss alert"
                className="flex h-6 w-6 items-center justify-center rounded-full text-stone-400 hover:bg-stone-800 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-stone-200 pl-7">
              {pushNotification.body}
            </p>

            {/* Inline Quick Enable Phone Input if not yet subscribed */}
            {pushNotification.type === "prompt_phone" && !isSubscribed && (
              <div className="mt-3 flex items-center gap-2 pl-7">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-2 font-mono text-[11px] font-semibold text-stone-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98765 43210"
                    className="w-full rounded-xl border border-stone-700/80 bg-stone-800/90 py-1.5 pl-9 pr-3 font-mono text-xs text-white placeholder-stone-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const num = phoneInput.trim() || "9876543210";
                        setPhoneInput(num);
                        setIsSubscribed(true);
                        setPushNotification({
                          title: `${cp.whatsAppToastTitle} · +91 ${num}`,
                          body: `Case #${data?.id || ""}: ${cp.whatsAppToastBody}`,
                          type: "subscribed",
                        });
                      }
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    const num = phoneInput.trim() || "9876543210";
                    setPhoneInput(num);
                    setIsSubscribed(true);
                    setPushNotification({
                      title: `${cp.whatsAppToastTitle} · +91 ${num}`,
                      body: `Case #${data?.id || ""}: ${cp.whatsAppToastBody}`,
                      type: "subscribed",
                    });
                  }}
                  className="shrink-0 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-500 active:scale-95"
                >
                  {cp.whatsAppEnable}
                </button>
              </div>
            )}
          </div>
        </aside>
      )}

      {changed && !pushNotification && (
        <div className="mb-6 rounded-xl border border-stone-200 bg-stone-100/90 px-4 py-3 text-xs sm:text-sm font-medium text-stone-800">
          {cp.statusUpdatePrefix} {changed ? (typeof changed === "object" ? t(changed) : changed) : ""}
        </div>
      )}

      {/* Official Scheme Recovery Docket Header */}
      <div
        id="recovery-docket"
        className={`apple-card rounded-3xl p-6 sm:p-7 border border-stone-200/60 bg-white shadow-sm transition-all duration-700 ${
          highlightSection === "docket"
            ? "ring-2 ring-emerald-500 shadow-xl ring-offset-2 ring-offset-stone-50"
            : ""
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <Link
              href="/"
              className="group relative mt-0.5 flex h-8 w-8 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-2xl border border-stone-200/80 bg-stone-100/80 text-stone-700 shadow-2xs transition-all duration-200 ease-out hover:scale-105 hover:bg-stone-200/80 active:scale-95 active:bg-stone-300/80 focus:outline-none focus:ring-2 focus:ring-stone-400/40"
              title={cp.backToCheck}
            >
              <ArrowLeftIcon className="h-4 w-4 text-stone-700 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-900 truncate">
                {cp.schemeTitle}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-stone-400">
                <span>{cp.recoveryDocket} · {data.id}</span>
                {data.demo?.journeyName && (
                  <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-sans font-semibold text-stone-600">
                    {t(data.demo.journeyName)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                resolved
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                  : data.yourAction.required
                  ? "border border-rose-200 bg-rose-50 text-rose-800"
                  : "border border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  resolved
                    ? "bg-emerald-600"
                    : data.yourAction.required
                    ? "bg-rose-600 animate-pulse"
                    : "bg-amber-500 animate-pulse"
                }`}
              />
              <span>
                {resolved
                  ? cp.statusResolved
                  : data.yourAction.required
                  ? cp.statusActionRequired
                  : cp.statusWaiting}
              </span>
            </span>
            <LanguageSwitcher lang={lang} onChange={setLanguage} />
          </div>
        </div>

        {/* 1. What happened? — Hero Statement */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
              {cp.currentStatus}
            </p>
            <button
              type="button"
              onClick={() => {
                haptic("light");
                const reqDocs = data.yourAction?.action?.card?.requirements
                  ? data.yourAction.action.card.requirements
                      .map((r) => t(r as unknown as Record<string, string>))
                      .filter(Boolean)
                  : [];

                const jId =
                  data.demo?.journeyId ||
                  (data.stateCategory === "resolved"
                    ? "J4_NO_ACTION"
                    : data.yourAction.required
                    ? data.problemType === "PAYMENT_FAILURE"
                      ? "J3_PAYMENT_FAILURE"
                      : "J1_FARMER_EKYC"
                    : "J2_GOVT_VERIFICATION");

                void speakCaseSummary({
                  title: t(data.title),
                  why: t(data.why),
                  action: data.yourAction.required
                    ? (t(data.yourAction.text) || "")
                    : "",
                  actionRequired: data.yourAction.required,
                  documents: reqDocs,
                  whatsappPrompt: !isSubscribed,
                  journeyId: jId,
                });
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition active:scale-[0.97] ${
                isSpeaking
                  ? "bg-stone-900 text-white animate-pulse"
                  : isSpeechLoading
                  ? "bg-stone-600 text-white"
                  : "border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              {isSpeaking ? (
                <StopIcon className="h-3 w-3" />
              ) : isSpeechLoading ? (
                <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <SpeakerIcon className="h-3.5 w-3.5" />
              )}
              <span>
                {isSpeaking
                  ? cp.stopListening
                  : isSpeechLoading
                  ? { en: "Preparing…", hi: "तैयार हो रहा है…", te: "తయారవుతోంది…", ta: "தயாராகிறது…", kn: "ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ…", mr: "तयार होत आहे…", bn: "প্রস্তুত হচ্ছে…", pa: "ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ…" }[lang] ?? "Preparing…"
                  : cp.listenAudio}
              </span>
            </button>
          </div>

          <h1 className={`mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl ${resolved ? "status-green" : ""}`}>
            {t(data.title)}
          </h1>
          <p className="mt-2 text-base leading-relaxed text-stone-600 sm:text-lg">
            <GlossaryText text={t(data.why)} lang={lang} />
          </p>

          {!data.dispute && !resolved && (
            <div className="mt-3">
              <button
                onClick={() => setShowDisputeInput(!showDisputeInput)}
                className="text-xs font-medium text-stone-500 underline-offset-2 transition hover:text-stone-900 hover:underline active:scale-[0.98]"
              >
                {cp.disputePrompt}
              </button>
            </div>
          )}
        </div>

        {/* Dispute Capture Input */}
        {showDisputeInput && !data.dispute && (
          <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50/80 p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-700">
                {cp.disputeLabel}
              </p>
              <button
                type="button"
                onClick={() => {
                  const SpeechRecognition =
                    (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
                      .SpeechRecognition ||
                    (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
                      .webkitSpeechRecognition;
                  if (SpeechRecognition) {
                    try {
                      const recognition = new (SpeechRecognition as any)();
                      recognition.lang = cp.locale;
                      recognition.continuous = true;
                      recognition.interimResults = true;
                      let silenceTimer: NodeJS.Timeout | null = null;
                      recognition.onresult = (e: any) => {
                        let live = "";
                        for (let i = 0; i < e.results.length; i++) {
                          live += e.results[i][0].transcript;
                        }
                        if (live.trim()) setDisputeText(live.trim());
                        if (silenceTimer) clearTimeout(silenceTimer);
                        silenceTimer = setTimeout(() => {
                          try { recognition.stop(); } catch {}
                        }, 4000);
                      };
                      recognition.start();
                      return;
                    } catch {
                      // fall through
                    }
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-semibold text-stone-800 shadow-2xs hover:bg-stone-100 active:scale-[0.97]"
              >
                <MicIcon className="h-3.5 w-3.5" />
                <span>{cp.disputeTapSpeak}</span>
              </button>
            </div>
            <textarea
              rows={2}
              value={disputeText}
              onChange={(e) => setDisputeText(e.target.value)}
              placeholder={cp.disputePlaceholder}
              className="mt-2 w-full rounded-xl border border-stone-300 bg-white p-3 text-sm outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowDisputeInput(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:text-stone-900 active:scale-[0.98]"
              >
                {cp.disputeCancel}
              </button>
              <button
                onClick={() => void submitDispute()}
                disabled={!disputeText.trim() || busy}
                className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-stone-800 active:scale-[0.98] disabled:opacity-50"
              >
                {busy ? "…" : cp.disputeSubmit}
              </button>
            </div>
          </div>
        )}

        {/* Structured Disagreement View (OFFICIAL vs YOU) */}
        {data.dispute && (
          <div className="mt-4 rounded-2xl border border-amber-200/90 bg-amber-50/50 p-4.5 text-sm shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900">
                <ScaleIcon className="h-4 w-4 text-amber-900" />
                <span>{cp.disputeRecordedTitle}</span>
              </div>
              <span className="rounded-full border border-amber-300 bg-amber-100/70 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                {cp.disputeVerifiedBadge}
              </span>
            </div>

            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              <div className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-2xs">
                <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-stone-600 uppercase">
                  {cp.disputeOfficialRecord}
                </span>
                <p className="mt-1.5 text-xs leading-relaxed text-stone-700">{t(data.dispute.officialClaim)}</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-white p-3.5 shadow-2xs">
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-900 uppercase">
                  {cp.disputeYouToldUs}
                </span>
                <p className="mt-1.5 text-xs font-medium leading-relaxed text-stone-900">{t(data.dispute.citizenStatement)}</p>
              </div>
            </div>

            {/* Autonomous Grievance Auto-Submission Module */}
            <div className="mt-3.5 border-t border-amber-200/70 pt-3">
              {autoGrievance ? (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50/90 p-3.5 text-xs text-emerald-950 shadow-2xs animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-800 text-[11px]">
                      <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                      {cp.grievanceAutoSubmitted}
                    </span>
                    <span className="rounded bg-emerald-200/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-900">
                      CPGRAMS API
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 font-mono text-[11px]">
                    <p className="text-emerald-900 font-bold">
                      {cp.grievanceTokenLabel}{" "}
                      <span className="underline">{autoGrievance.token}</span>
                    </p>
                    <p className="text-emerald-800 font-sans text-xs">
                      {{
                        en: "Dept: Ministry of Agriculture and Farmers Welfare (PM-KISAN Cell)",
                        hi: "विभाग: कृषि एवं किसान कल्याण मंत्रालय (पीएम-किसान नोडल सेल)",
                        te: "శాఖ: వ్యవసాయ & రైతు సంక్షేమ మంత్రిత్వ శాఖ (PM-KISAN నోడల్ విభాగం)",
                        ta: "துறை: வேளாண்மை மற்றும் விவசாயிகள் நல அமைச்சகம் (PM-KISAN பிரிவு)",
                        kn: "ಇಲಾಖೆ: ಕೃಷಿ ಮತ್ತು ರೈತರ ಕಲ್ಯಾಣ ಸಚಿವಾಲಯ (PM-KISAN ಕೋಶ)",
                        mr: "विभाग: कृषी आणि शेतकरी कल्याण मंत्रालय (PM-KISAN कक्ष)",
                        bn: "বিভাগ: কৃষি ও কৃষক কল্যাণ মন্ত্রক (PM-KISAN সেল)",
                        pa: "ਵਿਭਾਗ: ਖੇਤੀਬਾੜੀ ਅਤੇ ਕਿਸਾਨ ਭਲਾਈ ਮੰਤਰਾਲਾ (PM-KISAN ਸੈੱਲ)",
                      }[lang] ?? "Dept: Ministry of Agriculture and Farmers Welfare (PM-KISAN Cell)"}
                    </p>
                    <p className="text-[10px] font-sans font-semibold uppercase text-emerald-700">
                      {{
                        en: "✓ Status: Under Official Nodal Investigation (Auto-Acknowledged)",
                        hi: "✓ स्थिति: नोडल अधिकारी स्तर पर जांच जारी (स्वचालित पावती जारी)",
                        te: "✓ స్థితి: నోడల్ అధికారి పరిశీలనలో ఉంది (స్వయంచాలక రసీదు జారీ చేయబడింది)",
                        ta: "✓ நிலை: நோடல் அதிகாரி விசாரணையில் உள்ளது (ஒப்புகை சீட்டு வழங்கப்பட்டது)",
                        kn: "✓ ಸ್ಥಿತಿ: ನೋಡಲ್ ಅಧಿಕಾರಿ ಹಂತದಲ್ಲಿ ಪರಿಶೀಲನೆ ನಡೆಯುತ್ತಿದೆ (ಸ್ವಯಂ ಸ್ವೀಕೃತಿ ನೀಡಲಾಗಿದೆ)",
                        mr: "✓ स्थिती: नोडल अधिकारी स्तरावर चौकशी सुरू आहे (पावती जारी)",
                        bn: "✓ স্থিতি: নোডাল অফিসার পর্যায়ে তদন্ত চলছে (স্বীকৃতি প্রাপ্ত)",
                        pa: "✓ ਸਥਿਤੀ: ਨੋਡਲ ਅਧਿਕਾਰੀ ਪੱਧਰ 'ਤੇ ਜਾਂਚ ਜਾਰੀ ਹੈ (ਪਹੁੰਚ ਰਸੀਦ ਜਾਰੀ)",
                      }[lang] ?? "✓ Status: Under Official Nodal Investigation (Auto-Acknowledged)"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <button
                    onClick={() => void submitAutonomousGrievance()}
                    disabled={isSubmittingGrievance}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-stone-800 active:scale-[0.98] disabled:opacity-60"
                  >
                    <span>⚡</span>
                    <span>
                      {isSubmittingGrievance
                        ? cp.grievanceDispatching
                        : cp.grievanceAutoSubmitBtn}
                    </span>
                  </button>
                  <button
                    onClick={() => setShowGrievanceModal(true)}
                    className="text-xs font-medium text-stone-600 hover:text-stone-900 underline"
                  >
                    {cp.grievanceViewDraft}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Responsibility Baton: Who acts next? — Live Action Rail */}
        <div
          id="baton-rail"
          className={`mt-6 border-t border-stone-100 pt-5 rounded-2xl p-2.5 -mx-2.5 transition-all duration-700 ${
            highlightSection === "baton"
              ? "bg-emerald-50/70 ring-2 ring-emerald-500 shadow-md ring-offset-2 ring-offset-stone-50"
              : ""
          }`}
        >
          {(() => {
            const JOURNEY_CHAINS: Record<string, Record<Lang, string[]>> = {
              J1_FARMER_EKYC: {
                en: ["e-KYC biometric", "State verification", "Payment processing", "₹2,000 credited"],
                hi: ["ई-केवाईसी बायोमेट्रिक", "राज्य सत्यापन", "भुगतान प्रोसेस", "₹2,000 जमा"],
                te: ["ఇ-కెవైసి బయోమెట్రిక్", "రాష్ట్ర ధృవీకరణ", "చెల్లింపు ప్రక్రియ", "₹2,000 జమ"],
                ta: ["இ-கேஒய்சி பயோமெட்ரிக்", "மாநில சரிபார்ப்பு", "கட்டண செயலாக்கம்", "₹2,000 வரவு"],
                kn: ["ಇ-ಕೆವೈಸಿ ಬಯೋಮೆಟ್ರಿಕ್", "ರಾಜ್ಯ ಪರಿಶೀಲನೆ", "ಪಾವತಿ ಪ್ರಕ್ರಿಯೆ", "₹2,000 ಜಮೆ"],
                mr: ["ई-केवायसी बायोमेट्रिक", "राज्य पडताळणी", "पेमेंट प्रक्रिया", "₹2,000 जमा"],
                bn: ["ই-কেওয়াইসি বায়োমেট্রিক", "রাজ্য যাচাইকরণ", "পেমেন্ট প্রক্রিয়া", "₹2,000 জমা"],
                pa: ["ਈ-ਕੇਵਾਈਸੀ ਬਾਇਓਮੈਟ੍ਰਿਕ", "ਰਾਜ ਤਸਦੀਕ", "ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ", "₹2,000 ਜਮ੍ਹਾ"],
              },
              J2_GOVT_VERIFICATION: {
                en: ["State land verification", "Payment reprocessing", "Payment processing", "₹2,000 credited"],
                hi: ["राज्य भूमि सत्यापन", "पुनः प्रोसेस", "भुगतान प्रोसेस", "₹2,000 जमा"],
                te: ["రాష్ట్ర భూ రికార్డు ధృవీకరణ", "పునః ప్రక్రియ", "చెల్లింపు ప్రక్రియ", "₹2,000 జమ"],
                ta: ["மாநில நில சரிபார்ப்பு", "மீண்டும் செயலாக்கம்", "கட்டண செயலாக்கம்", "₹2,000 வரவு"],
                kn: ["ರಾಜ್ಯ ಭೂ ಪರಿಶೀಲನೆ", "ಮರು ಪ್ರಕ್ರಿಯೆ", "ಪಾವತಿ ಪ್ರಕ್ರಿಯೆ", "₹2,000 ಜಮೆ"],
                mr: ["राज्य जमीन पडताळणी", "पुन्हा प्रक्रिया", "पेमेंट प्रक्रिया", "₹2,000 जमा"],
                bn: ["রাজ্য জমি যাচাইকরণ", "পুনঃপ্রক্রিয়াকরণ", "পেমেন্ট প্রক্রিয়া", "₹2,000 জমা"],
                pa: ["ਰਾਜ ਜ਼ਮੀਨ ਤਸਦੀਕ", "ਦੁਬਾਰਾ ਪ੍ਰਕਿਰਿਆ", "ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ", "₹2,000 ਜਮ੍ਹਾ"],
              },
              J3_PAYMENT_FAILURE: {
                en: ["Banking network check", "State verification", "Payment reprocessing", "₹2,000 credited"],
                hi: ["बैंकिंग नेटवर्क जाँच", "राज्य सत्यापन", "पुनः प्रोसेस", "₹2,000 जमा"],
                te: ["బ్యాంకింగ్ నెట్‌వర్క్ తనిఖీ", "రాష్ట్ర ధృవీకరణ", "పునః ప్రక్రియ", "₹2,000 జమ"],
                ta: ["வங்கி நெட்வொர்க் சரிபார்ப்பு", "மாநில சரிபார்ப்பு", "மீண்டும் செயலாக்கம்", "₹2,000 வரவு"],
                kn: ["ಬ್ಯಾಂಕಿಂಗ್ ನೆಟ್‌ವರ್ಕ್ ಪರಿಶೀಲನೆ", "ರಾಜ್ಯ ಪರಿಶೀಲನೆ", "ಮರು ಪ್ರಕ್ರಿಯೆ", "₹2,000 ಜಮೆ"],
                mr: ["बँकिंग नेटवर्क तपासणी", "राज्य पडताळणी", "पुन्हा प्रक्रिया", "₹2,000 जमा"],
                bn: ["ব্যাঙ্কিং নেটওয়ার্ক পরীক্ষা", "রাজ্য যাচাইকরণ", "পুনঃপ্রক্রিয়াকরণ", "₹2,000 জমা"],
                pa: ["ਬੈਂਕਿੰਗ ਨੈੱਟਵਰਕ ਜਾਂਚ", "ਰਾਜ ਤਸਦੀਕ", "ਦੁਬਾਰਾ ਪ੍ਰਕਿਰਿਆ", "ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ", "₹2,000 ਜਮ੍ਹਾ"],
              },
              J4_NO_ACTION: {
                en: ["Record lookup", "Payment processing", "Bank crediting", "₹2,000 credited"],
                hi: ["रिकॉर्ड जाँच", "भुगतान प्रोसेस", "बैंक क्रेडिट", "₹2,000 जमा"],
                te: ["రికార్డు తనిఖీ", "చెల్లింపు ప్రక్రియ", "బ్యాంక్ క్రెడిట్", "₹2,000 జమ"],
                ta: ["பதிவு சரிபார்ப்பு", "கட்டண செயலாக்கம்", "வங்கி வரவு", "₹2,000 வரவு"],
                kn: ["ದಾಖಲೆ ಪರಿಶೀಲನೆ", "ಪಾವತಿ ಪ್ರಕ್ರಿಯೆ", "ಬ್ಯಾಂಕ್ ಜಮೆ", "₹2,000 ಜಮೆ"],
                mr: ["नोंद तपासणी", "पेमेंट प्रक्रिया", "बँक जमा", "₹2,000 जमा"],
                bn: ["রেকর্ড পরীক্ষা", "পেমেন্ট প্রক্রিয়া", "ব্যাঙ্ক জমা", "₹2,000 জমা"],
                pa: ["ਰਿਕਾਰਡ ਜਾਂਚ", "ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ", "ਬੈਂਕ ਜਮ੍ਹਾ", "₹2,000 ਜਮ੍ਹਾ"],
              },
            };

            const jId = data.demo?.journeyId || "J3_PAYMENT_FAILURE";
            const fullSteps = JOURNEY_CHAINS[jId]?.[lang] || (data.chain as any)?.[lang] || (data.chain as any)?.en || [];
            const activeStepIdx = resolved ? fullSteps.length - 1 : (data.demo?.step ?? 0);

            return (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      {cp.responsibilityBaton}
                    </p>
                    <span className="font-mono text-[10px] font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                      {resolved
                        ? (lang === "hi" ? "पूर्ण" : "Completed")
                        : (lang === "hi" ? `चरण ${Math.min(activeStepIdx + 1, fullSteps.length)}/${fullSteps.length}` : `Step ${Math.min(activeStepIdx + 1, fullSteps.length)}/${fullSteps.length}`)}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-stone-500">
                    {cp.activeOwnerLabel} <strong className="text-stone-900">{t(data.nextActorLabel)}</strong>
                  </span>
                </div>

                {/* Connected Baton Timeline Rail with Green Completed & Amber Active Dots */}
                {fullSteps.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {fullSteps.map((step: string, i: number, arr: string[]) => {
                      const isCompleted = resolved || i < activeStepIdx;
                      const isCurrent = !resolved && i === activeStepIdx;

                      return (
                        <span key={`${step}-${i}`} className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                              isCompleted
                                ? "border border-emerald-300/80 bg-emerald-50/80 text-emerald-950 font-semibold shadow-2xs"
                                : isCurrent
                                ? "bg-stone-900 text-white shadow-xs font-semibold"
                                : "border border-stone-200/70 bg-stone-50/70 text-stone-400"
                            }`}
                          >
                            {isCompleted ? (
                              <span className="flex h-2 w-2 items-center justify-center rounded-full bg-emerald-500" />
                            ) : isCurrent ? (
                              <span className="flex h-2 w-2 items-center justify-center rounded-full bg-amber-400 animate-pulse ring-2 ring-amber-400/40" />
                            ) : (
                              <span className="flex h-1.5 w-1.5 items-center justify-center rounded-full bg-stone-300" />
                            )}
                            <span>{step}</span>
                          </span>
                          {i < arr.length - 1 && (
                            <span className={isCompleted ? "text-emerald-500 font-bold" : "text-stone-300"}>
                              →
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* 3. Action Container: What do I need to do? */}
        <div
          id="action-container"
          className={`mt-6 border-t border-stone-100 pt-5 rounded-2xl p-2.5 -mx-2.5 transition-all duration-700 ${
            highlightSection === "action"
              ? "bg-rose-50/70 ring-2 ring-rose-500 shadow-md ring-offset-2 ring-offset-stone-50"
              : ""
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
            {cp.yourNextStep}
          </p>

          <div className="mt-3">
            {data.yourAction.required && data.yourAction.action ? (
              <ActionCard data={data} lang={lang} busy={busy} onDone={doAction} />
            ) : data.yourAction.awaitingConfirmation ? (
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-5">
                <p className="font-semibold text-stone-900">{t(data.yourAction.text)}</p>
                <p className="mt-1 text-xs text-stone-600">{CONFIRMATION_NOTE[lang]}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-200/90 bg-amber-50/60 p-5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs text-white">✓</span>
                  <p className="text-base font-semibold text-amber-950">
                    {cp.noCitizenActionRequired}
                  </p>
                </div>
                {data.waitContext && (
                  <div className="mt-3 space-y-1.5 border-t border-amber-200/60 pt-3 text-xs text-stone-800">
                    <p>
                      <span className="font-semibold text-stone-600">
                        {cp.waitingFor}
                      </span>{" "}
                      {t(data.waitContext.waitingFor)}
                    </p>
                    <p>
                      <span className="font-semibold text-stone-600">
                        {cp.responsibility}
                      </span>{" "}
                      {t(data.waitContext.nextActorLabel)}
                    </p>
                    <p className="mt-2 text-stone-500 italic">
                      {t(data.waitContext.safetyNet)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Grievance Quick Trigger (Persistent Option) */}
        {!resolved && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3.5 text-xs text-stone-500">
            <span>{data.lastVerifiedAt ? `${cp.lastVerified} ${timeLabel(data.lastVerifiedAt, lang)}` : ""}</span>
            <button
              onClick={() => setShowGrievanceModal(true)}
              className="font-semibold text-stone-700 underline-offset-2 transition hover:text-stone-950 hover:underline active:scale-[0.98]"
            >
              {cp.viewPreparedGrievanceDraft}
            </button>
          </div>
        )}
      </div>

      {/* Registration Number Link Banner (For cases created via question / voice intake) */}
      {!data.registrationNumber && !resolved && (
        <section className="mt-5 rounded-3xl border border-stone-200/90 bg-stone-50/70 p-5 shadow-xs sm:p-6 animate-in fade-in duration-300">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                {cp.linkRegPromptTitle}
              </h3>
              <p className="mt-0.5 text-xs text-stone-600">
                {cp.linkRegPromptSub}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-stone-300 bg-stone-100 px-2 py-0.5 font-mono text-[10px] font-bold text-stone-700">
              11 DIGITS
            </span>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={11}
              value={regInput}
              onChange={(e) => setRegInput(e.target.value.replace(/\D/g, ""))}
              placeholder={cp.linkRegPlaceholder}
              className="flex-1 min-w-[200px] rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-mono font-semibold text-stone-900 shadow-2xs outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />
            <button
              onClick={() => void submitLinkReg()}
              disabled={regInput.trim().length !== 11 || linkingReg}
              className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-stone-800 active:scale-[0.98] disabled:opacity-50"
            >
              {linkingReg ? "…" : cp.linkRegBtn}
            </button>
          </div>
        </section>
      )}

      {/* Proactive WhatsApp & SMS Alert Subscription */}
      {!resolved && (
        <section
          id="whatsapp-subscription-card"
          className={`mt-5 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs sm:p-6 transition-all duration-700 ${
            highlightSection === "whatsapp"
              ? "ring-4 ring-emerald-500 shadow-xl ring-offset-2 ring-offset-stone-50 scale-[1.01]"
              : ""
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
                <WhatsAppIcon className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  {cp.whatsAppAlertsTitle}
                </h3>
                <p className="text-xs text-stone-500">
                  {cp.whatsAppAlertsDesc}
                </p>
              </div>
            </div>
          </div>

          {isSubscribed ? (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-700" />
                <span>
                  {cp.whatsAppSubscribed} +91 {phoneInput || "98765 43210"}
                </span>
              </div>
              <button
                onClick={() => setIsSubscribed(false)}
                className="text-[11px] font-semibold text-emerald-700 underline hover:text-emerald-900"
              >
                {cp.changeBtn}
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const num = phoneInput.trim() || "9876543210";
                setPhoneInput(num);
                setIsSubscribed(true);
                setPushNotification({
                  title: cp.whatsAppToastTitle,
                  body: `Case #${data.id}: ${cp.whatsAppToastBody}`,
                  type: "subscribed",
                });
              }}
              className="mt-4 flex flex-col gap-2 sm:flex-row"
            >
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-2.5 font-mono text-xs font-semibold text-stone-400">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="98765 43210"
                  className={`w-full rounded-xl border border-stone-200 bg-stone-50/60 pl-11 pr-4 py-2.5 font-mono text-xs font-semibold text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white ${
                    isTypingPhone ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500 animate-pulse" : ""
                  }`}
                />
              </div>
              <button
                id="whatsapp-submit-btn"
                type="submit"
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-emerald-800 active:scale-[0.98] ${
                  isTypingPhone ? "bg-emerald-600 scale-[0.98]" : ""
                }`}
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                <span>{cp.whatsAppEnable}</span>
              </button>
            </form>
          )}
        </section>
      )}

      {/* Resolution — Apple-grade "Relief Moment" */}
      {resolved && (
        <section
          id="resolution-card"
          className={`mt-8 rounded-2xl border border-emerald-200/90 bg-emerald-50/70 p-6 shadow-xs sm:p-7 transition-all duration-700 ${
            highlightSection === "resolution"
              ? "ring-4 ring-emerald-500 shadow-2xl scale-[1.01]"
              : ""
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white shadow-xs">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              {data.credited.amount !== null && (
                <p className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                  ₹{data.credited.amount.toLocaleString("en-IN")}{" "}
                  <span className="text-lg font-medium text-emerald-900 sm:text-xl">
                    {cp.creditedToAccount}
                  </span>
                </p>
              )}
              {data.resolution && <p className="mt-1.5 text-sm text-stone-700">{data.resolution.note}</p>}
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                {cp.caseResolvedAndClosed}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void resetCase()}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-emerald-900 active:scale-[0.98] cursor-pointer"
                >
                  <span>{cp.replayMagicDemo || "↺ Replay Magic Demo"}</span>
                </button>
                <Link
                  href="/"
                  className="inline-block rounded-xl border border-emerald-300 bg-white/80 px-5 py-2.5 text-xs font-medium text-emerald-900 shadow-2xs transition hover:bg-white active:scale-[0.98]"
                >
                  {cp.startAnotherCase}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recovery Simulator Card for Judges (Visible only before resolution) */}
      {data.isDemo && data.demo && !resolved && (
        <section className="mt-8 rounded-3xl border border-stone-200/80 bg-stone-50/70 p-5 sm:p-6 transition-all shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-white shadow-xs">
                <SparklesIcon className="h-4 w-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-stone-900">
                    {cp.seeHowRaastaResolves}
                  </h3>
                  {auto && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {cp.liveAgentActive}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-stone-500">
                  {auto ? cp.liveSimulationDesc : cp.oneClickDaemon}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void playMagicDemo()}
                disabled={busy || isTypingPhone}
                className={`inline-flex items-center gap-1.5 rounded-2xl px-5 py-2.5 text-xs font-semibold shadow-xs transition-all duration-150 active:scale-[0.98] ${
                  auto
                    ? "bg-rose-600 hover:bg-rose-700 text-white"
                    : "bg-stone-900 hover:bg-stone-800 text-white"
                }`}
              >
                {auto ? <PauseIcon className="h-3 w-3" /> : <PlayIcon className="h-3 w-3" />}
                <span>{auto ? cp.pauseMagic : cp.playMagicDemo}</span>
              </button>
            </div>
          </div>

          {/* Real-time Agent Steps Rail */}
          {auto && (
            <div className="mt-4 pt-3.5 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
              <div className="flex items-center gap-2 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                <span>
                  {cp.stepLabel} {data.demo.step} / {data.demo.totalSteps}: {t(data.demo.journeyName)}
                </span>
              </div>
              <span className="text-stone-400 font-sans">
                {cp.nextSignalIn}
              </span>
            </div>
          )}
        </section>
      )}

      {/* Floating Cinematic Guided Demo HUD Bar */}
      {auto && demoStatusText && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-full border border-stone-700/80 bg-stone-900/95 px-5 py-3 text-xs text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <svg className="animate-spin h-3 w-3 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-emerald-400 font-bold shrink-0">
              {cp.liveAgentActive}:
            </span>
            <span className="text-stone-100 max-w-[200px] sm:max-w-md truncate">
              {t(demoStatusText)}
            </span>
          </div>
          <button
            onClick={() => {
              isPlayingMagicRef.current = false;
              setAuto(false);
            }}
            className="ml-1.5 rounded-full bg-stone-800 px-2.5 py-1 text-[11px] font-semibold text-stone-300 transition hover:bg-stone-700 hover:text-white"
          >
            {cp.pauseMagic}
          </button>
        </div>
      )}

      {/* Timeline — "What's been happening" */}
      <section className="mt-8">
        <details className="group rounded-xl border border-stone-200 bg-white">
          <summary className="cursor-pointer list-none px-5 py-4 font-medium text-stone-900">
            {cp.timelineTitle}
            <span className="float-right text-stone-400 transition group-open:rotate-90">›</span>
          </summary>
          <ol className="border-t border-stone-100 px-5 py-4">
            {[...data.timeline].reverse().map((e) => (
              <li key={e.id} className="flex gap-3 py-1.5 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-300" />
                <div>
                  <p className="text-stone-800">{t(e.humanLabel)}</p>
                  <p className="text-xs text-stone-400">{timeLabel(e.createdAt, lang)}</p>
                </div>
              </li>
            ))}
          </ol>
        </details>
      </section>

      {/* Details — progressive disclosure L4, with provenance badges */}
      <section className="mt-3">
        <details className="group rounded-xl border border-stone-200 bg-white">
          <summary className="cursor-pointer list-none px-5 py-4 font-medium text-stone-900">
            {cp.detailsTitle}
            <span className="float-right text-stone-400 transition group-open:rotate-90">›</span>
          </summary>
          <div className="space-y-2 border-t border-stone-100 px-5 py-4">
            {data.evidence.length === 0 && (
              <p className="text-sm text-stone-500">
                {{
                  en: "No verified details yet.",
                  hi: "अभी कोई सत्यापित विवरण नहीं है।",
                  te: "ఇంకా ధృవీకరించబడిన వివరాలు లేవు.",
                  ta: "சரிபார்க்கப்பட்ட விவரங்கள் எதுவும் இல்லை.",
                  kn: "ಇನ್ನೂ ಯಾವುದೇ ಪರಿಶೀಲಿಸಿದ ವಿವರಗಳಿಲ್ಲ.",
                  mr: "अद्याप कोणतेही सत्यापित तपशील नाहीत.",
                  bn: "এখনও কোনো যাচাইকৃত বিবরণ নেই।",
                  pa: "ਅਜੇ ਕੋਈ ਪ੍ਰਮਾਣਿਤ ਵੇਰਵੇ ਨਹੀਂ ਹਨ।",
                }[lang] ?? "No verified details yet."}
              </p>
            )}
            {data.evidence.map((e) => {
              const badge = SOURCE_BADGE[e.sourceType] ?? SOURCE_BADGE.SYSTEM_DERIVED;
              return (
                <div key={e.id} className="rounded-lg border border-stone-100 bg-stone-50/60 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${badge.cls}`}>
                      {t(badge.label)}
                    </span>
                    <span className="text-xs text-stone-400">{timeLabel(e.verifiedAt, lang)}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-stone-800">{t(e.value)}</p>
                  <p className="mt-0.5 text-xs text-stone-400">
                    {e.source.replace("(simulated)", {
                      en: "(simulated)",
                      hi: "(अनुकरणित)",
                      te: "(నమూనా)",
                      ta: "(மாதிரி)",
                      kn: "(ಮಾದರಿ)",
                      mr: "(सिम्युलेटेड)",
                      bn: "(সিমুলেটেড)",
                      pa: "(ਸਿਮੂਲੇਟਿਡ)",
                    }[lang] ?? "(simulated)")}
                  </p>
                </div>
              );
            })}
          </div>
        </details>
      </section>

      {/* 7. Prepared Grievance Modal */}
      {showGrievanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-900">
                {cp.grievanceModalTitle}
              </h2>
              <button
                onClick={() => setShowGrievanceModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              {lang === "hi"
                ? "यह मसौदा आपकी केस मेमोरी और आधिकारिक साक्ष्यों से संकलित किया गया है।"
                : "Compiled from your persistent case memory and verified official evidence."}
            </p>

            {data.grievanceDraft && (
              <div className="mt-4 space-y-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs font-mono text-stone-800">
                <div>
                  <span className="font-bold text-stone-500">REGISTRATION:</span> {data.grievanceDraft.registrationNumber}
                </div>
                <div>
                  <span className="font-bold text-stone-500">CATEGORY:</span> {t(data.grievanceDraft.category)}
                </div>
                <div>
                  <span className="font-bold text-stone-500">SUBJECT:</span> {t(data.grievanceDraft.subject)}
                </div>
                <div className="border-t border-stone-200 pt-2 font-sans text-xs">
                  <span className="font-bold text-stone-500 font-mono">SUMMARY:</span>
                  <p className="mt-0.5">{t(data.grievanceDraft.summary)}</p>
                </div>
                {data.grievanceDraft.citizenStatement && (
                  <div className="border-t border-stone-200 pt-2 font-sans text-xs">
                    <span className="font-bold text-amber-700 font-mono">CITIZEN STATEMENT:</span>
                    <p className="mt-0.5 text-stone-900 font-medium">{t(data.grievanceDraft.citizenStatement)}</p>
                  </div>
                )}
                {data.grievanceDraft.facts && data.grievanceDraft.facts.length > 0 && (
                  <div className="border-t border-stone-200 pt-2 font-sans text-xs">
                    <span className="font-bold text-stone-500 font-mono">VERIFIED TIMELINE FACTS:</span>
                    <ul className="mt-1 list-disc pl-4 space-y-0.5 text-stone-600">
                      {data.grievanceDraft.facts.map((f, i) => (
                        <li key={i}>{t(f)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.grievanceDraft.request && (
                  <div className="border-t border-stone-200 pt-2 font-sans text-xs">
                    <span className="font-bold text-stone-500 font-mono">REQUESTED ACTION:</span>
                    <p className="mt-0.5 text-stone-700">{t(data.grievanceDraft.request)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Autonomous Action inside Modal */}
            <div className="mt-5 space-y-3">
              {autoGrievance ? (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-950">
                  <p className="font-bold text-emerald-900">
                    ✓ {cp.grievanceAutoSubmitted}
                  </p>
                  <p className="font-mono text-[11px] mt-0.5">{autoGrievance.token}</p>
                </div>
              ) : (
                <button
                  onClick={() => void submitAutonomousGrievance()}
                  disabled={isSubmittingGrievance}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-800 active:scale-[0.98] disabled:opacity-60"
                >
                  <span>⚡</span>
                  <span>
                    {isSubmittingGrievance
                      ? cp.grievanceDispatching
                      : cp.grievanceAutoSubmitBtn}
                  </span>
                </button>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const draftText = data.grievanceDraft
                      ? `Registration: ${data.grievanceDraft.registrationNumber}\nCategory: ${t(data.grievanceDraft.category)}\nSubject: ${t(data.grievanceDraft.subject)}\n\n${t(data.grievanceDraft.summary)}\n\nCitizen Statement: ${data.grievanceDraft.citizenStatement ? t(data.grievanceDraft.citizenStatement) : "N/A"}\n\nVerified Facts:\n${data.grievanceDraft.facts.map((f) => "- " + t(f)).join("\n")}\n\nRequested Action:\n${t(data.grievanceDraft.request)}`
                      : "";
                    copyGrievance(draftText);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-100 px-4 py-2 text-xs font-medium text-stone-800 shadow-xs transition-all duration-150 hover:bg-stone-200 active:scale-[0.98]"
                >
                  {copiedGrievance ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{cp.grievanceModalCopied}</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3.5 w-3.5" />
                      <span>{cp.grievanceModalCopy}</span>
                    </>
                  )}
                </button>
                <a
                  href={data.grievanceDraft?.officialPortalUrl || "https://pgportal.gov.in/"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-amber-800 underline-offset-2 transition hover:underline active:scale-[0.98]"
                >
                  {cp.openOfficialPortal}
                </a>
              </div>
            </div>
            <p className="mt-3 border-t border-stone-100 pt-2.5 text-[11px] text-stone-500 italic">
              {lang === "hi"
                ? "डेमो — यहाँ से कुछ भी सबमिट नहीं किया जाता है। मसौदे की समीक्षा करें, इसे कॉपी करें, और आधिकारिक पोर्टल पर सबमिट करें।"
                : "Demo — nothing is submitted from here. Review your draft, copy it, and submit on the official portal."}
            </p>
          </div>
        </div>
      )}

      {/* Discreet Footer & Journal Link */}
      <footer className="mt-12 pt-6 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
        <p className="text-center sm:text-left leading-relaxed">
          {cp.principleFooter}
        </p>
        <Link
          href="/journal"
          className="font-medium text-stone-500 hover:text-stone-900 transition hover:underline underline-offset-4 shrink-0"
        >
          Raasta Journal · Philosophy →
        </Link>
      </footer>
    </main>
  );
}

function ActionCard({
  data,
  lang,
  busy,
  onDone,
}: {
  data: CaseDTO;
  lang: Lang;
  busy: boolean;
  onDone: (actionId: string) => void;
}) {
  const action = data.yourAction.action;
  if (!action) return null;
  const cp = CASE_PAGE_COPY[lang] ?? CASE_PAGE_COPY.en;
  const t = (o: any) => {
    if (!o) return "";
    if (typeof o === "string") return o;
    return o[lang] ?? o.hi ?? o.en ?? "";
  };

  return (
    <div className="rounded-2xl border border-rose-200/90 bg-rose-50/40 p-5 shadow-xs sm:p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">!</span>
        <p className="text-base font-bold text-rose-950">{t(action.title)}</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-stone-700">
        <GlossaryText text={t(action.why)} lang={lang} />
      </p>

      {action.card && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs">
          {/* Header of the Counter Pass */}
          <div className="bg-stone-50/80 px-4 py-3 border-b border-stone-100 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-700">{t(action.card.heading)}</p>
            <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">{cp.counterPassBadge}</span>
          </div>

          <div className="p-4 space-y-3.5">
            <p className="text-xs italic text-stone-600">“{t(action.card.statement)}”</p>

            {/* Exact ask to tell the counter — Speech Bubble */}
            {action.card.ask && (
              <div className="rounded-xl bg-stone-900 p-3.5 text-xs text-white shadow-xs">
                <span className="block font-bold text-stone-400 text-[10px] uppercase tracking-wider mb-1">
                  {cp.tellOperatorAtCounter}
                </span>
                <p className="text-sm font-medium leading-snug">“{t(action.card.ask)}”</p>
              </div>
            )}

            {/* Substantiated Requirements Checklist */}
            {action.card.requirements && action.card.requirements.length > 0 && (
              <div className="border-t border-stone-100 pt-3">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  {cp.whatToBringWithYou}
                </p>
                <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {action.card.requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-1.5 rounded-lg border border-stone-200/80 bg-stone-50/60 px-2.5 py-1.5 text-xs text-stone-800">
                      <span className="text-emerald-600 text-xs font-bold">✓</span>
                      <span className="font-medium">{t(req)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Action Card Header Utilities: WhatsApp Share & Print Pass */}
            <div className="flex items-center justify-end gap-2 border-t border-stone-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") window.print();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700 transition hover:bg-stone-100 active:scale-[0.97]"
              >
                <PrinterIcon className="h-3.5 w-3.5" />
                <span>{cp.printPass}</span>
              </button>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `🏛️ ${cp.schemeTitle} (${data.id}):\n${cp.yourNextStep}: ${t(
                    action.title
                  )}\n\n${cp.tellOperatorAtCounter} "${
                    action.card?.ask ? t(action.card.ask) : ""
                  }"\n\n${cp.whatToBringWithYou}:\n${
                    action.card?.requirements
                      ? action.card.requirements.map((r) => `• ${t(r)}`).join("\n")
                      : ""
                  }`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-2xs transition hover:bg-emerald-700 active:scale-[0.97]"
              >
                <WhatsAppIcon className="h-3 w-3" />
                <span>{cp.shareToWhatsApp}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          id="action-btn"
          onClick={() => onDone(action.id)}
          disabled={busy}
          className="rounded-xl bg-stone-900 px-6 py-3 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-stone-800 active:scale-[0.98] disabled:opacity-50"
        >
          {busy ? "…" : cp.iCompletedThisStep}
        </button>
        {action.href && (
          <a
            href={action.href}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-stone-600 underline-offset-2 transition hover:text-stone-900 hover:underline active:scale-[0.98]"
          >
            {cp.openOfficialPortal}
          </a>
        )}
      </div>
      <p className="mt-2.5 text-xs text-stone-500">{t(action.after)}</p>
    </div>
  );
}

