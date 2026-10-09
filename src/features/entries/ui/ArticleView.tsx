import { ArticleReadingContribution } from "../../navigation";
import type { CSSProperties } from "react";
import { ArticleActions } from "./ArticleActions";
import type { LoadedEntry } from "../model/loaded";
import { renderDocument, InlineMarks } from "../../document";
import { Comments } from "../../comments";
import { formatAbsolute, readingTime } from "../../../lib/datetime";
import { ImageViewer } from "../../media";
import styles from "./entries.module.css";

export function ArticleView({ entry, surface = "server" }: { readonly entry: LoadedEntry; readonly surface?: "server" | "client" }) {
  const extras = entry.extras;
  return <article style={{viewTimelineName:"--zw-reading",viewTimelineAxis:"block"} as CSSProperties} className={`${styles.article} ${entry.section === "album" ? styles.album : ""} surface-widget surface-edge`}>
    {entry.parsed !== null && entry.parsed.readingMinutes >= 3 ? <ArticleReadingContribution title={entry.title}/> : null}
    <header>
      <h1 className="font-display text-4xl md:text-5xl"><InlineMarks>{entry.title}</InlineMarks></h1>
      <p className="text-text-muted my-3"><time dateTime={entry.publishedAt}>{formatAbsolute(entry.publishedAt)}</time>{entry.authors.length > 0 ? ` · ${entry.authors.map((author) => author.name).join(", ")}` : ""}{entry.parsed === null ? "" : ` · ${readingTime(entry.parsed.readingMinutes)}`}</p>
      {entry.updatedAt === undefined ? null : <p className="text-sm text-text-muted">Updated <time dateTime={entry.updatedAt}>{formatAbsolute(entry.updatedAt)}</time></p>}
      {entry.description === undefined ? null : <p className="text-lg my-4"><InlineMarks>{entry.description}</InlineMarks></p>}
      {extras.section === "projects" ? <nav aria-label="Project links" className="flex flex-wrap gap-4 my-4">{extras.links.map((link) => <a key={`${link.kind}:${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer" className="underline">{link.label}</a>)}</nav> : null}
      {extras.section === "album" ? <p>{extras.place?.name}{extras.instagramUrl === undefined ? null : <a href={extras.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline ml-4">View on Instagram</a>}</p> : null}
      <ArticleActions entry={entry} />
      <nav aria-label="Tags" className="flex flex-wrap gap-2 my-4">{entry.tags.map((tag) => <a className="rounded-full surface-nested px-3 py-1" key={tag} href={`/${entry.section}/tags/${encodeURIComponent(tag)}`}>{tag}</a>)}</nav>
    </header>
    {entry.section !== "album" && entry.cover !== undefined ? <ImageViewer images={[entry.cover]} priority /> : null}
    {entry.parsed !== null && entry.parsed.outline.length > 0 ? <details className={`${styles.outline} surface-nested rounded-2xl p-4 my-6`}><summary>On this page</summary><nav aria-label="Table of contents"><ol>{entry.parsed.outline.map((item) => <li key={item.id} style={{ paddingInlineStart: `${Math.max(0, item.depth - 1)}rem` }}><a className="underline" href={`#${item.id}`}>{item.text}</a></li>)}</ol></nav></details> : null}
    {entry.body.kind === "document" ? <div className={styles.document}>{renderDocument({ document: entry.body.document, surface })}</div> : null}
    {(entry.section === "album" || entry.section === "projects") && entry.images.length > 0 ? <div className={styles.images}><ImageViewer images={entry.images} priority={entry.section === "album" || entry.cover === undefined} /></div> : null}
    <footer className={styles.comments}><hr className="my-8 border-edge/30" /><Comments section={entry.section} slug={entry.slug} /></footer>
  </article>;
}
