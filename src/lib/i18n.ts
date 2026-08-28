/**
 * Language support — the single source of truth for what the build ACTUALLY
 * translates. The language gate advertises exactly this list and nothing else.
 *
 * Principle (PRODUCT_CONTRACT §0): "Language must never be a prerequisite for
 * discovering language." The product must never require a citizen to understand
 * a language they do not speak in order to choose the language they do speak.
 * Language selection is part of access, not settings.
 */

export type Lang = "en" | "hi" | "te" | "ta" | "kn" | "mr" | "bn" | "pa";

export const LANG_STORAGE_KEY = "raasta_lang";
export const LANG_COOKIE_KEY = "raasta_lang";

/** Native names only — never "EN"/"HI" abbreviations, never flags. */
export const SUPPORTED_LANGUAGES: ReadonlyArray<{
  code: Lang;
  nativeName: string;
  englishName: string;
  sub: string;
}> = [
  { code: "en", nativeName: "English", englishName: "English", sub: "English" },
  { code: "hi", nativeName: "हिंदी", englishName: "Hindi", sub: "Hindi" },
  { code: "te", nativeName: "తెలుగు", englishName: "Telugu", sub: "Telugu" },
  { code: "ta", nativeName: "தமிழ்", englishName: "Tamil", sub: "Tamil" },
  { code: "kn", nativeName: "ಕನ್ನಡ", englishName: "Kannada", sub: "Kannada" },
  { code: "mr", nativeName: "मराठी", englishName: "Marathi", sub: "Marathi" },
  { code: "bn", nativeName: "বাংলা", englishName: "Bengali", sub: "Bengali" },
  { code: "pa", nativeName: "ਪੰਜਾਬੀ", englishName: "Punjabi", sub: "Punjabi" },
];

export function isSupportedLang(value: string | null | undefined): value is Lang {
  return (
    value === "en" ||
    value === "hi" ||
    value === "te" ||
    value === "ta" ||
    value === "kn" ||
    value === "mr" ||
    value === "bn" ||
    value === "pa"
  );
}

/**
 * Persist the choice in BOTH localStorage (client-side reads, gate decision)
 * and a cookie (server-side read — so the server can render the landing
 * directly for returning visitors and the gate only for genuinely fresh ones,
 * with no flash of the language page).
 */
export function setStoredLanguage(lang: Lang): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  if (typeof document !== "undefined") {
    document.cookie = `${LANG_COOKIE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
  }
}

/**
 * Stored language preference, or null when the visitor has not chosen yet.
 * The gate needs "not chosen" to be distinguishable from "chose English".
 */
export function getStoredLanguage(): Lang | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
  return isSupportedLang(stored) ? stored : null;
}

export function nativeName(lang: Lang): string {
  return SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.nativeName ?? "English";
}
