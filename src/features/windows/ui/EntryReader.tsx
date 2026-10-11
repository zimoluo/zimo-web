"use client";
import { SurfaceRim } from "../../../ui/SurfaceRim";


import { useEffect, useState } from "react";
import { ArticleView, EntryList, fetchEntry, fetchSummaries } from "../../entries";
import type { EntrySummary, LoadedEntry, Section } from "../../entries";
import { useWindowInstance } from "../window-identity";
import { z } from "zod";

const readerSchema = z.object({ section: z.enum(["blog", "album", "projects", "management"]), slug: z.string() });

export function EntryReader({ section, slug, surface = "client" }: { readonly section: Section; readonly slug: string; readonly surface?: "client" | "overlay" }) {
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
  return result.entry === undefined ? null : <ArticleView entry={result.entry} surface={surface} />;
}

function EntryBrowser({ section, slug }: { readonly section: Section; readonly slug: string }) {
  const [entries, setEntries] = useState<readonly EntrySummary[]>([]);
  const [error, setError] = useState("");
  const [showList, setShowList] = useState(slug === "");
  const { updateProps } = useWindowInstance();
  useEffect(() => {
    const controller = new AbortController();
    void fetchSummaries(section, controller.signal).then(setEntries, (cause: unknown) => {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not load entries.");
    });
    return () => controller.abort();
  }, [section]);
  const title = section === "blog" ? "Blog" : section === "album" ? "Album" : section === "projects" ? "Projects" : "Management";
  return <div className="size-full overflow-auto relative">
    {slug !== "" && <button type="button" className="surface-raised surface-edge sticky top-3 rounded-full px-4 py-2 m-3 z-10" aria-expanded={showList} onClick={() => setShowList((visible) => !visible)}>Browse {title}<SurfaceRim /></button>}
    {showList || slug === "" ? <>
      {error && <p role="alert" className="p-4">{error}</p>}
      <EntryList entries={entries} section={section} title={title} surface="window" onSelect={(entry) => { updateProps({ section, slug: entry.slug }); setShowList(false); }}/>
    </> : <EntryReader section={section} slug={slug} />}
  </div>;
}

export default function EntryWindow(props: Record<string, unknown>) {
  const { section, slug } = readerSchema.parse(props);
  return <EntryBrowser section={section} slug={slug} />;
}

export function EntryOverlay(props: Record<string, unknown>) {
  const { section, slug } = readerSchema.parse(props);
  return <div className="max-h-[calc(100dvh-9rem)] overflow-auto" style={{ width: section === "album" ? "min(90vw,114dvh)" : "min(90vw,150dvh)" }}><EntryReader section={section} slug={slug} surface="overlay" /></div>;
}
