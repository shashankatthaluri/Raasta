import type { GovernmentSignal } from "./types";
import type { Lang } from "@/lib/i18n";

export interface JourneyStep {
  label: Record<Lang, string>;
  signal: GovernmentSignal;
  waitSeconds?: number;
}

export interface Journey {
  id: string;
  name: Record<Lang, string>;
  description: string;
  steps: JourneyStep[];
}

const KYS = "PM-KISAN KYS (simulated)";

export const JOURNEYS: Journey[] = [
  {
    id: "J1_FARMER_EKYC",
    name: {
      en: "e-KYC Biometric Verification",
      hi: "ई-केवाईसी बायोमेट्रिक सत्यापन",
      te: "ఇ-కెవైసి బయోమెట్రిక్ ధృవీకరణ",
      ta: "இ-கேஒய்சி பயோமெட்ரிக் சரிபார்ப்பு",
      kn: "ಇ-ಕೆವೈಸಿ ಬಯೋಮೆಟ್ರಿಕ್ ಪರಿಶೀಲನೆ",
      mr: "ई-केवायसी बायोमेट्रिक पडताळणी",
      bn: "ই-কেওয়াইসি বায়োমেট্রিক যাচাইকরণ",
      pa: "ਈ-ਕੇਵਾਈਸੀ ਬਾਇਓਮੈਟ੍ਰਿਕ ਤਸਦੀਕ",
    },
    description: "Payment missing → e-KYC required → citizen completes it → official confirmation → processing → credited.",
    steps: [
      {
        label: {
          en: "Official signal: e-KYC incomplete",
          hi: "आधिकारिक संकेत: ई-केवाईसी अधूरा",
          te: "అధికారిక సిగ్నల్: ఇ-కెవైసి అసంపూర్ణం",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: இ-கேஒய்சி முழுமையடையவில்லை",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ಇ-ಕೆವೈಸಿ ಅಪೂರ್ಣ",
          mr: "अधिकृत सिग्नल: ई-केवायसी अपूर्ण",
          bn: "অফিসিয়াল সংকেত: ই-কেওয়াইসি অসম্পূর্ণ",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਈ-ਕੇਵਾਈਸੀ ਅਧੂਰਾ",
        },
        waitSeconds: 2,
        signal: { type: "EKYC_STATUS", status: "INCOMPLETE", verifiedAt: new Date(), source: KYS },
      },
      {
        label: {
          en: "Official signal: e-KYC complete",
          hi: "आधिकारिक संकेत: ई-केवाईसी पूर्ण",
          te: "అధికారిక సిగ్నల్: ఇ-కెవైసి పూర్తయింది",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: இ-கேஒய்சி நிறைவு",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ಇ-ಕೆವೈಸಿ ಪೂರ್ಣ",
          mr: "अधिकृत सिग्नल: ई-केवायसी पूर्ण",
          bn: "অফিসিয়াল সংকেত: ই-কেওয়াইসি সম্পন্ন",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਈ-ਕੇਵਾਈਸੀ ਪੂਰਾ",
        },
        waitSeconds: 4,
        signal: { type: "EKYC_STATUS", status: "COMPLETE", verifiedAt: new Date(), source: KYS },
      },
      {
        label: {
          en: "Official signal: payment processing",
          hi: "आधिकारिक संकेत: भुगतान प्रोसेसिंग",
          te: "అధికారిక సిగ్నల్: చెల్లింపు ప్రక్రియ",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: கட்டண செயலாக்கம்",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ಪಾವತಿ ಪ್ರಕ್ರಿಯೆ",
          mr: "अधिकृत सिग्नल: पेमेंट प्रक्रिया",
          bn: "অফিসিয়াল সংকেত: পেমেন্ট প্রক্রিয়া",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ",
        },
        waitSeconds: 3,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: {
          en: "Official signal: payment credited",
          hi: "आधिकारिक संकेत: भुगतान जमा",
          te: "అధికారిక సిగ్నల్: చెల్లింపు జమ",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: கட்டணம் வரவு",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ಪಾವತಿ ಜಮೆ",
          mr: "अधिकृत सिग्नल: पेमेंट जमा",
          bn: "অফিসিয়াল সংকেত: পেমেন্ট জমা",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਭੁਗਤਾਨ ਜਮ੍ਹਾ",
        },
        waitSeconds: 3,
        signal: {
          type: "PAYMENT_STATUS",
          status: "CREDITED",
          amount: 2000,
          utr: "DEMO-UTR-2026-0001",
          bankName: "State Bank of India",
          paymentMode: "DBT",
          creditedAt: new Date(),
          verifiedAt: new Date(),
          source: KYS,
        },
      },
    ],
  },
  {
    id: "J2_GOVT_VERIFICATION",
    name: {
      en: "State Land Record (Bhulekh) Verification",
      hi: "राज्य भूलेख भूमि सत्यापन",
      te: "రాష్ట్ర భూలేఖ్ భూ రికార్డుల ధృవీకరణ",
      ta: "மாநில நில பதிவேடு சரிபார்ப்பு",
      kn: "ರಾಜ್ಯ ಭೂಲೇಖ್ ಭೂ ದಾಖಲೆ ಪರಿಶೀಲನೆ",
      mr: "राज्य भूलेख जमीन पडताळणी",
      bn: "রাজ্য ভূলেখ জমি রেকর্ড যাচাইকরণ",
      pa: "ਰਾਜ ਭੂਲੇਖ ਜ਼ਮੀਨੀ ਰਿਕਾਰਡ ਤਸਦੀਕ",
    },
    description: "Payment missing → verification pending → state has the next action → verification complete → processing → credited. The zero-action journey.",
    steps: [
      {
        label: {
          en: "Official signal: payment processing",
          hi: "आधिकारिक संकेत: भुगतान प्रोसेसिंग",
          te: "అధికారిక సిగ్నల్: చెల్లింపు ప్రక్రియ",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: கட்டண செயலாக்கம்",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ಪಾವತಿ ಪ್ರಕ್ರಿಯೆ",
          mr: "अधिकृत सिग्नल: पेमेंट प्रक्रिया",
          bn: "অফিসিয়াল সংকেত: পেমেন্ট প্রক্রিয়া",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ",
        },
        waitSeconds: 2,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: {
          en: "Official signal: verification pending",
          hi: "आधिकारिक संकेत: सत्यापन लंबित",
          te: "అధికారిక సిగ్నల్: ధృవీకరణ పెండింగ్‌లో ఉంది",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: சரிபார்ப்பு நிலுவையில் உள்ளது",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ",
          mr: "अधिकृत सिग्नल: पडताळणी प्रलंबित",
          bn: "অফিসিয়াল সংকেত: যাচাইকরণ মুলতুবি",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਤਸਦੀਕ ਬਕਾਇਆ",
        },
        waitSeconds: 4,
        signal: { type: "VERIFICATION_STATUS", status: "PENDING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: {
          en: "Official signal: verification complete",
          hi: "आधिकारिक संकेत: सत्यापन पूर्ण",
          te: "అధికారిక సిగ్నల్: ధృవీకరణ పూర్తయింది",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: சரிபார்ப்பு முடிந்தது",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಂಡಿದೆ",
          mr: "अधिकृत सिग्नल: पडताळणी पूर्ण",
          bn: "অফিসিয়াল সংকেত: যাচাইকরণ সম্পন্ন",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਤਸਦੀਕ ਪੂਰੀ",
        },
        waitSeconds: 6,
        signal: { type: "VERIFICATION_STATUS", status: "COMPLETE", verifiedAt: new Date(), source: KYS },
      },
      {
        label: {
          en: "Official signal: payment processing",
          hi: "आधिकारिक संकेत: भुगतान प्रोसेसिंग",
          te: "అధికారిక సిగ్నల్: చెల్లింపు ప్రక్రియ",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: கட்டண செயலாக்கம்",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ಪಾವತಿ ಪ್ರಕ್ರಿಯೆ",
          mr: "अधिकृत सिग्नल: पेमेंट प्रक्रिया",
          bn: "অফিসিয়াল সংকেত: পেমেন্ট প্রক্রিয়া",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ",
        },
        waitSeconds: 3,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: {
          en: "Official signal: payment credited",
          hi: "आधिकारिक संकेत: भुगतान जमा",
          te: "అధికారిక సిగ్నల్: చెల్లింపు జమ",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: கட்டணம் வரவு",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ಪಾವತಿ ಜಮೆ",
          mr: "अधिकृत सिग्नल: पेमेंट जमा",
          bn: "অফিসিয়াল সংকেত: পেমেন্ট জমা",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਭੁਗਤਾਨ ਜਮ੍ਹਾ",
        },
        waitSeconds: 3,
        signal: {
          type: "PAYMENT_STATUS",
          status: "CREDITED",
          amount: 2000,
          utr: "DEMO-UTR-2026-0002",
          bankName: "State Bank of India",
          paymentMode: "DBT",
          creditedAt: new Date(),
          verifiedAt: new Date(),
          source: KYS,
        },
      },
    ],
  },
  {
    id: "J3_PAYMENT_FAILURE",
    name: {
      en: "Payment Failure & Reprocessing",
      hi: "भुगतान विफलता और पुनः प्रयास",
      te: "చెల్లింపు వైఫల్యం మరియు పునఃప్రక్రియ",
      ta: "கட்டண தோல்வி மற்றும் மறுசெயலாக்கம்",
      kn: "ಪಾವತಿ ವೈಫಲ್ಯ ಮತ್ತು ಮರುಪ್ರಕ್ರಿಯೆ",
      mr: "पेमेंट अयशस्वी आणि पुनर्प्रक्रिया",
      bn: "পেমেন্ট ব্যর্থতা এবং পুনঃপ্রক্রিয়াকরণ",
      pa: "ਭੁਗਤਾਨ ਅਸਫਲਤਾ ਅਤੇ ਮੁੜ ਪ੍ਰਕਿਰਿਆ",
    },
    description: "Payment failed → state reviews and reprocesses → citizen can record dispute / grievance → payment reprocessed → credited.",
    steps: [
      {
        label: {
          en: "Official signal: transaction failed",
          hi: "आधिकारिक संकेत: लेनदेन विफल",
          te: "అధికారిక సిగ్నల్: లావాదేవీ విఫలమైంది",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: பரிவர்த்தனை தோல்வியடைந்தது",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ವಹಿವಾಟು ವಿಫಲವಾಗಿದೆ",
          mr: "अधिकृत सिग्नल: व्यवहार अयशस्वी",
          bn: "অফিসিয়াল সংকেত: লেনদেন ব্যর্থ হয়েছে",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਲੈਣ-ਦੇਣ ਅਸਫਲ ਹੋ ਗਿਆ",
        },
        waitSeconds: 2,
        signal: {
          type: "PAYMENT_STATUS",
          status: "FAILED",
          failureReason: "BANK_NETWORK_TIMEOUT",
          verifiedAt: new Date(),
          source: KYS,
        },
      },
      {
        label: {
          en: "Official signal: state reprocessing payment",
          hi: "आधिकारिक संकेत: राज्य द्वारा भुगतान पुनः प्रोसेस",
          te: "అధికారిక సిగ్నల్: ప్రభుత్వం చెల్లింపును మళ్ళీ ప్రాసెస్ చేస్తోంది",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: அரசு கட்டணத்தை மறுசெயலாக்குகிறது",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ಸರ್ಕಾರವು ಪಾವತಿಯನ್ನು ಮರುಪ್ರಕ್ರಿಯೆಗೊಳಿಸುತ್ತಿದೆ",
          mr: "अधिकृत सिग्नल: सरकार पेमेंट पुन्हा प्रोसेस करत आहे",
          bn: "অফিসিয়াল সংকেত: সরকার পেমেন্ট পুনরায় প্রক্রিয়া করছে",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਸਰਕਾਰ ਭੁਗਤਾਨ ਮੁੜ ਪ੍ਰਕਿਰਿਆ ਕਰ ਰਹੀ ਹੈ",
        },
        waitSeconds: 6,
        signal: { type: "PAYMENT_STATUS", status: "REPROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: {
          en: "Official signal: payment processing",
          hi: "आधिकारिक संकेत: भुगतान प्रोसेसिंग",
          te: "అధికారిక సిగ్నల్: చెల్లింపు ప్రక్రియ",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: கட்டண செயலாக்கம்",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ಪಾವತಿ ಪ್ರಕ್ರಿಯೆ",
          mr: "अधिकृत सिग्नल: पेमेंट प्रक्रिया",
          bn: "অফিসিয়াল সংকেত: পেমেন্ট প্রক্রিয়া",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ",
        },
        waitSeconds: 3,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: {
          en: "Official signal: payment credited",
          hi: "आधिकारिक संकेत: भुगतान जमा",
          te: "అధికారిక సిగ్నల్: చెల్లింపు జమ",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: கட்டணம் வரவு",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ಪಾವತಿ ಜಮೆ",
          mr: "अधिकृत सिग्नल: पेमेंट जमा",
          bn: "অফিসিয়াল সংকেত: পেমেন্ট জমা",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਭੁਗਤਾਨ ਜਮ੍ਹਾ",
        },
        waitSeconds: 4,
        signal: {
          type: "PAYMENT_STATUS",
          status: "CREDITED",
          amount: 2000,
          utr: "DEMO-UTR-2026-0003",
          bankName: "State Bank of India",
          paymentMode: "DBT",
          creditedAt: new Date(),
          verifiedAt: new Date(),
          source: KYS,
        },
      },
    ],
  },
  {
    id: "J4_NO_ACTION_WAIT",
    name: {
      en: "Payment Processing (No Action Needed)",
      hi: "भुगतान प्रक्रियाधीन (कोई कार्रवाई आवश्यक नहीं)",
      te: "చెల్లింపు ప్రక్రియలో ఉంది (చర్య అవసరం లేదు)",
      ta: "கட்டண செயலாக்கம் (எந்த நடவடிக்கையும் தேவையில்லை)",
      kn: "ಪಾವತಿ ಪ್ರಕ್ರಿಯೆ (ಯಾವುದೇ ಕ್ರಮ ಅಗತ್ಯವಿಲ್ಲ)",
      mr: "पेमेंट प्रक्रिया (कोणत्याही कृतीची आवश्यकता नाही)",
      bn: "পেমেন্ট প্রক্রিয়াধীন (কোনো পদক্ষেপের প্রয়োজন নেই)",
      pa: "ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ ਅਧੀਨ (ਕਿਸੇ ਕਾਰਵਾਈ ਦੀ ਲੋੜ ਨਹੀਂ)",
    },
    description: "Payment is in processing → farmer waits with context → automatic credit.",
    steps: [
      {
        label: {
          en: "Official signal: payment processing",
          hi: "आधिकारिक संकेत: भुगतान प्रोसेस हो रहा है",
          te: "అధికారిక సిగ్నల్: చెల్లింపు ప్రక్రియలో ఉంది",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: கட்டணம் செயலாக்கத்தில் உள்ளது",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ಪಾವತಿ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ",
          mr: "अधिकृत सिग्नल: पेमेंट प्रक्रिया सुरू आहे",
          bn: "অফিসিয়াল সংকেত: পেমেন্ট প্রক্রিয়াধীন আছে",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ ਅਧੀਨ ਹੈ",
        },
        waitSeconds: 2,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: {
          en: "Official signal: payment credited",
          hi: "आधिकारिक संकेत: भुगतान जमा",
          te: "అధికారిక సిగ్నల్: చెల్లింపు జమ",
          ta: "அதிகாரப்பூர்வ சமிக்ஞை: கட்டணம் வரவு",
          kn: "ಅಧಿಕೃತ ಸಂಕೇತ: ಪಾವತಿ ಜಮೆ",
          mr: "अधिकृत सिग्नल: पेमेंट जमा",
          bn: "অফিসিয়াল সংকেত: পেমেন্ট জমা",
          pa: "ਅਧਿਕਾਰਤ ਸਿਗਨਲ: ਭੁਗਤਾਨ ਜਮ੍ਹਾ",
        },
        waitSeconds: 4,
        signal: {
          type: "PAYMENT_STATUS",
          status: "CREDITED",
          amount: 2000,
          utr: "DEMO-UTR-2026-0004",
          bankName: "State Bank of India",
          paymentMode: "DBT",
          creditedAt: new Date(),
          verifiedAt: new Date(),
          source: KYS,
        },
      },
    ],
  },
];

export const JOURNEY_BY_ID: Record<string, Journey> = {
  ...Object.fromEntries(JOURNEYS.map((j) => [j.id, j])),
  J4_NO_ACTION: JOURNEYS.find((j) => j.id.startsWith("J4"))!,
  J4_NO_ACTION_WAIT: JOURNEYS.find((j) => j.id.startsWith("J4"))!,
};

export const ESCALATION_SIGNALS: GovernmentSignal[] = [
  { type: "PAYMENT_STATUS", status: "FAILED", failureReason: "BANK_NETWORK_TIMEOUT", verifiedAt: new Date(), source: KYS },
  { type: "PAYMENT_STATUS", status: "FAILED", failureReason: "BANK_NETWORK_TIMEOUT", verifiedAt: new Date(), source: KYS },
  { type: "PAYMENT_STATUS", status: "FAILED", failureReason: "AADHAAR_MAPPING_ERROR", verifiedAt: new Date(), source: KYS },
];
