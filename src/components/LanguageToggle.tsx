"use client";

export type Lang = "en" | "hi";

export function LanguageToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-stone-200 bg-white p-0.5 text-sm">
      {(["en", "hi"] as const).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`rounded-md px-2.5 py-1 font-medium transition ${
            lang === l ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          {l === "en" ? "EN" : "हिंदी"}
        </button>
      ))}
    </div>
  );
}
