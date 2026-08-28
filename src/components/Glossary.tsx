"use client";

import React, { useState } from "react";
import type { Lang } from "@/lib/i18n";

export interface TermDefinition {
  term: Record<Lang, string>;
  shortDef: Record<Lang, string>;
  whatItMeansForYou: Record<Lang, string>;
}

export const CIVIC_GLOSSARY: Record<string, TermDefinition> = {
  "e-KYC": {
    term: {
      en: "e-KYC",
      hi: "ई-केवाईसी",
      te: "ఇ-కెవైసి (e-KYC)",
      ta: "இ-கேஒய்சி (e-KYC)",
      kn: "ಇ-ಕೆವೈಸಿ (e-KYC)",
      mr: "ई-केवायसी (e-KYC)",
      bn: "ই-কেওয়াইসি (e-KYC)",
      pa: "ਈ-ਕੇਵਾਈਸੀ (e-KYC)",
    },
    shortDef: {
      en: "Electronic Know Your Customer — Aadhaar biometric or OTP verification.",
      hi: "इलेक्ट्रॉनिक नो योर कस्टमर — आधार बायोमेट्रिक या ओटीपी प्रमाणीकरण।",
      te: "ఎలక్ట్రానిక్ నో యువర్ కస్టమర్ — ఆధార్ బయోమెట్రిక్ లేదా OTP ధృవీకరణ.",
      ta: "எலக்ட்ரானிக் நோ யுவர் கஸ்டமர் — ஆதார் பயோமெட்ரிக் அல்லது OTP சரிபார்ப்பு.",
      kn: "ಎಲೆಕ್ಟ್ರಾನಿಕ್ ನೋ ಯುವರ್ ಕಸ್ಟಮರ್ — ಆಧಾರ್ ಬಯೋಮೆಟ್ರಿಕ್ ಅಥವಾ OTP ಪರಿಶೀಲನೆ.",
      mr: "इलेक्ट्रॉनिक नो युवर कस्टमर — आधार बायोमेट्रिक किंवा ओटीपी पडताळणी.",
      bn: "ইলেকট্রনিক নো ইয়োর কাস্টমার — আধার বায়োমেট্রিক বা ওটিপি যাচাইকরণ।",
      pa: "ਇਲੈਕਟ੍ਰਾਨਿਕ ਨੋ ਯੂਅਰ ਕਸਟਮਰ — ਆਧਾਰ ਬਾਇਓਮੈਟ੍ਰਿਕ ਜਾਂ ਓਟੀਪੀ ਤਸਦੀਕ।",
    },
    whatItMeansForYou: {
      en: "Mandatory verification to prove you are the living beneficiary of the land.",
      hi: "यह साबित करने के लिए अनिवार्य जाँच कि आप जमीन के वास्तविक लाभार्थी हैं।",
      te: "మీరే భూమికి నిజమైన లబ్ధిదారుడని నిరూపించడానికి తప్పనిసరి ధృవీకరణ.",
      ta: "நீங்கள் நிலத்தின் உண்மையான பயனாளி என்பதை நிரூபிக்க கட்டாய சரிபார்ப்பு.",
      kn: "ನೀವೇ ಭೂಮಿಯ ನಿಜವಾದ ಫಲಾನುಭವಿ ಎಂದು ಸಾಬೀತುಪಡಿಸಲು ಕಡ್ಡಾಯ ಪರಿಶೀಲನೆ.",
      mr: "तुम्ही जमिनीचे खरे लाभार्थी आहात हे सिद्ध करण्यासाठी अनिवार्य पडताळणी.",
      bn: "আপনি জমির প্রকৃত সুবিধাভোগী তা প্রমাণ করার জন্য বাধ্যতামূলক যাচাইকরণ।",
      pa: "ਇਹ ਸਾਬਤ ਕਰਨ ਲਈ ਲਾਜ਼ਮੀ ਤਸਦੀਕ ਕਿ ਤੁਸੀਂ ਜ਼ਮੀਨ ਦੇ ਅਸਲ ਲਾਭਪਾਤਰੀ ਹੋ।",
    },
  },
  "DBT": {
    term: {
      en: "DBT (Direct Benefit Transfer)",
      hi: "डीबीटी (प्रत्यक्ष लाभ अंतरण)",
      te: "DBT (ప్రత్యక్ష నగదు బదిలీ)",
      ta: "DBT (நேரடி பலன் பரிமாற்றம்)",
      kn: "DBT (ನೇರ ಲಾಭ ವರ್ಗಾವಣೆ)",
      mr: "DBT (थेट लाभ हस्तांतरण)",
      bn: "DBT (সরাসরি সুবিধা হস্তান্তর)",
      pa: "DBT (ਸਿੱਧਾ ਲਾਭ ਤਬਾਦਲਾ)",
    },
    shortDef: {
      en: "Government money sent directly from the treasury into your bank account.",
      hi: "सरकारी राशि सीधे आपके बैंक खाते में बिना किसी बिचौलिए के जमा होना।",
      te: "ప్రభుత్వ నిధులు నేరుగా ఖజానా నుండి మీ బ్యాంక్ ఖాతాకు జమ అవుతాయి.",
      ta: "அரசு நிதி நேரடியாக உங்கள் வங்கிக் கணக்கில் வரவு வைக்கப்படுகிறது.",
      kn: "ಸರ್ಕಾರಿ ಹಣವು ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.",
      mr: "सरकारी रक्कम थेट तुमच्या बँक खात्यात जमा होते.",
      bn: "সরকারি টাকা সরাসরি আপনার ব্যাঙ্ক অ্যাকাউন্টে জমা হয়।",
      pa: "ਸਰਕਾਰੀ ਪੈਸਾ ਸਿੱਧਾ ਖਜ਼ਾਨੇ ਤੋਂ ਤੁਹਾਡੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਜਮ੍ਹਾ ਹੁੰਦਾ ਹੈ।",
    },
    whatItMeansForYou: {
      en: "No middleman — funds arrive straight into your Aadhaar-linked savings account.",
      hi: "कोई बिचौलिया नहीं — पैसा सीधे आपके आधार से जुड़े बचत खाते में आता है।",
      te: "దళారులు లేరు — డబ్బు నేరుగా మీ ఆధార్ అనుసంధానిత పొదుపు ఖాతాలోకి వస్తుంది.",
      ta: "இடைத்தரகர் இல்லை — பணம் நேரடியாக உங்கள் ஆதார் இணைக்கப்பட்ட சேமிப்புக் கணக்கிற்கு வருகிறது.",
      kn: "ಯಾವುದೇ ಮಧ್ಯವರ್ತಿ ಇಲ್ಲ — ಹಣ ನೇರವಾಗಿ ನಿಮ್ಮ ಆಧಾರ್ ಲಿಂಕ್ಡ್ ಖಾತೆಗೆ ಬರುತ್ತದೆ.",
      mr: "कोणताही मध्यस्थ नाही — पैसे थेट तुमच्या आधारशी जोडलेल्या खात्यात येतात.",
      bn: "কোনো মধ্যস্থতাকারী নেই — টাকা সরাসরি আপনার আধার-সংযুক্ত অ্যাকাউন্টে পৌঁছায়।",
      pa: "ਕੋਈ ਵਿਚੋਲਾ ਨਹੀਂ — ਪੈਸਾ ਸਿੱਧਾ ਤੁਹਾਡੇ ਆਧਾਰ-ਲਿੰਕਡ ਬਚਤ ਖਾਤੇ ਵਿੱਚ ਆਉਂਦਾ ਹੈ।",
    },
  },
  "NPCI": {
    term: {
      en: "NPCI (National Payments Corporation of India)",
      hi: "एनपीसीआई (भारतीय राष्ट्रीय भुगतान निगम)",
      te: "NPCI (నేషనల్ పేమెంట్స్ కార్పొరేషన్ ఆఫ్ ఇండియా)",
      ta: "NPCI (இந்திய தேசிய கொடுப்பனவு கழகம்)",
      kn: "NPCI (ಭಾರತೀಯ ರಾಷ್ಟ್ರೀಯ ಪಾವತಿ ನಿಗಮ)",
      mr: "NPCI (भारतीय राष्ट्रीय पेमेंट कॉर्पोरेशन)",
      bn: "NPCI (ন্যাশনাল পেমেন্টস কর্পোরেশন অব ইন্ডিয়া)",
      pa: "NPCI (ਨੈਸ਼ਨਲ ਪੇਮੈਂਟਸ ਕਾਰਪੋਰੇਸ਼ਨ ਆਫ ਇੰਡੀਆ)",
    },
    shortDef: {
      en: "The central banking network that routes DBT payments to your Aadhaar-seeded bank account.",
      hi: "केंद्रीय बैंकिंग नेटवर्क जो सरकारी डीबीटी भुगतान को आपके आधार से जुड़े बैंक में भेजता है।",
      te: "ఆధార్ అనుసంధానిత బ్యాంక్ ఖాతాకు నిధులను పంపే కేంద్ర బ్యాంకింగ్ నెట్‌వర్క్.",
      ta: "டிபிடி கொடுப்பனவுகளை ஆதார் கணக்கிற்கு வழிநடத்தும் மத்திய வங்கி நெட்வொர்க்.",
      kn: "ಆಧಾರ್ ಲಿಂಕ್ ಮಾಡಲಾದ ಖಾತೆಗೆ ಹಣ ಕಳುಹಿಸುವ ಕೇಂದ್ರ ಬ್ಯಾಂಕಿಂಗ್ ನೆಟ್‌ವರ್ಕ್.",
      mr: "आधारशी जोडलेल्या बँक खात्यात रक्कम पाठवणारे केंद्रीय बँकिंग नेटवर्क.",
      bn: "কেন্দ্রীয় ব্যাঙ্কিং নেটওয়ার্ক যা আপনার আধার-যুক্ত অ্যাকাউন্টে অর্থ পাঠায়।",
      pa: "ਕੇਂਦਰੀ ਬੈਂਕਿੰਗ ਨੈੱਟਵਰਕ ਜੋ ਤੁਹਾਡੇ ਆਧਾਰ-ਸੀਡਡ ਖਾਤੇ ਵਿੱਚ ਭੁਗਤਾਨ ਭੇਜਦਾ ਹੈ।",
    },
    whatItMeansForYou: {
      en: "If NPCI seeding is inactive, money bounces even if your bank account is active.",
      hi: "यदि एनपीसीआई सीडिंग बंद है, तो खाता सक्रिय होने पर भी सरकारी पैसा वापस लौट जाता है।",
      te: "NPCI సీడింగ్ నిష్క్రియంగా ఉంటే, బ్యాంక్ ఖాతా యాక్టివ్‌గా ఉన్నా డబ్బులు వెనక్కి వెళ్తాయి.",
      ta: "NPCI இணைப்பு செயலில் இல்லாவிட்டால், வங்கிக் கணக்கு இருந்தாலும் பணம் திரும்பும்.",
      kn: "NPCI ಸೀಡಿಂಗ್ ನಿಷ್ಕ್ರಿಯವಾಗಿದ್ದರೆ, ಖಾತೆ ಸಕ್ರಿಯವಾಗಿದ್ದರೂ ಹಣ ವಾಪಸ್ ಹೋಗುತ್ತದೆ.",
      mr: "NPCI सीडिंग बंद असल्यास, खाते सक्रिय असूनही पैसे परत जातात.",
      bn: "NPCI সিডিং সক্রিয় না থাকলে, অ্যাকাউন্ট সচল থাকলেও টাকা ফেরত চলে যায়।",
      pa: "ਜੇਕਰ NPCI ਸੀਡਿੰਗ ਬੰਦ ਹੈ, ਤਾਂ ਖਾਤਾ ਚਾਲੂ ਹੋਣ ਦੇ ਬਾਵਜੂਦ ਪੈਸਾ ਵਾਪਸ ਮੁੜ ਜਾਂਦਾ ਹੈ।",
    },
  },
  "CSC": {
    term: {
      en: "CSC (Common Services Center)",
      hi: "सीएससी (जन सेवा केंद्र)",
      te: "CSC (సాధారణ సేవా కేంద్రం)",
      ta: "CSC (பொது சேவை மையம்)",
      kn: "CSC (ಸಾಮಾನ್ಯ ಸೇವಾ ಕೇಂದ್ರ)",
      mr: "सीएससी (नागरी सेवा केंद्र)",
      bn: "সিএসসি (কমন সার্ভিস সেন্টার)",
      pa: "ਸੀਐਸਸੀ (ਕਾਮਨ ਸਰਵਿਸਿਜ਼ ਸੈਂਟਰ)",
    },
    shortDef: {
      en: "Government-authorized village kiosk with biometric fingerprint scanners and internet.",
      hi: "सरकारी मान्यता प्राप्त ग्राम सेवा केंद्र जहाँ बायोमेट्रिक मशीन और इंटरनेट सुविधा होती है।",
      te: "బయోమెట్రిక్ స్కానర్లు మరియు ఇంటర్నెట్ ఉన్న ప్రభుత్వ అధీకృత గ్రామ సేవా కేంద్రం.",
      ta: "பயோமெட்ரிக் ஸ்கேனர்கள் கொண்ட அரசு அங்கீகாரம் பெற்ற கிராம சேவை மையம்.",
      kn: "ಬಯೋಮೆಟ್ರಿಕ್ ಮತ್ತು ಇಂಟರ್ನೆಟ್ ಸೌಲಭ್ಯವಿರುವ ಸರ್ಕಾರಿ ಅಧಿಕೃತ ಗ್ರಾಮ ಕೇಂದ್ರ.",
      mr: "बायोमेट्रिक आणि इंटरनेट सुविधा असलेले सरकारी मान्यताप्राप्त केंद्र.",
      bn: "বায়োমেট্রিক এবং ইন্টারনেট সুবিধা সম্পন্ন সরকারি অনুমোদিত সেবা কেন্দ্র।",
      pa: "ਬਾਇਓਮੈਟ੍ਰਿਕ ਫਿੰਗਰਪ੍ਰਿੰਟ ਸਕੈਨਰ ਵਾਲਾ ਸਰਕਾਰੀ ਮਾਨਤਾ ਪ੍ਰਾਪਤ ਗ੍ਰਾਮ ਸੇਵਾ ਕੇਂਦਰ।",
    },
    whatItMeansForYou: {
      en: "Visit any local CSC to complete fingerprint e-KYC in 2 minutes for ₹15.",
      hi: "₹15 में 2 मिनट में फिंगरप्रिंट ई-केवाईसी कराने के लिए नज़दीकी सीएससी जाएँ।",
      te: "₹15 చెల్లించి 2 నిమిషాల్లో వేలిముద్ర ఇ-కెవైసి పూర్తి చేయడానికి స్థానిక CSC ని సందర్శించండి.",
      ta: "₹15 கட்டணத்தில் 2 நிமிடங்களில் கைரேகை இ-கேஒய்சி முடிக்க அருகிலுள்ள CSC ஐ அணுகவும்.",
      kn: "₹15 ಕ್ಕೆ 2 ನಿಮಿಷಗಳಲ್ಲಿ ಫಿಂಗರ್‌ಪ್ರಿಂಟ್ ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಳಿಸಲು ಹತ್ತಿರದ CSC ಗೆ ಭೇಟಿ ನೀಡಿ.",
      mr: "₹15 मध्ये 2 मिनिटांत फिंगरप्रिंट ई-केवायसी पूर्ण करण्यासाठी जवळच्या सीएससीला भेट द्या.",
      bn: "₹15 দিয়ে 2 মিনিটে ফিঙ্গারপ্রিন্ট ই-কেওয়াইসি সম্পন্ন করতে নিকটস্থ সিএসসিতে যান।",
      pa: "₹15 ਵਿੱਚ 2 ਮਿੰਟਾਂ ਅੰਦਰ ਫਿੰਗਰਪ੍ਰਿੰਟ ਈ-ਕੇਵਾਈਸੀ ਪੂਰੀ ਕਰਨ ਲਈ ਨਜ਼ਦੀਕੀ ਸੀਐਸਸੀ ਜਾਓ।",
    },
  },
};

const WHAT_IT_MEANS: Record<Lang, string> = {
  en: "What it means for you:",
  hi: "आपके लिए इसका क्या अर्थ है:",
  te: "దీని అర్థం మీ కోసం:",
  ta: "உங்களுக்கான இதன் பொருள்:",
  kn: "ನಿಮಗಾಗಿ ಇದರ ಅರ್ಥ:",
  mr: "आपल्यासाठी याचा काय अर्थ आहे:",
  bn: "আপনার জন্য এর অর্থ:",
  pa: "ਤੁਹਾਡੇ ਲਈ ਇਸਦਾ ਕੀ ਅਰਥ ਹੈ:",
};

export function GlossaryText({
  text,
  lang,
}: {
  text: string;
  lang: Lang;
}) {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  const termKeys = Object.keys(CIVIC_GLOSSARY);
  const regex = new RegExp(`\\b(${termKeys.join("|")})\\b`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => {
        const matchedKey = termKeys.find(
          (k) => k.toLowerCase() === part.toLowerCase()
        );

        if (!matchedKey) {
          return <React.Fragment key={i}>{part}</React.Fragment>;
        }

        const info = CIVIC_GLOSSARY[matchedKey];
        const isHovered = activeTerm === matchedKey;

        return (
          <span
            key={i}
            className="relative inline-block"
            onMouseEnter={() => setActiveTerm(matchedKey)}
            onMouseLeave={() => setActiveTerm(null)}
            onClick={() => setActiveTerm(isHovered ? null : matchedKey)}
          >
            <span className="cursor-help border-b border-dotted border-stone-500 font-medium text-stone-900 transition hover:border-stone-900 hover:bg-stone-100/60 rounded px-0.5">
              {part}
            </span>

            {/* Apple-style Tooltip Popover */}
            {isHovered && (
              <span className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-2xl border border-stone-200 bg-stone-900 p-3.5 text-xs text-white shadow-xl animate-in fade-in zoom-in-95 duration-150 sm:w-72">
                <span className="block font-bold text-emerald-400">
                  {info.term[lang] ?? info.term.en}
                </span>
                <span className="mt-1 block text-stone-300 font-normal leading-relaxed">
                  {info.shortDef[lang] ?? info.shortDef.en}
                </span>
                <span className="mt-2 block border-t border-stone-800 pt-1.5 text-[11px] text-stone-400">
                  <strong className="text-stone-200">
                    {WHAT_IT_MEANS[lang] ?? WHAT_IT_MEANS.en}
                  </strong>{" "}
                  {info.whatItMeansForYou[lang] ?? info.whatItMeansForYou.en}
                </span>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
