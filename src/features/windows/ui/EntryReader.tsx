"use client";
import { SurfaceRim } from "../../../ui/SurfaceRim";


import { useEffect, useState } from "react";
import { ArticleView, EntryList, fetchEntry, fetchSummaries } from "../../entries";
import type { EntrySummary, LoadedEntry, Section } from "../../entries";
import { useWindowInstance } from "../window-identity";
import { z } from "zod";

const readerSchema = z.object({ section: z.enum(["blog", "album", "projects", "management"]), slug: z.string() });

function LoadFailure({ message, retry }: { readonly message: string; readonly retry: () => void }) {
  return <div className="p-6 space-y-4"><p role="alert">{message}</p><button type="button" className="surface-raised surface-edge min-h-11 rounded-full px-4 py-2" onClick={retry}>Retry<SurfaceRim /></button></div>;
}

export function EntryReader({ section, slug, surface = "client" }: { readonly section: Section; readonly slug: string; readonly surface?: "client" | "overlay" }) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ readonly section: Section; readonly slug: string; readonly attempt: number; readonly entry?: LoadedEntry; readonly error?: string } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    void fetchEntry(section, slug, controller.signal).then((entry) => {
      if (!controller.signal.aborted) setResult({ section, slug, attempt, entry });
    }, (error: unknown) => {
      if (!controller.signal.aborted) setResult({ section, slug, attempt, error: error instanceof Error ? error.message : "Could not load this entry." });
    });
    return () => controller.abort();
  }, [section, slug, attempt]);
  if (result?.section !== section || result.slug !== slug || result.attempt !== attempt) return <p className="p-6" role="status">Loading entry…</p>;
  if (result.error !== undefined) return <LoadFailure message={result.error} retry={() => setAttempt(value => value + 1)} />;
  return result.entry === undefined ? null : <ArticleView entry={result.entry} surface={surface} />;
}

function EntryBrowser({ section, slug }: { readonly section: Section; readonly slug: string }) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ readonly section: Section; readonly attempt: number; readonly entries?: readonly EntrySummary[]; readonly error?: string } | null>(null);
  const [showList, setShowList] = useState(slug === "");
  const { updateProps } = useWindowInstance();
  useEffect(() => {
    const controller = new AbortController();
    void fetchSummaries(section, controller.signal).then((entries) => {
      if (!controller.signal.aborted) setResult({ section, attempt, entries });
    }, (cause: unknown) => {
      if (!controller.signal.aborted) setResult({ section, attempt, error: cause instanceof Error ? cause.message : "Could not load entries." });
    });
    return () => controller.abort();
  }, [section, attempt]);
  const title = section === "blog" ? "Blog" : section === "album" ? "Album" : section === "projects" ? "Projects" : "Management";
  const current = result?.section === section && result.attempt === attempt ? result : null;
  return <div className="size-full overflow-auto relative">
    {slug !== "" && <button type="button" className="surface-raised surface-edge sticky top-3 min-h-11 rounded-full px-4 py-2 m-3 z-10" aria-expanded={showList} onClick={() => setShowList((visible) => !visible)}>Browse {title}<SurfaceRim /></button>}
    {showList || slug === "" ? current === null ? <p className="p-6" role="status">Loading {title}…</p> : current.error !== undefined ? <LoadFailure message={current.error} retry={() => setAttempt(value => value + 1)} /> :
      <EntryList entries={current.entries ?? []} section={section} title={title} surface="window" onSelect={(entry) => { updateProps({ section, slug: entry.slug }); setShowList(false); }}/>
      : <EntryReader section={section} slug={slug} />}
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
