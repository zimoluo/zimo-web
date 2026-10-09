"use client";
import Image from "next/image";
import { presentOverlay } from "../../overlays";
import { useSettings } from "../../settings";
import { useMemo, useState } from "react";
import type { EntrySummary, Section } from "../model/types";
import { entryPath } from "../paths";
import { InlineMarks } from "../../document";
import { matchesQuery, parseQuery } from "../../search";
import { formatAbsolute } from "../../../lib/datetime";
import styles from "./entries.module.css";

export function EntryList({ entries, section, title }: { readonly entries: readonly EntrySummary[]; readonly section: Section; readonly title: string }) {
  const overlaysEnabled = useSettings((settings) => settings.experiments.entryPopUp ?? true);
  const [query, setQuery] = useState("");
  const parsed = useMemo(() => parseQuery(query), [query]);
  const filtered = entries.filter((entry) => matchesQuery({ ...entry, authors: entry.authors.map((author) => author.name) }, parsed, (text) => text));
  return <section className={styles.list}>
    <header className="mb-8"><h1 className="text-4xl md:text-6xl font-display mb-4">{title}</h1>
      <label className="block">Search {title}<input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search titles, descriptions, tags, or authors" className="block w-full mt-2 px-4 py-3 rounded-full surface-widget" /></label>
      {section === "blog" ? <a className="underline inline-block mt-3" href="/blog/feed.rss">Subscribe via RSS</a> : null}
    </header>
    <div className={styles.grid}>{filtered.map((entry) => <article className="surface-widget surface-edge rounded-3xl overflow-hidden" key={entry.slug}>
      <a href={entryPath(entry.section, entry.slug)} className="block h-full" onClick={(event) => { if (!overlaysEnabled || (entry.section !== "album" && entry.section !== "projects") || !window.matchMedia("(min-width: 768px)").matches || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); presentOverlay({ kind: entry.section === "album" ? "album-entry" : "project-entry", props: { section: entry.section, slug: entry.slug }, expandTo: entryPath(entry.section, entry.slug) }); }}>
        {entry.cover === undefined ? null : <Image src={entry.cover.src} alt={entry.cover.alt} width={entry.cover.width} height={entry.cover.height} loading="lazy" className={styles.cover} style={{ objectPosition: `${(entry.cover.focus?.x ?? .5) * 100}% ${(entry.cover.focus?.y ?? .5) * 100}%` }} />}
        <div className="p-6"><h2 className="font-display text-2xl"><InlineMarks>{entry.title}</InlineMarks></h2><time className="text-sm text-text-muted" dateTime={entry.publishedAt}>{formatAbsolute(entry.publishedAt)}</time>{entry.description === undefined ? null : <p className="mt-3"><InlineMarks>{entry.description}</InlineMarks></p>}<p className="text-sm text-text-muted mt-3">{entry.tags.join(" · ")}</p></div>
      </a>
    </article>)}</div>
    {filtered.length === 0 ? <p role="status">No entries match this search.</p> : null}
  </section>;
}
