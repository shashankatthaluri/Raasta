"use client";

import React from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { RaastaLogoEmblem } from "@/components/RaastaLogo";
import { JOURNAL_ARTICLES } from "@/data/journalArticles";

export default function JournalArticlePage() {
  const params = useParams<{ slug: string }>();
  const article = JOURNAL_ARTICLES.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  // Split markdown content into readable blocks
  const paragraphs = article.content.split("\n\n");

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link
            href="/journal"
            className="flex items-center gap-2 text-xs font-semibold text-stone-600 transition hover:text-stone-900 active:scale-95"
          >
            <span>←</span>
            <span>All Essays</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80 active:scale-95"
          >
            <RaastaLogoEmblem size="sm" />
            <span className="text-xs font-bold tracking-tight text-stone-900">Raasta</span>
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <article className="mx-auto max-w-3xl px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
        {/* Article Meta */}
        <div className="border-b border-stone-200 pb-6">
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              ESSAY {article.number}
            </span>
            <span className="text-stone-400">·</span>
            <span className="font-semibold uppercase tracking-wider text-stone-500">{article.category}</span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-500">{article.readTime}</span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-500">{article.date}</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-950 sm:text-4xl leading-tight">
            {article.title}
          </h1>

          <p className="mt-3 text-lg font-medium text-stone-600 leading-snug">
            {article.subtitle}
          </p>
        </div>

        {/* Prose Body */}
        <div className="mt-8 space-y-5 text-base leading-relaxed text-stone-800">
          {paragraphs.map((p, idx) => {
            const trimmed = p.trim();

            if (trimmed.startsWith("## ")) {
              return (
                <h2 key={idx} className="pt-6 pb-2 text-2xl font-bold tracking-tight text-stone-950 border-t border-stone-200/60 first:border-0 first:pt-0">
                  {trimmed.replace("## ", "")}
                </h2>
              );
            }

            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={idx} className="pt-4 pb-1 text-lg font-bold tracking-tight text-stone-900">
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }

            if (trimmed.startsWith("# ")) {
              return (
                <h2 key={idx} className="py-4 text-2xl font-extrabold tracking-tight text-amber-950 bg-amber-50/60 p-4 rounded-xl border border-amber-200/60">
                  {trimmed.replace("# ", "")}
                </h2>
              );
            }

            if (trimmed === "---") {
              return <hr key={idx} className="my-8 border-stone-200" />;
            }

            if (trimmed.startsWith("> ")) {
              return (
                <blockquote key={idx} className="rounded-xl border-l-4 border-amber-600 bg-stone-100/70 p-4 text-stone-900 font-medium italic">
                  {trimmed.replace(/^>\s*/gm, "")}
                </blockquote>
              );
            }

            if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
              const items = trimmed.split("\n").map((line) => line.replace(/^[*\-]\s*/, ""));
              return (
                <ul key={idx} className="list-disc pl-5 space-y-1.5 text-stone-700">
                  {items.map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                  ))}
                </ul>
              );
            }

            return (
              <p
                key={idx}
                dangerouslySetInnerHTML={{
                  __html: trimmed
                    .replace(/\*\*(.*?)\*\*/g, '<strong className="font-bold text-stone-950">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em className="text-stone-900">$1</em>')
                    .replace(/`([^`]+)`/g, '<code className="rounded bg-stone-200/70 px-1 py-0.5 font-mono text-xs font-semibold text-stone-900">$1</code>'),
                }}
              />
            );
          })}
        </div>

        {/* Provenance & Sources Section */}
        {article.sources.length > 0 && (
          <div className="mt-14 rounded-2xl border border-stone-200 bg-stone-100/80 p-6 text-xs">
            <p className="font-mono font-bold uppercase tracking-wider text-stone-600">
              Sources & Provenance
            </p>
            <ul className="mt-3 divide-y divide-stone-200/60">
              {article.sources.map((src, i) => (
                <li key={i} className="py-2 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold font-mono uppercase ${
                      src.type === "OFFICIAL"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : src.type === "DESIGN_DECISION"
                        ? "bg-purple-100 text-purple-800 border border-purple-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}>
                      {src.type}
                    </span>
                    <span className="font-medium text-stone-800">{src.title}</span>
                  </div>
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-800 hover:underline shrink-0"
                    >
                      Official Link ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next / Previous Navigation */}
        <div className="mt-12 pt-8 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/journal"
            className="text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            ← Back to Journal Index
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 active:scale-95 transition"
          >
            <span>Launch Case Engine</span>
            <span>→</span>
          </Link>
        </div>
      </article>
    </main>
  );
}
