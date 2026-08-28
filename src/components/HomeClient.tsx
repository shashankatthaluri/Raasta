"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CreateCase } from "@/components/CreateCase";
import { IntakeForm } from "@/components/IntakeForm";
import { LanguageGate } from "@/components/LanguageGate";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { RaastaLogoEmblem } from "@/components/RaastaLogo";
import {
  BuildingBankIcon,
  AlertCircleIcon,
  RupeeIcon,
  PauseIcon,
  HelpCircleIcon,
  SettingsIcon,
} from "@/components/Icons";
import { getStoredLanguage, setStoredLanguage, SUPPORTED_LANGUAGES, type Lang } from "@/lib/i18n";

/**
 * Entry — client side. The server has already decided initialLang from the
 * cookie (see app/page.tsx): null → fresh visitor → LANGUAGE GATE; otherwise
 * the landing renders directly in the stored language (no gate flash, no
 * auto-jump — the server never paints the gate for returning visitors).
 *
 * Landing is check-first: "Let's check your PM-KISAN". The citizen never has
 * to diagnose the problem; free-text intake is the secondary path.
 *
 * Data boundary: the check uses the existing SIMULATED government adapter.
 * No live KYS integration, no live beneficiary data.
 */

const DEMO_REG_NUMBER = "10203040506"; // 11 digits, mirroring the official KYS format

const PROMPTS: ReadonlyArray<{ code: Lang; text: string }> = [
  { code: "en", text: "Choose your language" },
  { code: "hi", text: "अपनी भाषा चुनें" },
  { code: "te", text: "మీ భాషను ఎంచుకోండి" },
  { code: "ta", text: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்" },
  { code: "kn", text: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
  { code: "mr", text: "तुमची भाषा निवडा" },
  { code: "bn", text: "আপনার ভাষা নির্বাচন করুন" },
  { code: "pa", text: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ" },
];

const QUICK_OPTIONS: ReadonlyArray<{
  journeyId: string;
  label: Record<Lang, string>;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    journeyId: "J3_PAYMENT_FAILURE",
    label: {
      en: "My payment did not come",
      hi: "मेरा पैसा नहीं आया",
      te: "నా చెల్లింపు రాలేదు",
      ta: "என் பணம் வரவில்லை",
      kn: "ನನ್ನ ಪಾವತಿ ಬರಲಿಲ್ಲ",
      mr: "माझे पैसे आले नाहीत",
      bn: "আমার টাকা আসেনি",
      pa: "ਮੇਰਾ ਪੈਸਾ ਨਹੀਂ ਆਇਆ",
    },
    icon: RupeeIcon,
  },
  {
    journeyId: "J1_FARMER_EKYC",
    label: {
      en: "My installment is stopped",
      hi: "मेरी किश्त रुक गई है",
      te: "నా చెల్లింపు ఆగిపోయింది",
      ta: "என் தவணை நிறுத்தப்பட்டது",
      kn: "ನನ್ನ ಕಂತು ನಿಂತಿದೆ",
      mr: "माझा हप्ता थांबला आहे",
      bn: "আমার কিস্তি বন্ধ হয়ে গেছে",
      pa: "ਮੇਰੀ ਕਿਸ਼ਤ ਰੁਕ ਗਈ ਹੈ",
    },
    icon: PauseIcon,
  },
  {
    journeyId: "J2_GOVT_VERIFICATION",
    label: {
      en: "Other problem",
      hi: "अन्य समस्या",
      te: "ఇతర సమస్య",
      ta: "மற்ற பிரச்சினை",
      kn: "ಇತರ ಸಮಸ್ಯೆ",
      mr: "इतर अडचण",
      bn: "অন্যান্য সমস্যা",
      pa: "ਹੋਰ ਸਮੱਸਿਆ",
    },
    icon: HelpCircleIcon,
  },
];

const JOURNEY_CARDS: ReadonlyArray<{
  journeyId: string;
  label: Record<Lang, string>;
  description: Record<Lang, string>;
}> = [
  {
    journeyId: "J1_FARMER_EKYC",
    label: {
      en: "J1 — Farmer action",
      hi: "J1 — किसान कार्रवाई",
      te: "J1 — రైతు చర్య",
      ta: "J1 — விவசாயி நடவடிக்கை",
      kn: "J1 — ರೈತರ ಕ್ರಮ",
      mr: "J1 — शेतकरी कृती",
      bn: "J1 — কৃষকের পদক্ষেপ",
      pa: "J1 — ਕਿਸਾਨ ਕਾਰਵਾਈ",
    },
    description: {
      en: "Payment missing → e-KYC required → one action → verified → credited.",
      hi: "भुगतान नहीं आया → ई-केवाईसी आवश्यक → एक कार्रवाई → सत्यापित → जमा।",
      te: "చెల్లింపు రాలేదు → ఇ-కెవైసి అవసరం → ఒక చర్య → ధృవీకరించబడింది → ఖాతాలో జమ.",
      ta: "பணம் வரவில்லை → இ-கேஒய்சி தேவை → ஒரு நடவடிக்கை → சரிபார்க்கப்பட்டது → வரவு.",
      kn: "ಪಾವತಿ ಬರಲಿಲ್ಲ → ಇ-ಕೆವೈಸಿ ಅಗತ್ಯವಿದೆ → ಒಂದು ಕ್ರಮ → ಪರಿಶೀಲಿಸಲಾಗಿದೆ → ಜಮೆ.",
      mr: "पैसे आले नाहीत → ई-केवायसी आवश्यक → एक कृती → पडताळणी झाली → जमा.",
      bn: "টাকা আসেনি → ই-কেওয়াইসি প্রয়োজন → একটি পদক্ষেপ → যাচাইকৃত → জমা।",
      pa: "ਪੈਸਾ ਨਹੀਂ ਆਇਆ → ਈ-ਕੇਵਾਈਸੀ ਲੋੜੀਂਦਾ → ਇੱਕ ਕਾਰਵਾਈ → ਤਸਦੀਕ → ਜਮ੍ਹਾ।",
    },
  },
  {
    journeyId: "J2_GOVT_VERIFICATION",
    label: {
      en: "J2 — Government action",
      hi: "J2 — सरकारी कार्रवाई",
      te: "J2 — ప్రభుత్వ చర్య",
      ta: "J2 — அரசு நடவடிக்கை",
      kn: "J2 — ಸರ್ಕಾರದ ಕ್ರಮ",
      mr: "J2 — सरकारी कृती",
      bn: "J2 — সরকারি পদক্ষেপ",
      pa: "J2 — ਸਰਕਾਰੀ ਕਾਰਵਾਈ",
    },
    description: {
      en: "State verification → the state has the next action → credited.",
      hi: "राज्य सत्यापन → अगली कार्रवाई राज्य की → जमा।",
      te: "రాష్ట్ర స్థాయి ధృవీకరణ → తదుపరి చర్య ప్రభుత్వానిది → జమ.",
      ta: "மாநில சரிபார்ப்பு → அடுத்த நடவடிக்கை அரசினுடையது → வரவு.",
      kn: "ರಾಜ್ಯ ಪರಿಶೀಲನೆ → ಮುಂದಿನ ಕ್ರಮ ಸರ್ಕಾರದ್ದು → ಜಮೆ.",
      mr: "राज्य पडताळणी → पुढील कृती सरकारची → जमा.",
      bn: "রাজ্য যাচাইকরণ → পরবর্তী পদক্ষেপ সরকারের → জমা।",
      pa: "ਰਾਜ ਤਸਦੀਕ → ਅਗਲੀ ਕਾਰਵਾਈ ਸਰਕਾਰ ਦੀ → ਜਮ੍ਹਾ।",
    },
  },
  {
    journeyId: "J3_PAYMENT_FAILURE",
    label: {
      en: "J3 — Payment failure & dispute",
      hi: "J3 — भुगतान विफलता और शिकायत",
      te: "J3 — చెల్లింపు వైఫల్యం మరియు వివాదం",
      ta: "J3 — கட்டண தோல்வி மற்றும் சர்ச்சை",
      kn: "J3 — ಪಾವತಿ ವೈಫಲ್ಯ ಮತ್ತು ದೂರು",
      mr: "J3 — पेमेंट अयशस्वी आणि तक्रार",
      bn: "J3 — পেমেন্ট ব্যর্থতা এবং অভিযোগ",
      pa: "J3 — ਭੁਗਤਾਨ ਅਸਫਲਤਾ ਅਤੇ ਸ਼ਿਕਾਇਤ",
    },
    description: {
      en: "Transaction failed → government reprocesses → bank dispute option → credited.",
      hi: "लेनदेन विफल → सरकार पुनः प्रयास करेगी → बैंक शिकायत का विकल्प → जमा।",
      te: "లావాదేవీ విఫలమైంది → ప్రభుత్వం పునఃప్రక్రియ చేస్తుంది → బ్యాంక్ వివాద ఎంపిక → జమ.",
      ta: "பரிவர்த்தனை தோல்வி → அரசு மறுசெயலாக்கம் செய்யும் → வங்கி புகார் → வரவு.",
      kn: "ವಹಿವಾಟು ವಿಫಲವಾಗಿದೆ → ಸರ್ಕಾರ ಮರುಪ್ರಕ್ರಿಯೆಗೊಳಿಸುತ್ತದೆ → ಬ್ಯಾಂಕ್ ದೂರು → ಜಮೆ.",
      mr: "व्यवहार अयशस्वी → सरकार पुनर्प्रक्रिया करेल → बँक तक्रार पर्याय → जमा.",
      bn: "লেনদেন ব্যর্থ → সরকার পুনঃপ্রক্রিয়াকরণ করবে → ব্যাঙ্ক বিরোধের বিকল্প → জমা।",
      pa: "ਲੈਣ-ਦੇਣ ਅਸਫਲ → ਸਰਕਾਰ ਮੁੜ ਪ੍ਰਕਿਰਿਆ ਕਰੇਗੀ → ਬੈਂਕ ਸ਼ਿਕਾਇਤ → ਜਮ੍ਹਾ।",
    },
  },
  {
    journeyId: "J4_NO_ACTION_WAIT",
    label: {
      en: "J4 — No action needed",
      hi: "J4 — किसी कार्रवाई की आवश्यकता नहीं",
      te: "J4 — ఎలాంటి చర్య అవసరం లేదు",
      ta: "J4 — எந்த நடவடிக்கையும் தேவையில்லை",
      kn: "J4 — ಯಾವುದೇ ಕ್ರಮದ ಅಗತ್ಯವಿಲ್ಲ",
      mr: "J4 — कोणत्याही कृतीची आवश्यकता नाही",
      bn: "J4 — কোনো পদক্ষেপের প্রয়োজন নেই",
      pa: "J4 — ਕਿਸੇ ਕਾਰਵਾਈ ਦੀ ਲੋੜ ਨਹੀਂ",
    },
    description: {
      en: "Payment is processing → no action needed → credited.",
      hi: "भुगतान प्रक्रिया में है → किसी कार्रवाई की आवश्यकता नहीं → जमा।",
      te: "చెల్లింపు ప్రక్రియలో ఉంది → చర్య అవసరం లేదు → జమ.",
      ta: "பணம் செயலாக்கத்தில் உள்ளது → எந்த நடவடிக்கையும் தேவையில்லை → வரவு.",
      kn: "ಪಾವತಿ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ → ಯಾವುದೇ ಕ್ರಮ ಅಗತ್ಯವಿಲ್ಲ → ಜಮೆ.",
      mr: "पेमेंट प्रक्रियेत आहे → कोणत्याही कृतीची आवश्यकता नाही → जमा.",
      bn: "পেমেন্ট প্রক্রিয়াধীন → কোনো পদক্ষেপের প্রয়োজন নেই → জমা।",
      pa: "ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ ਅਧੀਨ ਹੈ → ਕਿਸੇ ਕਾਰਵਾਈ ਦੀ ਲੋੜ ਨਹੀਂ → ਜਮ੍ਹਾ।",
    },
  },
];

const COPY: Record<Lang, {
  header: string;
  checkTitle: string;
  checkSub: string;
  regLabel: string;
  regPlaceholder: string;
  demoHint: string;
  checkButton: string;
  checking: string;
  checkError: string;
  or: string;
  orSub: string;
  scenarios: string;
  scenariosSub: string;
  boundary: string;
  principle: string;
  digitsLabel: string;
  errorNotice: string;
  demoBadge: string;
}> = {
  en: {
    header: "Raasta · PM-KISAN",
    checkTitle: "Let's check your PM-KISAN",
    checkSub: "Enter your 11-digit registration number. We'll check what changed, explain what it means, and guide your next step.",
    regLabel: "PM-KISAN registration number",
    regPlaceholder: "11-digit registration number",
    demoHint: "Simulated PM-KISAN records",
    checkButton: "Check my PM-KISAN",
    checking: "Checking…",
    checkError: "Could not check your PM-KISAN. Please try again.",
    or: "Or describe what happened",
    orSub: "If you know something is wrong, describe it in your own words.",
    scenarios: "Demo scenarios (J1–J4)",
    scenariosSub: "4 simulated journeys for evaluation",
    boundary: "Simulated demonstration based on official PM-KISAN operational rules · No private data accessed.",
    principle: "Rules determine reality. AI explains reality.",
    digitsLabel: "digits",
    errorNotice: "Notice:",
    demoBadge: "Demo",
  },
  hi: {
    header: "रास्ता · PM-KISAN",
    checkTitle: "आइए आपका PM-KISAN देखें",
    checkSub: "अपना 11 अंकों का पंजीकरण नंबर दर्ज करें। हम देखेंगे कि क्या बदला है, उसका मतलब समझाएँगे और अगले कदम में मदद करेंगे।",
    regLabel: "PM-KISAN पंजीकरण नंबर",
    regPlaceholder: "11 अंकों का पंजीकरण नंबर",
    demoHint: "अनुकरणित PM-KISAN रिकॉर्ड",
    checkButton: "मेरा PM-KISAN जाँचें",
    checking: "जाँच हो रही है…",
    checkError: "आपका PM-KISAN जाँचा नहीं जा सका। कृपया फिर कोशिश करें।",
    or: "या हमें बताएँ क्या हुआ",
    orSub: "अगर आपको समस्या पता है, तो अपने शब्दों में बताएँ।",
    scenarios: "डेमो परिदृश्य (J1–J4)",
    scenariosSub: "मूल्यांकन के लिए 4 परिदृश्य",
    boundary: "आधिकारिक PM-KISAN नियमों पर आधारित अनुकरणित डेमो · कोई व्यक्तिगत डेटा एक्सेस नहीं किया जाता।",
    principle: "नियम वास्तविकता तय करते हैं। एआई समझाती है।",
    digitsLabel: "अंक",
    errorNotice: "सूचना:",
    demoBadge: "डेमो",
  },
  te: {
    header: "రాస్తా · PM-KISAN",
    checkTitle: "మీ PM-KISAN వివరాలను చూద్దాం",
    checkSub: "మీ 11 అంకెల రిజిస్ట్రేషన్ నంబర్‌ను నమోదు చేయండి. ఏమి మారిందో పరిశీలించి, కారణాన్ని వివరించి, తదుపరి చర్యలో సహాయం చేస్తాం.",
    regLabel: "PM-KISAN రిజిస్ట్రేషన్ నంబర్",
    regPlaceholder: "11 అంకెల రిజిస్ట్రేషన్ నంబర్",
    demoHint: "నమూనా PM-KISAN రికార్డులు",
    checkButton: "నా PM-KISAN తనిఖీ చేయండి",
    checking: "తనిఖీ జరుగుతోంది…",
    checkError: "మీ PM-KISAN తనిఖీ చేయడం సాధ్యం కాలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    or: "లేదా ఏమి జరిగిందో చెప్పండి",
    orSub: "ఏదైనా సమస్య ఉంటే మీ స్వంత మాటల్లో వివరించండి.",
    scenarios: "డెమో ప్రయాణాలు (J1–J4)",
    scenariosSub: "మూల్యాంకనం కోసం 4 నమూనా పరిస్థితులు",
    boundary: "అధికారిక PM-KISAN నిబంధనల ఆధారంగా నమూనా డెమో · ప్రైవేట్ డేటా ఏదీ తీసుకోబడదు.",
    principle: "నిబంధనలు వాస్తవాన్ని నిర్ణయిస్తాయి. AI వివరిస్తుంది.",
    digitsLabel: "అంకెలు",
    errorNotice: "గమనిక:",
    demoBadge: "డెమో",
  },
  ta: {
    header: "ராஸ்தா · PM-KISAN",
    checkTitle: "உங்கள் PM-KISAN நிலையை சரிபார்ப்போம்",
    checkSub: "உங்கள் 11 இலக்க பதிவு எண்ணை உள்ளிடவும். என்ன மாறியுள்ளது என்பதை சரிபார்த்து அடுத்த கட்ட வழிகாட்டலை வழங்குவோம்.",
    regLabel: "PM-KISAN பதிவு எண்",
    regPlaceholder: "11 இலக்க பதிவு எண்",
    demoHint: "மாதிரி PM-KISAN பதிவுகள்",
    checkButton: "என் PM-KISAN ஐ சரிபார்க்கவும்",
    checking: "சரிபார்க்கப்படுகிறது…",
    checkError: "PM-KISAN ஐ சரிபார்க்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    or: "அல்லது என்ன நடந்தது என்பதை விவரிக்கவும்",
    orSub: "பிரச்சினை தெரிந்தால் உங்கள் சொந்த வார்த்தைகளில் கூறவும்.",
    scenarios: "மாதிரி நிலைகள் (J1–J4)",
    scenariosSub: "மதிப்பீட்டிற்கான 4 மாதிரி நிலைகள்",
    boundary: "அதிகாரப்பூர்வ PM-KISAN விதிகளின் அடிப்படையிலான மாதிரி · தனிப்பட்ட தரவு எதுவும் அணுகப்படவில்லை.",
    principle: "விதிகள் யதார்த்தத்தை தீர்மானிக்கின்றன. AI விளக்குகிறது.",
    digitsLabel: "இலக்கங்கள்",
    errorNotice: "அறிவிப்பு:",
    demoBadge: "மாதிரி",
  },
  kn: {
    header: "ರಾಸ್ತಾ · PM-KISAN",
    checkTitle: "ನಿಮ್ಮ PM-KISAN ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸೋಣ",
    checkSub: "ನಿಮ್ಮ 11 ಅಂಕಿಗಳ ನೋಂದಣಿ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ. ಏನು ಬದಲಾಗಿದೆ ಎಂದು ಪರಿಶೀಲಿಸಿ ಮುಂದಿನ ಹಂತಕ್ಕೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತೇವೆ.",
    regLabel: "PM-KISAN ನೋಂದಣಿ ಸಂಖ್ಯೆ",
    regPlaceholder: "11 ಅಂಕಿಗಳ ನೋಂದಣಿ ಸಂಖ್ಯೆ",
    demoHint: "ಮಾದರಿ PM-KISAN ದಾಖಲೆಗಳು",
    checkButton: "ನನ್ನ PM-KISAN ಪರಿಶೀಲಿಸಿ",
    checking: "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…",
    checkError: "ಪರಿಶೀಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    or: "ಅಥವಾ ಏನಾಯಿತು ಎಂದು ತಿಳಿಸಿ",
    orSub: "ಸಮಸ್ಯೆಯಿದ್ದರೆ ನಿಮ್ಮ ಸ್ವಂತ ಮಾತುಗಳಲ್ಲಿ ವಿವರಿಸಿ.",
    scenarios: "ಡೆಮೊ ಸನ್ನಿವೇಶಗಳು (J1–J4)",
    scenariosSub: "ಮೌಲ್ಯಮಾಪನಕ್ಕಾಗಿ 4 ಮಾದರಿಗಳು",
    boundary: "ಅಧಿಕೃತ ನಿಯಮಗಳ ಆಧಾರಿತ ಮಾದರಿ · ಯಾವುದೇ ಖಾಸಗಿ ಡೇಟಾವನ್ನು ಪ್ರವೇಶಿಸಲಾಗಿಲ್ಲ.",
    principle: "ನಿಯಮಗಳು ವಾಸ್ತವವನ್ನು ನಿರ್ಧರಿಸುತ್ತವೆ. AI ವಿವರಿಸುತ್ತದೆ.",
    digitsLabel: "ಅಂಕಿಗಳು",
    errorNotice: "ಸೂಚನೆ:",
    demoBadge: "ಡೆಮೊ",
  },
  mr: {
    header: "रास्ता · PM-KISAN",
    checkTitle: "चला तुमचे PM-KISAN तपासूया",
    checkSub: "तुमचा 11 अंकी नोंदणी क्रमांक प्रविष्ट करा. काय बदलले आहे ते तपासून पुढील पायरीसाठी मार्गदर्शन करू.",
    regLabel: "PM-KISAN नोंदणी क्रमांक",
    regPlaceholder: "11 अंकी नोंदणी क्रमांक",
    demoHint: "नमुना PM-KISAN नोंदी",
    checkButton: "माझे PM-KISAN तपासा",
    checking: "तपासणी सुरू आहे…",
    checkError: "PM-KISAN तपासता आले नाही. कृपया पुन्हा प्रयत्न करा.",
    or: "किंवा काय घडले ते सांगा",
    orSub: "काही अडचण असल्यास तुमच्या शब्दांत सांगा.",
    scenarios: "डेमो परिस्थिती (J1–J4)",
    scenariosSub: "मूल्यांकनासाठी 4 नमुना प्रवास",
    boundary: "अधिकृत नियमांवर आधारित नमुना डेमो · कोणताही खाजगी डेटा वापरला जात नाही.",
    principle: "नियम वास्तव ठरवतात. AI समजावून सांगते.",
    digitsLabel: "अंक",
    errorNotice: "सूचना:",
    demoBadge: "डेमो",
  },
  bn: {
    header: "রাস্তা · PM-KISAN",
    checkTitle: "আসুন আপনার PM-KISAN পরীক্ষা করি",
    checkSub: "আপনার 11 সংখ্যার নিবন্ধন নম্বর লিখুন। কী পরিবর্তন হয়েছে তা পরীক্ষা করে পরবর্তী পদক্ষেপের জন্য সহায়তা করব।",
    regLabel: "PM-KISAN নিবন্ধন নম্বর",
    regPlaceholder: "11 সংখ্যার নিবন্ধন নম্বর",
    demoHint: "নমুনা PM-KISAN রেকর্ড",
    checkButton: "আমার PM-KISAN পরীক্ষা করুন",
    checking: "পরীক্ষা করা হচ্ছে…",
    checkError: "পরীক্ষা করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
    or: "অথবা কী হয়েছে তা বলুন",
    orSub: "কোনো সমস্যা থাকলে নিজের ভাষায় লিখুন।",
    scenarios: "ডেমো পরিস্থিতি (J1–J4)",
    scenariosSub: "মূল্যায়নের জন্য 4টি নমুনা",
    boundary: "অফিসিয়াল নিয়মের ওপর ভিত্তি করে তৈরি নমুনা ডেমো · কোনো ব্যক্তিগত তথ্য সংগ্রহ করা হয় না।",
    principle: "নিয়ম বাস্তব নির্ধারণ করে। AI ব্যাখ্যা করে।",
    digitsLabel: "সংখ্যা",
    errorNotice: "বিজ্ঞপ্তি:",
    demoBadge: "ডেমো",
  },
  pa: {
    header: "ਰਾਸਤਾ · PM-KISAN",
    checkTitle: "ਆਓ ਤੁਹਾਡਾ PM-KISAN ਚੈੱਕ ਕਰੀਏ",
    checkSub: "ਆਪਣਾ 11 ਅੰਕਾਂ ਦਾ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨੰਬਰ ਦਰਜ ਕਰੋ। ਅਸੀਂ ਦੇਖਾਂਗੇ ਕੀ ਬਦਲਿਆ ਹੈ ਅਤੇ ਅਗਲੇ ਕਦਮ ਵਿੱਚ ਮਦਦ ਕਰਾਂਗੇ।",
    regLabel: "PM-KISAN ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨੰਬਰ",
    regPlaceholder: "11 ਅੰਕਾਂ ਦਾ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨੰਬਰ",
    demoHint: "ਨਮੂਨਾ PM-KISAN ਰਿਕਾਰਡ",
    checkButton: "ਮੇਰਾ PM-KISAN ਚੈੱਕ ਕਰੋ",
    checking: "ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ…",
    checkError: "ਜਾਂਚ ਨਹੀਂ ਹੋ ਸਕੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    or: "ਜਾਂ ਦੱਸੋ ਕੀ ਹੋਇਆ",
    orSub: "ਜੇਕਰ ਕੋਈ ਸਮੱਸਿਆ ਹੈ ਤਾਂ ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਦੱਸੋ।",
    scenarios: "ਡੈਮੋ ਸਥਿਤੀਆਂ (J1–J4)",
    scenariosSub: "ਮੁਲਾਂਕਣ ਲਈ 4 ਨਮੂਨੇ",
    boundary: "ਅਧਿਕਾਰਤ ਨਿਯਮਾਂ 'ਤੇ ਆਧਾਰਿਤ ਨਮੂਨਾ · ਕੋਈ ਨਿੱਜੀ ਡਾਟਾ ਨਹੀਂ ਲਿਆ ਜਾਂਦਾ।",
    principle: "ਨਿਯਮ ਅਸਲੀਅਤ ਤੈਅ ਕਰਦੇ ਹਨ। AI ਸਮਝਾਉਂਦੀ ਹੈ।",
    digitsLabel: "ਅੰਕ",
    errorNotice: "ਸੂਚਨਾ:",
    demoBadge: "ਡੈਮੋ",
  },
};

const DEMO_BADGES: Record<Lang, string> = {
  en: "Demo",
  hi: "डेमो",
  te: "డెమో",
  ta: "மாதிரி",
  kn: "ಡೆಮೊ",
  mr: "डेमो",
  bn: "ডেমো",
  pa: "ਡੈਮੋ",
};

const WORDMARKS: Record<Lang, string> = {
  en: "Raasta",
  hi: "रास्ता",
  te: "రాస్తా",
  ta: "ராஸ்தா",
  kn: "ರಾಸ್ತಾ",
  mr: "रास्ता",
  bn: "রাস্তা",
  pa: "ਰਾਸਤਾ",
};

const TAGLINES: Record<Lang, string> = {
  en: "What happens next",
  hi: "आगे क्या होगा",
  te: "తర్వాత ఏమి జరుగుతుంది",
  ta: "அடுத்து என்ன நடக்கும்",
  kn: "ಮುಂದೆ ಏನಾಗುತ್ತದೆ",
  mr: "पुढे काय होईल",
  bn: "এরপর কী হবে",
  pa: "ਅੱਗੇ ਕੀ ਹੋਵੇਗਾ",
};

function AppleMorphWordmark({
  currentWord,
  isRevealed,
  isAtCenter,
}: {
  currentWord: string;
  isRevealed: boolean;
  isAtCenter: boolean;
}) {
  const segmenter =
    typeof Intl !== "undefined" && Intl.Segmenter
      ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
      : null;

  const getGlyphs = (w: string) =>
    segmenter ? Array.from(segmenter.segment(w)).map((s) => s.segment) : w.split("");

  const [displayWord, setDisplayWord] = useState(currentWord);
  const [prevWord, setPrevWord] = useState<string | null>(null);

  useEffect(() => {
    if (currentWord !== displayWord) {
      setPrevWord(displayWord);
      setDisplayWord(currentWord);
    }
  }, [currentWord, displayWord]);

  // When in top header (settled), render standard static text so it doesn't distract
  if (!isAtCenter) {
    return (
      <span className="font-bold tracking-tight text-stone-900 select-none">
        {currentWord}
      </span>
    );
  }

  const currGlyphs = getGlyphs(displayWord);
  const prevGlyphs = prevWord ? getGlyphs(prevWord) : [];
  const maxLen = Math.max(currGlyphs.length, prevGlyphs.length);

  return (
    <div className="inline-flex items-baseline min-h-[26px] relative whitespace-nowrap">
      {Array.from({ length: maxLen }).map((_, i) => {
        const currChar = currGlyphs[i];
        const prevChar = prevGlyphs[i];

        return (
          <span key={i} className="relative inline-block">
            {/* Outgoing Letter: Fades out progressive from left to right */}
            {prevChar && prevWord !== displayWord && (
              <span
                style={{
                  animationDelay: `${i * 65}ms`,
                }}
                className="absolute inset-0 inline-block font-bold tracking-tight text-stone-900 select-none animate-[appleGlyphFadeOut_300ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
              >
                {prevChar}
              </span>
            )}

            {/* Incoming Letter: Rewrites progressive from left to right */}
            {currChar ? (
              <span
                key={`${displayWord}-${i}-${currChar}`}
                style={{
                  animationDelay: `${i * 65 + 35}ms`,
                }}
                className={`inline-block font-bold tracking-tight text-stone-900 select-none ${
                  isRevealed
                    ? "animate-[appleGlyphFadeIn_350ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
                    : "opacity-0"
                }`}
              >
                {currChar}
              </span>
            ) : (
              <span className="invisible inline-block">{prevChar}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export function HomeClient({ initialLang }: { initialLang: Lang | null }) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>(initialLang ?? "en");
  const [regNumber, setRegNumber] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type IntroStage =
    | "empty"
    | "logo_only"
    | "lang_en"
    | "lang_hi"
    | "lang_te"
    | "lang_ta"
    | "lang_kn"
    | "lang_mr"
    | "lang_bn"
    | "lang_pa"
    | "lang_en_final"
    | "hold"
    | "travel"
    | "settled";

  const [introStage, setIntroStage] = useState<IntroStage>("empty");
  const [langPromptIndex, setLangPromptIndex] = useState(0);
  const [hasSelectedLang, setHasSelectedLang] = useState<boolean>(false);
  const [hoveredLang, setHoveredLang] = useState<Lang | null>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [offset, setOffset] = useState<{ x: number; y: number; xLogo: number; yLogo: number } | null>(null);
  const [pillStyle, setPillStyle] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    opacity: number;
  } | null>(null);

  useEffect(() => {
    const isFromCase = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("from") === "case";
    const stored = getStoredLanguage();
    if (stored) {
      setLang(stored);
    }
    if (isFromCase && stored) {
      setHasSelectedLang(true);
      setIntroStage("settled");
      return;
    }

    const isReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      setIntroStage("settled");
      return;
    }

    // Measure exact header position relative to viewport dead center
    if (brandRef.current) {
      const rect = brandRef.current.getBoundingClientRect();
      const targetCenterX = window.innerWidth / 2;
      const targetCenterY = window.innerHeight * 0.44;

      const INTRO_SCALE = 2.2;
      const fullWidth = 175;
      const fullHeight = 44;
      const logoWidth = 32;

      // Constant horizontal baseline: lockedY is identical across all states
      const lockedY = targetCenterY - (rect.top + (fullHeight * INTRO_SCALE) / 2);
      const dxFull = targetCenterX - (rect.left + (fullWidth * INTRO_SCALE) / 2);
      const dxLogo = targetCenterX - (rect.left + (logoWidth * INTRO_SCALE) / 2);

      setOffset({ x: dxFull, y: lockedY, xLogo: dxLogo, yLogo: lockedY });
    }

    // Apple "Hello" Signature Organic Timing:
    // 1. Logo reveals alone in center (150ms)
    const t0 = setTimeout(() => setIntroStage("logo_only"), 150);
    // 2. English: Raasta draws in with handwriting unmask & pauses (900ms -> 2200ms, hold 1.3s)
    const t1 = setTimeout(() => setIntroStage("lang_en"), 900);
    // 3. Multilingual handwriting stroke loop with poised pauses and optical vapor transitions:
    const t2 = setTimeout(() => setIntroStage("lang_hi"), 2200); // Hindi: रास्ता (draw -> hold 1.25s)
    const t3 = setTimeout(() => setIntroStage("lang_te"), 3450); // Telugu: రాస్తా (draw -> hold 1.25s)
    const t4 = setTimeout(() => setIntroStage("lang_ta"), 4700); // Tamil: ராஸ்தா (draw -> hold 1.25s)
    const t5 = setTimeout(() => setIntroStage("lang_kn"), 5950); // Kannada: ರಾಸ್ತಾ (draw -> hold 1.25s)
    const t6 = setTimeout(() => setIntroStage("lang_mr"), 7200); // Marathi: रास्ता (draw -> hold 1.25s)
    const t7 = setTimeout(() => setIntroStage("lang_bn"), 8450); // Bengali: রাস্তা (draw -> hold 1.25s)
    const t8 = setTimeout(() => setIntroStage("lang_pa"), 9700); // Punjabi: ਰਾਸਤਾ (draw -> hold 1.25s)
    // 4. Final repeat of First Language (English) as the definitive anchor (10950ms -> 12500ms, hold 1.55s)
    const t9 = setTimeout(() => setIntroStage("lang_en_final"), 10950); // English: Raasta
    // 5. Confident Hold in English (12500ms -> 13150ms)
    const t10 = setTimeout(() => setIntroStage("hold"), 12500);
    // 6. Glides smoothly up to Top Header (13150ms)
    const t11 = setTimeout(() => setIntroStage("travel"), 13150);
    // 7. Settled & App Screen Opens (14000ms)
    const t12 = setTimeout(() => setIntroStage("settled"), 14000);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
      clearTimeout(t9);
      clearTimeout(t10);
      clearTimeout(t11);
      clearTimeout(t12);
    };
  }, []);

  useEffect(() => {
    if (introStage === "travel" || (introStage === "settled" && !hasSelectedLang)) {
      // If user is actively hovering over a tile, pause the auto-cycle so it stays static
      if (hoveredLang !== null) return;
      const t = setInterval(() => setLangPromptIndex((i) => (i + 1) % PROMPTS.length), 3200);
      return () => clearInterval(t);
    }
  }, [introStage, hasSelectedLang, hoveredLang]);

  const isAtCenter =
    introStage === "empty" ||
    introStage === "logo_only" ||
    introStage === "lang_en" ||
    introStage === "lang_hi" ||
    introStage === "lang_te" ||
    introStage === "lang_ta" ||
    introStage === "lang_kn" ||
    introStage === "lang_mr" ||
    introStage === "lang_bn" ||
    introStage === "lang_pa" ||
    introStage === "lang_en_final" ||
    introStage === "hold";

  const introLangMap: Record<string, Lang> = {
    lang_en: "en",
    hi: "hi",
    lang_hi: "hi",
    lang_te: "te",
    lang_ta: "ta",
    lang_kn: "kn",
    lang_mr: "mr",
    lang_bn: "bn",
    lang_pa: "pa",
    lang_en_final: "en",
    hold: "en",
  };

  const activeCycleLang: Lang = isAtCenter
    ? (introLangMap[introStage] ?? "en")
    : !hasSelectedLang
    ? (hoveredLang ?? PROMPTS[langPromptIndex % PROMPTS.length].code)
    : lang;

  // Apple-grade physical glide calculation for moving selection pill
  useEffect(() => {
    if (introStage !== "settled" || hasSelectedLang) return;

    const updatePill = () => {
      const activeIdx = SUPPORTED_LANGUAGES.findIndex((l) => l.code === activeCycleLang);
      const activeEl = tileRefs.current[activeIdx];
      const gridEl = gridContainerRef.current;

      if (activeEl && gridEl) {
        const gridRect = gridEl.getBoundingClientRect();
        const elRect = activeEl.getBoundingClientRect();

        setPillStyle({
          left: elRect.left - gridRect.left,
          top: elRect.top - gridRect.top,
          width: elRect.width,
          height: elRect.height,
          opacity: 1,
        });
      }
    };

    // Run immediately and on next RAF for layout stability
    updatePill();
    const raf = requestAnimationFrame(updatePill);
    window.addEventListener("resize", updatePill);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updatePill);
    };
  }, [activeCycleLang, introStage, hasSelectedLang]);

  const handleSelectLanguage = (selectedLang: Lang) => {
    setStoredLanguage(selectedLang);
    setLang(selectedLang);
    setHasSelectedLang(true);
  };

  const t = COPY[lang];

  async function check() {
    const trimmed = regNumber.trim();
    if (busy || trimmed.length !== 11) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journeyId: "J3_PAYMENT_FAILURE",
          registrationNumber: trimmed,
        }),
      });
      const json = (await res.json()) as { case?: { id: string }; error?: string };
      if (!res.ok || !json.case) {
        setError(json.error ?? t.checkError);
        setBusy(false);
        return;
      }
      router.push(`/case/${json.case.id}`);
    } catch {
      setBusy(false);
      setError(t.checkError);
    }
  }

  const isTextUnrolled =
    introStage !== "empty" &&
    introStage !== "logo_only";

  const isTaglineVisible =
    introStage === "lang_en" ||
    introStage === "lang_hi" ||
    introStage === "lang_te" ||
    introStage === "lang_ta" ||
    introStage === "lang_kn" ||
    introStage === "lang_mr" ||
    introStage === "lang_bn" ||
    introStage === "lang_pa" ||
    introStage === "lang_en_final" ||
    introStage === "hold";

  const isLogoOnly = introStage === "empty" || introStage === "logo_only";
  const transformStyle = offset
    ? isAtCenter
      ? isLogoOnly
        ? `translate3d(${offset.xLogo}px, ${offset.yLogo}px, 0) scale(2.2)`
        : `translate3d(${offset.x}px, ${offset.y}px, 0) scale(2.2)`
      : "translate3d(0px, 0px, 0) scale(1)"
    : undefined;

  return (
    <div className="relative min-h-screen bg-stone-50 text-stone-900 overflow-x-hidden">
      {/* ========================================================================= */}
      {/* MAIN CONTAINER                                                            */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-2xl px-6 py-10 min-h-screen relative">
        {/* ========================================================================= */}
        {/* SINGLE CONTINUOUS BRAND IDENTITY LOCKUP (Travels from Center to Header)  */}
        {/* ========================================================================= */}
        <header className="relative z-30 flex items-center justify-between gap-3 min-h-[44px]">
          {/* The Single Traveling Brand Lockup (100% single DOM node) */}
          <div
            ref={brandRef}
            style={{
              transform: transformStyle,
              transformOrigin: "top left",
              transition:
                introStage === "empty"
                  ? "opacity 600ms ease-out"
                  : "transform 1000ms cubic-bezier(0.16, 1, 0.3, 1), opacity 800ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className={`h-11 flex items-center select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              introStage === "empty" || (!offset && introStage !== "settled")
                ? "opacity-0"
                : "opacity-100"
            }`}
          >
            {/* Emblem [R] */}
            <button
              type="button"
              onClick={() => {
                setHasSelectedLang(false);
                setIntroStage("empty");
                setTimeout(() => setIntroStage("logo_only"), 100);
              }}
              title="Replay Raasta Intro & Choose Language"
              className="shrink-0 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RaastaLogoEmblem size="md" />
            </button>

            {/* Brand Text Column: Wordmark on top, Tagline directly below it */}
            <div
              className={`flex flex-col justify-center items-start transition-opacity duration-700 ease-out ml-2.5 ${
                isTextUnrolled ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Top line: Wordmark (Subtle stationary optical dissolve across Indic scripts) */}
              <div className="flex items-center gap-1.5 whitespace-nowrap py-0.5 min-h-[26px]">
                <AppleMorphWordmark
                  currentWord={WORDMARKS[activeCycleLang]}
                  isRevealed={isTextUnrolled}
                  isAtCenter={isAtCenter}
                />

                <span
                  className={`rounded-full border border-amber-300 bg-amber-50/80 px-2 py-0.5 text-[9px] font-bold text-amber-800 uppercase transition-opacity duration-500 ${
                    isAtCenter ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
                  }`}
                >
                  <span className="grid place-items-center relative">
                    {SUPPORTED_LANGUAGES.map((l) => {
                      const isActive = activeCycleLang === l.code;
                      return (
                        <span
                          key={l.code}
                          className={`col-start-1 row-start-1 leading-none select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isActive
                              ? "opacity-100 scale-100 blur-0"
                              : "opacity-0 scale-95 blur-[2px] pointer-events-none"
                          }`}
                        >
                          {DEMO_BADGES[l.code]}
                        </span>
                      );
                    })}
                  </span>
                </span>
              </div>

              {/* Bottom line: Tagline (directly under Raasta, 100% in-place optical dissolve) */}
              <div
                style={{
                  transitionDelay: isTaglineVisible ? "260ms" : "0ms",
                }}
                className={`mt-0.5 py-0.5 transition-opacity duration-600 ease-out ${
                  isTaglineVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="grid place-items-start relative">
                  {SUPPORTED_LANGUAGES.map((l) => {
                    const isActive = activeCycleLang === l.code;
                    return (
                      <p
                        key={l.code}
                        className={`col-start-1 row-start-1 text-[10.5px] font-medium tracking-tight text-stone-500 whitespace-nowrap leading-normal select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive
                            ? "opacity-100 blur-0"
                            : "opacity-0 blur-[2px] pointer-events-none"
                        }`}
                      >
                        {TAGLINES[l.code]}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Header Controls (Journal Link + Language Switcher): Fades in when settled */}
          <div
            className={`flex items-center gap-2.5 transition-opacity duration-500 ease-out ${
              introStage === "settled" && hasSelectedLang ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Link
              href="/journal"
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 px-2.5 py-1 rounded-full border border-stone-200 bg-white shadow-2xs transition hover:bg-stone-100 active:scale-95"
            >
              📖 Journal
            </Link>
            <LanguageSwitcher
              lang={lang}
              onChange={(l) => {
                setStoredLanguage(l);
                setLang(l);
              }}
            />
          </div>
        </header>

        {/* ========================================================================= */}
        {/* CENTERED APPLE LANGUAGE SELECTION CARD (Reveals ONLY after Brand Docks)    */}
        {/* ========================================================================= */}
        {introStage === "settled" && !hasSelectedLang && (
          <section className="flex min-h-[65vh] flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-600 ease-out">
            <div className="apple-card w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-stone-200/80 bg-white/95 shadow-xl backdrop-blur-md">
              {/* Rotating Prompt with generous line-height and no overflow clipping */}
              <div
                aria-label="Choose your language"
                className="grid place-items-center min-h-[4rem] py-1 relative"
              >
                {PROMPTS.map((p) => {
                  const isActive = activeCycleLang === p.code;
                  return (
                    <p
                      key={p.code}
                      className={`col-start-1 row-start-1 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 leading-normal select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive
                          ? "opacity-100 translate-y-0 scale-100 blur-0"
                          : "opacity-0 translate-y-2 scale-[0.98] blur-[3px] pointer-events-none"
                      }`}
                    >
                      {p.text}
                    </p>
                  );
                })}
              </div>

              {/* Language Selection Grid — Apple Tactile Indic Tiles */}
              <div className="mt-8 grid w-full grid-cols-2 gap-3.5 sm:grid-cols-4">
                {SUPPORTED_LANGUAGES.map((l) => {
                  const isActive = activeCycleLang === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => handleSelectLanguage(l.code)}
                      onMouseEnter={() => setHoveredLang(l.code)}
                      onMouseLeave={() => setHoveredLang(null)}
                      onFocus={() => setHoveredLang(l.code)}
                      onBlur={() => setHoveredLang(null)}
                      className={`group relative flex flex-col items-center justify-center rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 active:scale-[0.97] cursor-pointer ${
                        isActive
                          ? "border-2 border-stone-900 bg-white text-stone-950 shadow-md ring-2 ring-stone-900/10 scale-[1.03] z-10"
                          : "border border-stone-200/90 bg-stone-50/70 text-stone-700 hover:border-stone-400 hover:bg-white hover:shadow-xs scale-100"
                      }`}
                    >
                      <span
                        className={`text-xl font-bold tracking-tight sm:text-2xl leading-normal transition-transform duration-300 ${
                          isActive ? "text-stone-950 scale-105" : "text-stone-800"
                        }`}
                      >
                        {l.nativeName}
                      </span>
                      <span
                        className={`mt-1 text-[11px] font-medium transition-colors duration-300 ${
                          isActive ? "text-stone-700 font-semibold" : "text-stone-400"
                        }`}
                      >
                        {l.sub}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-7 text-xs text-stone-400">
                Public Recovery Infrastructure for PM-KISAN
              </p>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* FULL RECOVERY DASHBOARD (Reveals after Language Selected)                  */}
        {/* ========================================================================= */}
        {introStage === "settled" && hasSelectedLang && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {/* Primary — check first, the citizen never diagnoses */}
            <section className="mt-8">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/90 bg-stone-100/80 px-3 py-0.5 text-xs font-medium text-stone-600">
                <BuildingBankIcon className="h-3.5 w-3.5 text-stone-600" />
                <span>PM-KISAN Samman Nidhi</span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                {t.checkTitle}
              </h1>
              <p className="mt-2 text-base leading-relaxed text-stone-600 sm:text-lg">
                {t.checkSub}
              </p>

              {/* Primary Action Card: Apple-grade Registration check */}
              <div className="apple-card mt-6 rounded-3xl p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <label htmlFor="reg-number" className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                    {t.regLabel}
                  </label>
                  <span className="font-mono text-xs font-medium text-stone-400 tabular-nums">
                    {regNumber.length}/11 {t.digitsLabel}
                  </span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void check();
                  }}
                  className="mt-3 flex flex-col gap-3 sm:flex-row"
                >
                  <div className="relative flex-1">
                    <input
                      id="reg-number"
                      inputMode="numeric"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
                      placeholder={t.regPlaceholder}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-3.5 font-mono text-base font-semibold tracking-wider text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={busy || regNumber.trim().length !== 11}
                    className="rounded-2xl bg-stone-900 px-7 py-3.5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:bg-stone-800 active:scale-[0.98] focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {busy ? t.checking : t.checkButton}
                  </button>
                </form>

                <div className="mt-3.5 flex items-center justify-between border-t border-stone-100 pt-3 text-xs text-stone-400">
                  <span>{t.demoHint}</span>
                  <span className="font-mono text-[11px] text-stone-400"># 10203040506</span>
                </div>

                {error && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                    <AlertCircleIcon className="h-4 w-4 shrink-0 text-rose-700" />
                    <div>
                      <span className="font-bold">{t.errorNotice}</span> {error}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Secondary — Unified Natural Language & Voice Intake Card */}
            <section className="mt-6">
              <IntakeForm lang={lang} />
            </section>

            {/* Demo scenarios — collapsible for evaluators & judges */}
            <section className="mt-8">
              <details className="group rounded-2xl border border-dashed border-stone-300 bg-white text-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3.5 font-medium text-stone-700 hover:text-stone-900">
                  <div className="flex items-center gap-2">
                    <SettingsIcon className="h-3.5 w-3.5 text-stone-500" />
                    <span>{t.scenarios}</span>
                    <span className="text-xs text-stone-400">({t.scenariosSub})</span>
                  </div>
                  <span className="text-xs text-stone-400 transition group-open:rotate-90">›</span>
                </summary>
                <div className="border-t border-dashed border-stone-200 p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {JOURNEY_CARDS.map((j) => (
                      <CreateCase
                        key={j.journeyId}
                        variant="scenario"
                        journeyId={j.journeyId}
                        label={j.label[lang]}
                        description={j.description[lang]}
                        lang={lang}
                      />
                    ))}
                  </div>
                </div>
              </details>
            </section>

            {/* Data boundary — kept explicit */}
            <p className="mt-8 text-center text-xs leading-relaxed text-stone-400">
              {t.boundary} <br />
              <span className="italic">{t.principle}</span>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
