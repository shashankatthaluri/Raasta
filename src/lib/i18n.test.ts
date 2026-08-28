import { describe, expect, it, beforeEach } from "vitest";
import {
  LANG_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  getStoredLanguage,
  isSupportedLang,
  nativeName,
  setStoredLanguage,
} from "./i18n";

/** Minimal localStorage shim — vitest runs in node here, no jsdom. */
const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  (globalThis as unknown as { window: unknown }).window = globalThis;
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    key: () => null,
    length: 0,
    clear: () => store.clear(),
  } as Storage;
});

describe("language support", () => {
  it("supports exactly the languages the build actually translates (en, hi, te, ta, kn, mr, bn, pa)", () => {
    expect(SUPPORTED_LANGUAGES.map((l) => l.code)).toEqual([
      "en",
      "hi",
      "te",
      "ta",
      "kn",
      "mr",
      "bn",
      "pa",
    ]);
  });

  it("uses native names, never abbreviations or flags", () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(8);
    expect(SUPPORTED_LANGUAGES.some((l) => /^[A-Z]{2}$/.test(l.nativeName))).toBe(false);
  });

  it("does not advertise languages that are not supported", () => {
    for (const unsupported of ["fr", "es", "de", "ja", "zh", "ru"]) {
      expect(isSupportedLang(unsupported)).toBe(false);
    }
  });

  it("round-trips persistence", () => {
    setStoredLanguage("te");
    expect(getStoredLanguage()).toBe("te");
    setStoredLanguage("hi");
    expect(getStoredLanguage()).toBe("hi");
    setStoredLanguage("en");
    expect(getStoredLanguage()).toBe("en");
  });

  it("returns null when nothing is stored — the gate decides", () => {
    localStorage.removeItem(LANG_STORAGE_KEY);
    expect(getStoredLanguage()).toBeNull();
  });

  it("returns null for corrupt stored values instead of advertising them", () => {
    localStorage.setItem(LANG_STORAGE_KEY, "fr");
    expect(getStoredLanguage()).toBeNull();
    expect(isSupportedLang(localStorage.getItem(LANG_STORAGE_KEY))).toBe(false);
  });

  it("nativeName returns the native name", () => {
    expect(nativeName("hi")).toBe("हिंदी");
    expect(nativeName("en")).toBe("English");
    expect(nativeName("te")).toBe("తెలుగు");
    expect(nativeName("ta")).toBe("தமிழ்");
  });
});
