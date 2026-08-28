"use client";

import Link from "next/link";
import { RaastaLogoEmblem } from "@/components/RaastaLogo";
import { JOURNAL_ARTICLES } from "@/data/journalArticles";

export default function JournalIndexPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80 active:scale-95"
          >
            <RaastaLogoEmblem size="sm" />
            <div>
              <p className="text-sm font-bold tracking-tight text-stone-900 leading-none">Raasta</p>
              <p className="text-[10px] text-stone-500 font-medium leading-none mt-0.5">What happens next</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <span className="rounded-full bg-amber-100/80 border border-amber-300/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-900">
              Journal
            </span>
            <Link
              href="/"
              className="text-xs font-semibold text-stone-600 transition hover:text-stone-900 active:scale-95"
            >
              ← Case Engine
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="mx-auto max-w-4xl px-4 pt-12 pb-8 sm:px-6 sm:pt-16 sm:pb-12">
        <div className="border-b border-stone-200 pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-800 font-semibold">
            Public Recovery Infrastructure · Editorial
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-stone-950 sm:text-4xl">
            Raasta Journal
          </h1>
          <p className="mt-2 text-base text-stone-600 sm:text-lg max-w-2xl leading-relaxed">
            Thinking about what happens next. The principles, design decisions, and systemic insights behind public service recovery.
          </p>
        </div>

        {/* Articles List */}
        <div className="mt-8 divide-y divide-stone-200/80">
          {JOURNAL_ARTICLES.map((article) => (
            <article key={article.slug} className="group py-8 first:pt-4 transition-all">
              <Link href={`/journal/${article.slug}`} className="block">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                      {article.number}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      {article.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-stone-400 shrink-0">
                    <span>{article.readTime}</span>
                    <span>·</span>
                    <span>{article.date}</span>
                  </div>
                </div>

                <h2 className="mt-3 text-xl font-bold tracking-tight text-stone-900 group-hover:text-amber-900 group-hover:underline underline-offset-4 transition-colors sm:text-2xl">
                  {article.title}
                </h2>

                <p className="mt-2 text-sm text-stone-600 leading-relaxed max-w-3xl">
                  {article.subtitle}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-800 group-hover:translate-x-1 transition-transform">
                  <span>Read essay</span>
                  <span>→</span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-16 rounded-2xl border border-stone-200/80 bg-stone-100/60 p-6 text-center text-xs text-stone-500 space-y-2">
          <p className="font-semibold text-stone-700">Raasta · Built for Build What Moves India (2026)</p>
          <p className="max-w-xl mx-auto leading-relaxed">
            Raasta is public recovery infrastructure for DBT and government entitlement failures. Simulated signals are derived from publicly documented PM-KISAN guidelines.
          </p>
        </div>
      </div>
    </main>
  );
}
