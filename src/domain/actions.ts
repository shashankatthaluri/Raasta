import type { CitizenAction, CitizenActionId } from "./types";

/**
 * Citizen action catalog — one action per screen, never five buttons.
 * Locked copy per PRODUCT_CONTRACT.md §9.
 */
export const ACTION_CATALOG: Record<CitizenActionId, CitizenAction> = {
  COMPLETE_EKYC: {
    id: "COMPLETE_EKYC",
    effort: "LOW",
    title: "Complete e-KYC",
    titleHi: "ई-केवाईसी पूरा करें",
    why: "Your e-KYC is required before the payment can proceed.",
    whyHi: "भुगतान आगे बढ़ने से पहले आपका ई-केवाईसी आवश्यक है।",
    after: "Your case will continue automatically after official confirmation.",
    afterHi: "आधिकारिक पुष्टि के बाद आपका मामला अपने आप आगे बढ़ेगा।",
    href: "https://pmkisan.gov.in/",
  },
  SHOW_CASE_AT_CSC: {
    id: "SHOW_CASE_AT_CSC",
    effort: "MEDIUM",
    title: "Show this case at a CSC",
    titleHi: "यह मामला CSC में दिखाएँ",
    why: "A CSC operator can help complete the next official step.",
    whyHi: "CSC ऑपरेटर अगला आधिकारिक कदम पूरा करने में मदद कर सकता है।",
    after: "Your case will continue after the CSC completes the step.",
    afterHi: "CSC द्वारा कदम पूरा करने के बाद आपका मामला आगे बढ़ेगा।",
    card: {
      heading: "For the CSC operator",
      statement: "This citizen needs help completing the next step of their PM-KISAN case.",
      lines: ["Case ID", "Current issue", "Required action", "Relevant evidence", "Next step"],
    },
  },
  SHOW_CARD_AT_BANK: {
    id: "SHOW_CARD_AT_BANK",
    effort: "MEDIUM",
    title: "Show this card at your bank",
    titleHi: "यह कार्ड अपने बैंक में दिखाएँ",
    why: "Your bank may need to take action on the failed transfer.",
    whyHi: "असफल ट्रांसफर पर आपके बैंक को कार्रवाई करनी पड़ सकती है।",
    after: "Your case will continue after the bank confirms.",
    afterHi: "बैंक की पुष्टि के बाद आपका मामला आगे बढ़ेगा।",
    card: {
      heading: "For the bank",
      statement:
        "I need help resolving an Aadhaar/DBT mapping issue related to my PM-KISAN payment.",
      lines: ["Case ID", "Current issue", "Required action", "Relevant evidence", "Next step"],
    },
  },
  PREPARE_GRIEVANCE: {
    id: "PREPARE_GRIEVANCE",
    effort: "MEDIUM",
    title: "Prepare your grievance",
    titleHi: "अपनी शिकायत तैयार करें",
    why: "A formal grievance is needed to investigate repeated failures.",
    whyHi: "बार-बार विफलता की जाँच के लिए औपचारिक शिकायत ज़रूरी है।",
    after: "Your case will track the grievance until resolution.",
    afterHi: "आपका मामला समाधान तक शिकायत पर नज़र रखेगा।",
  },
  PROVIDE_INFORMATION: {
    id: "PROVIDE_INFORMATION",
    effort: "LOW",
    title: "Provide the requested information",
    titleHi: "माँगी गई जानकारी दें",
    why: "The verification process needs more information.",
    whyHi: "सत्यापन प्रक्रिया को और जानकारी चाहिए।",
    after: "Your case will continue after verification.",
    afterHi: "सत्यापन के बाद आपका मामला आगे बढ़ेगा।",
  },
};

export function actionFor(id: CitizenActionId | null): CitizenAction | null {
  return id ? ACTION_CATALOG[id] : null;
}
