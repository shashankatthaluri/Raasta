import { calculateCitizenAction, compileGrievanceDraft } from "@/domain/engine";
import { STATE_CATALOG } from "@/domain/states";
import type { Actor, CaseStateId, CitizenCase, SubstantiatedRequirement } from "@/domain/types";
import type { DemoInfo } from "./caseStore";
import type { Lang } from "@/lib/i18n";

export type StateCategory = "waiting" | "action-required" | "resolved" | "informational";

export const ACTOR_LABELS: Record<Actor, Record<Lang, string>> = {
  CITIZEN: {
    en: "You",
    hi: "आप",
    te: "మీరు",
    ta: "நீங்கள்",
    kn: "ನೀವು",
    mr: "तुम्ही",
    bn: "আপনি",
    pa: "ਤੁਸੀਂ",
  },
  CSC: {
    en: "A CSC operator",
    hi: "CSC ऑपरेटर",
    te: "CSC ఆపరేటర్",
    ta: "CSC ஆபரேட்டர்",
    kn: "CSC ಆಪರೇಟರ್",
    mr: "CSC ऑपरेटर",
    bn: "সিএসসি অপারেটর",
    pa: "CSC ਆਪਰੇਟਰ",
  },
  BANK: {
    en: "Your bank",
    hi: "आपका बैंक",
    te: "మీ బ్యాంక్",
    ta: "உங்கள் வங்கி",
    kn: "ನಿಮ್ಮ ಬ್ಯಾಂಕ್",
    mr: "तुमची बँक",
    bn: "আপনার ব্যাঙ্ক",
    pa: "ਤੁਹਾਡਾ ਬੈਂਕ",
  },
  STATE: {
    en: "State verification team",
    hi: "राज्य सत्यापन टीम",
    te: "రాష్ట్ర ధృవీకరణ బృందం",
    ta: "மாநில சரிபார்ப்புக் குழு",
    kn: "ರಾಜ್ಯ ಪರಿಶೀಲನಾ ತಂಡ",
    mr: "राज्य पडताळणी पथक",
    bn: "রাজ্য যাচাইকরণ দল",
    pa: "ਰਾਜ ਤਸਦੀਕ ਟੀਮ",
  },
  CENTRAL_SYSTEM: {
    en: "The payment system",
    hi: "भुगतान प्रणाली",
    te: "చెల్లింపు వ్యవస్థ",
    ta: "கட்டண முறைமை",
    kn: "ಪಾವತಿ ವ್ಯವಸ್ಥೆ",
    mr: "पेमेंट प्रणाली",
    bn: "পেমেন্ট সিস্টেম",
    pa: "ਭੁਗਤਾਨ ਪ੍ਰਣਾਲੀ",
  },
  NONE: {
    en: "No one",
    hi: "कोई नहीं",
    te: "ఎవరూ లేరు",
    ta: "யாருமில்லை",
    kn: "ಯಾರೂ ಇಲ್ಲ",
    mr: "कोणीही नाही",
    bn: "কেউ না",
    pa: "ਕੋਈ ਨਹੀਂ",
  },
};

const CATEGORY: Record<CaseStateId, StateCategory> = {
  PAYMENT_EXPECTED: "informational",
  PAYMENT_CHECK: "informational",
  EKYC_REQUIRED: "action-required",
  EKYC_VERIFIED: "informational",
  PAYMENT_PROCESSING: "informational",
  PHYSICAL_VERIFICATION_PENDING: "waiting",
  TRANSACTION_FAILED: "waiting",
  PAYMENT_REPROCESSING: "informational",
  CITIZEN_ACTION_REQUIRED: "action-required",
  PAYMENT_CREDITED: "resolved",
  RESOLVED: "resolved",
};

const WAITING_CONFIRMATION: Record<Lang, string> = {
  en: "Action done — waiting for official confirmation",
  hi: "कार्रवाई पूरी — आधिकारिक पुष्टि की प्रतीक्षा",
  te: "చర్య పూర్తయింది — అధికారిక నిర్ధారణ కోసం వేచి ఉంది",
  ta: "நடவடிக்கை முடிந்தது — அதிகாரப்பூர்வ உறுதிப்படுத்தலுக்கு காத்திருக்கிறது",
  kn: "ಕ್ರಮ ಪೂರ್ಣಗೊಂಡಿದೆ — ಅಧಿಕೃತ ದೃಢೀಕರಣಕ್ಕಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ",
  mr: "कृती पूर्ण — अधिकृत पुष्टीची प्रतीक्षा",
  bn: "পদক্ষেপ সম্পন্ন — অফিসিয়াল নিশ্চিতকরণের অপেক্ষায়",
  pa: "ਕਾਰਵਾਈ ਪੂਰੀ — ਅਧਿਕਾਰਤ ਪੁਸ਼ਟੀ ਦੀ ਉਡੀਕ",
};

const NOTHING_NOW: Record<Lang, string> = {
  en: "Nothing right now",
  hi: "अभी कुछ नहीं करना है",
  te: "ప్రస్తుతం ఏమీ చేయవలసిన అవసరం లేదు",
  ta: "இப்போது எதுவும் செய்ய வேண்டியதில்லை",
  kn: "ಈಗ ಏನನ್ನೂ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ",
  mr: "आत्ता काहीही करण्याची आवश्यकता नाही",
  bn: "এখন কিছু করতে হবে না",
  pa: "ਹੁਣ ਕੁਝ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ",
};

const CITIZEN_TIMELINE_EVENTS = new Set([
  "CASE_CREATED",
  "STATE_CHANGED",
  "ACTION_ASSIGNED",
  "ACTION_COMPLETED",
  "ACTION_CONFIRMED",
  "RESOLVED",
]);

export interface CaseDTO {
  id: string;
  registrationNumber: string | null;
  isDemo: boolean;
  service: string;
  problemType: string;
  intakeLanguage: string | null;
  currentState: CaseStateId;
  stateCategory: StateCategory;
  color: string;
  title: Record<string, string>;
  why: Record<string, string>;
  nextActor: Actor;
  nextActorLabel: Record<Lang, string>;
  waitContext: {
    waitingFor: Record<string, string>;
    nextActorLabel: Record<Lang, string>;
    safetyNet: Record<string, string>;
  } | null;
  yourAction: {
    required: boolean;
    awaitingConfirmation: boolean;
    text: Record<string, string>;
    action: {
      id: string;
      title: Record<string, string>;
      why: Record<string, string>;
      after: Record<string, string>;
      href?: string;
      card?: {
        heading: Record<string, string> | string;
        headingHi?: string;
        statement: Record<string, string> | string;
        statementHi?: string;
        ask: Record<string, string>;
        requirements: SubstantiatedRequirement[];
        lines: string[];
        [key: string]: any;
      };
    } | null;
  };
  dispute: {
    officialClaim: { en: string; hi: string };
    citizenStatement: string | Record<string, string>;
    submittedAt: string;
  } | null;
  grievanceDraft: {
    registrationNumber: string;
    category: Record<string, string>;
    subject: Record<string, string>;
    summary: Record<string, string>;
    request: Record<string, string>;
    facts: Record<string, string>[];
    citizenStatement?: Record<string, string>;
    officialPortalUrl: string;
  } | null;
  chain: Record<string, string[]>;
  lastVerifiedAt: string | null;
  lifecycle: string;
  resolution: {
    reason: string;
    note: string;
  } | null;
  credited: {
    amount: number | null;
    utr: string | null;
    bankName: string | null;
    paymentMode: string | null;
    creditedAt: string | null;
  };
  timeline: { id: string; humanLabel: Record<string, string>; eventType: string; createdAt: string }[];
  evidence: { id: string; value: Record<string, string>; source: string; sourceType: string; verifiedAt: string }[];
  demo: DemoInfo | null;
}

export function toCaseDTO(c: CitizenCase, demo: DemoInfo | null = null): CaseDTO {
  const def = STATE_CATALOG[c.currentState];
  const decision = calculateCitizenAction(c);
  const grievanceDraft = compileGrievanceDraft(c);

  const titleObj = typeof def.humanTitle === "object" ? def.humanTitle : { en: def.humanTitle, hi: def.humanTitleHi };
  const whyObj = typeof def.humanExplanation === "object" ? def.humanExplanation : { en: def.humanExplanation, hi: def.humanExplanationHi };
  const chainObj = typeof def.chain === "object" && !Array.isArray(def.chain) ? def.chain : { en: def.chain, hi: def.chainHi };
  const enChain = Array.isArray(def.chain) ? def.chain : (def.chain as any)?.en ?? def.chainHi ?? [];

  const action = decision.action
    ? {
        id: decision.action.id,
        title: typeof decision.action.title === "object" ? decision.action.title : { en: decision.action.title, hi: decision.action.titleHi },
        why: typeof decision.action.why === "object" ? decision.action.why : { en: decision.action.why, hi: decision.action.whyHi },
        after: typeof decision.action.after === "object" ? decision.action.after : { en: decision.action.after, hi: decision.action.afterHi },
        href: decision.action.href,
        card: decision.action.card
          ? {
              ...decision.action.card,
              heading: typeof decision.action.card.heading === "object" ? decision.action.card.heading : {
                en: decision.action.card.heading,
                hi: decision.action.card.headingHi ?? decision.action.card.heading,
                te: decision.action.card.headingTe ?? decision.action.card.heading,
                ta: decision.action.card.headingTa ?? decision.action.card.heading,
                kn: decision.action.card.headingKn ?? decision.action.card.heading,
                mr: decision.action.card.headingMr ?? decision.action.card.heading,
                bn: decision.action.card.headingBn ?? decision.action.card.heading,
                pa: decision.action.card.headingPa ?? decision.action.card.heading,
              },
              statement: typeof decision.action.card.statement === "object" ? decision.action.card.statement : {
                en: decision.action.card.statement,
                hi: decision.action.card.statementHi ?? decision.action.card.statement,
                te: decision.action.card.statementTe ?? decision.action.card.statement,
                ta: decision.action.card.statementTa ?? decision.action.card.statement,
                kn: decision.action.card.statementKn ?? decision.action.card.statement,
                mr: decision.action.card.statementMr ?? decision.action.card.statement,
                bn: decision.action.card.statementBn ?? decision.action.card.statement,
                pa: decision.action.card.statementPa ?? decision.action.card.statement,
              },
              lines: [
                `Case: ${c.id}`,
                `Action: ${typeof decision.action.title === "string" ? decision.action.title : (decision.action.title as Record<string, string>)?.en ?? ""}`,
                `Next: ${enChain.join(" → ")}`,
              ],
            }
          : undefined,
      }
    : null;

  const isWaiting = CATEGORY[c.currentState] === "waiting" || (!decision.required && c.nextActor !== "NONE");
  const waitContext = isWaiting
    ? {
        waitingFor:
          c.currentState === "PHYSICAL_VERIFICATION_PENDING"
            ? {
                en: "Eligibility verification by State / UT authorities",
                hi: "राज्य / केंद्रशासित प्रदेश के अधिकारियों द्वारा पात्रता सत्यापन",
                te: "రాష్ట్ర అధికారులచే అర్హత ధృవీకరణ",
                ta: "மாநில அதிகாரிகளின் தகுதி சரிபார்ப்பு",
                kn: "ರಾಜ್ಯ ಅಧಿಕಾರಿಗಳಿಂದ ಅರ್ಹತೆ ಪರಿಶೀಲನೆ",
                mr: "राज्य अधिकाऱ्यांद्वारे पात्रता पडताळणी",
                bn: "রাজ্য কর্মকর্তাদের দ্বারা যোগ্যতা যাচাইকরণ",
                pa: "ਰਾਜ ਅਧਿਕਾਰੀਆਂ ਦੁਆਰਾ ਯੋਗਤਾ ਤਸਦੀਕ",
              }
            : c.currentState === "TRANSACTION_FAILED" || c.currentState === "PAYMENT_REPROCESSING"
              ? {
                  en: "Official state verification & payment reprocessing",
                  hi: "आधिकारिक राज्य सत्यापन और भुगतान दोबारा प्रोसेसिंग",
                  te: "అధికారిక రాష్ట్ర ధృవీకరణ మరియు చెల్లింపు పునఃప్రక్రియ",
                  ta: "அதிகாரப்பூர்வ மாநில சரிபார்ப்பு மற்றும் கட்டண மறுசெயலாக்கம்",
                  kn: "ಅಧಿಕೃತ ರಾಜ್ಯ ಪರಿಶೀಲನೆ ಮತ್ತು ಪಾವತಿ ಮರುಪ್ರಕ್ರಿಯೆ",
                  mr: "अधिकृत राज्य पडताळणी आणि पेमेंट पुनर्प्रक्रिया",
                  bn: "অফিসিয়াল রাজ্য যাচাইকরণ এবং পেমেন্ট পুনঃপ্রক্রিয়াকরণ",
                  pa: "ਅਧਿਕਾਰਤ ਰਾਜ ਤਸਦੀਕ ਅਤੇ ਭੁਗਤਾਨ ਮੁੜ ਪ੍ਰਕਿਰਿਆ",
                }
              : {
                  en: "The next official government update",
                  hi: "अगले आधिकारिक सरकारी अपडेट",
                  te: "తదుపరి అధికారిక ప్రభుత్వ అప్‌డేట్",
                  ta: "அடுத்த அதிகாரப்பூர்வ அரசு தகவல்",
                  kn: "ಮುಂದಿನ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ನವೀಕರಣ",
                  mr: "पुढील अधिकृत सरकारी अपडेट",
                  bn: "পরবর্তী অফিসিয়াল সরকারি আপডেট",
                  pa: "ਅਗਲਾ ਅਧਿਕਾਰਤ ਸਰਕਾਰੀ ਅੱਪਡੇਟ",
                },
        nextActorLabel: ACTOR_LABELS[c.nextActor],
        safetyNet: {
          en: "If your case remains unchanged, we'll show you the next available review or grievance route.",
          hi: "यदि आपका मामला अपरिवर्तित रहता है, तो हम आपको अगला उपलब्ध समीक्षा या शिकायत मार्ग दिखाएंगे।",
          te: "మీ కేసు మారకపోతే, తదుపరి సమీక్ష లేదా ఫిర్యాదు మార్గాన్ని చూపుతాము.",
          ta: "உங்கள் வழக்கில் மாற்றமில்லையெனில் அடுத்த கட்ட புகார் வழியைக் காட்டுவோம்.",
          kn: "ನಿಮ್ಮ ಪ್ರಕರಣ ಬದಲಾಗದಿದ್ದರೆ, ಮುಂದಿನ ಪರಿಶೀಲನೆ ಮಾರ್ಗವನ್ನು ತೋರಿಸುತ್ತೇವೆ.",
          mr: "प्रकरण न बदलल्यास आम्ही पुढील तक्रार मार्ग दाखवू.",
          bn: "কেস অপরিবর্তিত থাকলে আমরা পরবর্তী অভিযোগের পথ দেখাব।",
          pa: "ਜੇਕਰ ਕੇਸ ਨਾ ਬਦਲਿਆ ਤਾਂ ਅਸੀਂ ਅਗਲਾ ਸ਼ਿਕਾਇਤ ਮਾਰਗ ਦਿਖਾਵਾਂਗੇ।",
        },
      }
    : null;

  const dispute = c.dispute
    ? {
        officialClaim: c.dispute.officialClaim,
        citizenStatement: c.dispute.citizenStatement,
        submittedAt: c.dispute.submittedAt.toISOString(),
      }
    : null;

  return {
    id: c.id,
    registrationNumber: c.registrationNumber ?? null,
    isDemo: c.isDemo,
    service: c.service,
    problemType: c.problemType,
    intakeLanguage: c.intakeLanguage,
    currentState: c.currentState,
    stateCategory: CATEGORY[c.currentState],
    color: def.color,
    title: titleObj,
    why: whyObj,
    nextActor: c.nextActor,
    nextActorLabel: ACTOR_LABELS[c.nextActor],
    waitContext,
    yourAction: {
      required: decision.required,
      awaitingConfirmation: Boolean(c.pendingConfirmation),
      text: decision.required
        ? typeof decision.action?.title === "object" ? decision.action.title : { en: decision.action?.title ?? "", hi: decision.action?.titleHi ?? "" }
        : c.pendingConfirmation
          ? WAITING_CONFIRMATION
          : NOTHING_NOW,
      action,
    },
    dispute,
    grievanceDraft,
    chain: chainObj,
    lastVerifiedAt: c.lastVerifiedAt?.toISOString() ?? null,
    lifecycle: c.lifecycle,
    resolution: c.resolution,
    credited: {
      amount: c.lastPaymentDetails?.amount ?? null,
      utr: c.lastPaymentDetails?.utr ?? null,
      bankName: c.lastPaymentDetails?.bankName ?? null,
      paymentMode: c.lastPaymentDetails?.paymentMode ?? null,
      creditedAt: c.lastPaymentDetails?.creditedAt?.toISOString() ?? null,
    },
    timeline: c.events
      .filter((e) => CITIZEN_TIMELINE_EVENTS.has(e.eventType))
      .map((e) => ({
        id: e.id,
        humanLabel: typeof e.humanLabel === "object" ? e.humanLabel : { en: String(e.humanLabel), hi: String(e.humanLabel) },
        eventType: e.eventType,
        createdAt: e.createdAt.toISOString(),
      })),
    evidence: c.evidence.map((ev) => ({
      id: ev.id,
      value: typeof ev.value === "object" ? ev.value : { en: String(ev.value), hi: String(ev.value) },
      source: ev.source,
      sourceType: ev.sourceType,
      verifiedAt: ev.verifiedAt.toISOString(),
    })),
    demo,
  };
}
