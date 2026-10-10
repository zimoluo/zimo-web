"use client";
import Image from "next/image";
import { presentOverlay } from "../../overlays";
import { useSettings, settingsStore } from "../../settings";
import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
import type { EntrySummary, Section } from "../model/types";
import { entryPath } from "../paths";
import { InlineMarks } from "../../document";
import { matchesQuery, parseQuery } from "../../search";
import { formatAbsolute, readingTime } from "../../../lib/datetime";
import PhotosStackIcon from "../../../ui/icons/entries/PhotosStackIcon";
import GalleryModeIcon from "../../../ui/icons/entries/GalleryModeIcon";
import SearchBarIcon from "../../../ui/icons/entries/SearchBarIcon";
import RSSIcon from "../../../ui/icons/entries/RSSIcon";
import styles from "./entries.module.css";

export function EntryList({ entries, section, title, surface = "page", onSelect }: { readonly entries: readonly EntrySummary[]; readonly section: Section; readonly title: string; readonly surface?: "page" | "window"; readonly onSelect?: (entry: EntrySummary) => void }) {
  const overlaysEnabled = useSettings((settings) => settings.experiments.entryPopUp ?? true);
  const gallery = useSettings((settings) => settings.experiments.gallery ?? false);
  const [query, setQuery] = useState("");
  const parsed = useMemo(() => parseQuery(query), [query]);
  const filtered = entries.filter((entry) => matchesQuery({ ...entry, authors: entry.authors.map((author) => author.name) }, parsed, (text) => text));
  const photos = filtered.flatMap((entry) => (entry.display?.images ?? (entry.cover === undefined ? [] : [entry.cover])).map((image) => ({ image, entry })));
  const openEntry = (event: MouseEvent<HTMLAnchorElement>, entry: EntrySummary) => {
    if (onSelect !== undefined && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onSelect(entry); return; }
    if (!overlaysEnabled || (entry.section !== "album" && entry.section !== "projects") || !window.matchMedia("(min-width: 768px)").matches || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); presentOverlay({ kind: entry.section === "album" ? "album-entry" : "project-entry", props: { section: entry.section, slug: entry.slug }, expandTo: entryPath(entry.section, entry.slug) });
  };
  const heading = section === "album" && title === "Album" ? "Notes in Light." : section === "projects" && title === "Projects" ? "The Shape of Unseen Days." : title;
  const subtitle = section === "blog" ? "Welcome, my friend. I have been expecting you." : section === "album" ? "Moments that wished to linger." : section === "projects" ? "A record less frequently updated." : "";
  return <section className={`${styles.list} ${section === "management" ? styles.managementList : ""} ${surface === "window" ? styles.windowList : ""}`} data-section={section}>
    <header className={styles.hero}><div><h1>{heading}</h1>{subtitle && <p>{subtitle}</p>}</div></header>
    <nav className={styles.listTools} aria-label={`${section} display and search`}>
      {section === "album" ? <div className={`${styles.modeSwitch} surface-raised surface-edge`}>
        <span className={styles.modeSelection} data-gallery={gallery} aria-hidden="true" />
        <button aria-label="Show album entries" aria-pressed={!gallery} onClick={() => settingsStore.getState().setExperiment("gallery", false)}><PhotosStackIcon size={27} /></button>
        <button aria-label="Show all photographs" aria-pressed={gallery} onClick={() => settingsStore.getState().setExperiment("gallery", true)}><GalleryModeIcon size={27} /></button>
      </div> : null}
      {section === "blog" ? <a className={`${styles.rss} surface-raised surface-edge`} href="/blog/feed.rss" aria-label="Subscribe via RSS"><RSSIcon size={21} /></a> : null}
      <label className={`${styles.search} surface-raised surface-edge`}><span className="sr-only">Search {title}</span><SearchBarIcon size={21} /><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search titles, descriptions, tags, or authors" /></label>
    </nav>
    {section === "album" ? <div className={styles.masonry}>
      {gallery ? photos.map(({ image, entry }, index) => <button key={`${entry.slug}:${image.src}:${index}`} className={styles.photoTile} aria-label={`View ${image.alt || entry.title}`} onClick={() => presentOverlay({ kind:"lightbox", props:{ images:photos.map((photo) => photo.image), index }, scrim:"dim-blur" })}>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
        {image.caption && <span className={styles.photoCaption}><InlineMarks>{image.caption}</InlineMarks></span>}
      </button>) : filtered.map((entry) => {
        const image = entry.display?.images?.[0] ?? entry.cover;
        return <a key={entry.slug} href={entryPath(entry.section, entry.slug)} className={styles.photoTile} onClick={(event) => openEntry(event, entry)}>
          {image && <Image src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />}
          <span className={styles.photoHover}><span><InlineMarks>{entry.title}</InlineMarks></span>{entry.display?.images && <span className={styles.photoCount}><PhotosStackIcon size={24} />{entry.display.images.length}</span>}</span>
          <span className="sr-only">{entry.title}</span>
        </a>;
      })}
    </div> : section === "projects" ? <div className={styles.projectGrid}>{filtered.map((entry) => {
      const icon = entry.display?.icon ?? entry.cover;
      return <a key={entry.slug} href={entryPath(entry.section, entry.slug)} className={`${styles.projectTile} surface-widget surface-widget-60 surface-edge shadow-lg`} onClick={(event) => openEntry(event, entry)}>
        {icon && <Image src={icon.src} alt="" width={icon.width} height={icon.height} loading="lazy" className={styles.projectIcon} />}
        <span className={styles.projectName}><InlineMarks>{entry.title}</InlineMarks></span>
      </a>;
    })}</div> : <div className={styles.rows}>{filtered.map((entry) => <article key={entry.slug} className={`${styles.rowCard} surface-widget surface-widget-70 shadow-lg`}>
      <a href={entryPath(entry.section, entry.slug)} className={styles.rowLink} onClick={(event) => openEntry(event, entry)}>
        <div className={styles.rowText}>
          {section === "blog" && <div className={styles.cardAuthors}>{entry.authors.map((author) => <span key={author.id}>{author.avatar && <Image src={author.avatar.src} alt="" width={author.avatar.width} height={author.avatar.height} loading="lazy" />}<span>{author.name}</span></span>)}</div>}
          <h2><InlineMarks>{entry.title}</InlineMarks></h2>
          {entry.description !== undefined && <p className={styles.rowDescription}><InlineMarks>{entry.description}</InlineMarks></p>}
          <p className={styles.rowDate}><time dateTime={entry.updatedAt ?? entry.publishedAt}>{entry.updatedAt === undefined ? "" : "Edited "}{formatAbsolute(entry.updatedAt ?? entry.publishedAt)}</time>{entry.display?.readingMinutes === undefined ? null : ` · ${readingTime(entry.display.readingMinutes)}`}</p>
        </div>
        {entry.cover && <Image src={entry.cover.src} alt={entry.cover.alt} width={entry.cover.width} height={entry.cover.height} loading="lazy" className={styles.rowCover} style={{ objectPosition: `${(entry.cover.focus?.x ?? .5) * 100}% ${(entry.cover.focus?.y ?? .5) * 100}%` }} />}
      </a>
      {entry.tags.length > 0 && <nav className={styles.cardTags} aria-label={`Tags for ${entry.title}`}>{entry.tags.map((tag) => <button key={tag} onClick={() => setQuery(`#${tag}`)}>{tag}</button>)}</nav>}
    </article>)}</div>}
    {filtered.length === 0 ? <p role="status" className="my-8">No entries match this search.</p> : null}
  </section>;
}
