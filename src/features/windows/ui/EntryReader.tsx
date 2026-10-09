"use client";

import { useEffect, useState } from "react";
import { ArticleView, fetchEntry, fetchSummaries } from "../../entries";
import type { EntrySummary, LoadedEntry, Section } from "../../entries";
import { useWindowInstance } from "../window-identity";
import { z } from "zod";

const readerSchema = z.object({ section: z.enum(["blog", "album", "projects", "management"]), slug: z.string() });

export function EntryReader({ section, slug }: { readonly section: Section; readonly slug: string }) {
  const [result, setResult] = useState<{ readonly slug: string; readonly entry?: LoadedEntry; readonly error?: string } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    void fetchEntry(section, slug, controller.signal).then((entry) => setResult({ slug, entry }), (error: unknown) => {
      if (!controller.signal.aborted) setResult({ slug, error: error instanceof Error ? error.message : "Could not load this entry." });
    });
    return () => controller.abort();
  }, [section, slug]);
  if (result?.slug !== slug) return <p className="p-6" role="status">Loading entry…</p>;
  if (result.error !== undefined) return <p className="p-6" role="alert">{result.error}</p>;
  return result.entry === undefined ? null : <ArticleView entry={result.entry} surface="client" />;
}

function EntryBrowser({ section, slug }: { readonly section: Section; readonly slug: string }) {
  const [entries, setEntries] = useState<readonly EntrySummary[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [showList, setShowList] = useState(slug === "");
  const { updateProps } = useWindowInstance();
  useEffect(() => {
    const controller = new AbortController();
    void fetchSummaries(section, controller.signal).then(setEntries, (cause: unknown) => {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not load entries.");
    });
    return () => controller.abort();
  }, [section]);
  const filtered = entries.filter((entry) => `${entry.title} ${entry.description ?? ""} ${entry.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="size-full overflow-auto relative">
    {slug !== "" && <button type="button" className="surface-widget sticky top-0 rounded-full px-4 py-2 m-3" aria-expanded={showList} onClick={() => setShowList((visible) => !visible)}>Browse {section}</button>}
    {showList || slug === "" ? <div className="p-4"><label>Search {section}<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} className="surface-sunken mt-2 mb-4 w-full rounded-xl p-3" /></label>{error && <p role="alert">{error}</p>}<ul className="space-y-3">{filtered.map((entry) => <li key={entry.slug}><button type="button" className="surface-widget w-full rounded-2xl p-4 text-start" onClick={() => { updateProps({ section, slug: entry.slug }); setShowList(false); }}><h2 className="font-display text-xl">{entry.title}</h2><p>{entry.description}</p></button></li>)}</ul></div> : <EntryReader section={section} slug={slug} />}
  </div>;
}

export default function EntryWindow(props: Record<string, unknown>) {
  const { section, slug } = readerSchema.parse(props);
  return <EntryBrowser section={section} slug={slug} />;
}

export function EntryOverlay(props: Record<string, unknown>) {
  const { section, slug } = readerSchema.parse(props);
  return <div className="max-h-[85dvh] w-[min(90vw,60rem)] overflow-auto"><EntryReader section={section} slug={slug} /></div>;
}
