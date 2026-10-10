import Image from "next/image";
import { ArticleReadingContribution } from "../../navigation";
import type { CSSProperties } from "react";
import { ArticleActions } from "./ArticleActions";
import { AuthorLine } from "./AuthorLine";
import type { LoadedEntry } from "../model/loaded";
import { renderDocument, InlineMarks } from "../../document";
import { Comments } from "../../comments";
import { ImageViewer } from "../../media";
import GitHubLogo from "../../../ui/icons/sharing/GitHubLogo";
import SearchBarIcon from "../../../ui/icons/entries/SearchBarIcon";
import DownloadIcon from "../../../ui/icons/sharing/DownloadIcon";
import InstagramLogo from "../../../ui/icons/sharing/InstagramLogo";
import LocationPinIcon from "../../../ui/icons/entries/LocationPinIcon";
import styles from "./entries.module.css";

export function ArticleView({ entry, surface = "server" }: { readonly entry: LoadedEntry; readonly surface?: "server" | "client" | "overlay" }) {
  const extras = entry.extras;
  const outlined = entry.parsed !== null && entry.parsed.outline.length > 0;
  const minutes = entry.parsed?.readingMinutes;
  const projectImages = entry.section === "projects" && entry.cover !== undefined ? [entry.cover, ...entry.images.filter((image) => image.src !== entry.cover?.src)] : entry.images;
  const projectWithMedia = entry.section === "projects" && projectImages.length > 0;
  return <article style={{viewTimelineName:"--zw-reading",viewTimelineAxis:"block"} as CSSProperties} className={`${styles.article} ${surface !== "server" ? styles.embedded : ""} ${entry.section === "album" ? styles.album : projectWithMedia ? styles.projectReader : ""} surface-widget shadow-lg`} data-section={entry.section} data-reading-surface={surface}>
    {entry.parsed !== null && entry.parsed.readingMinutes >= 3 ? <ArticleReadingContribution title={entry.title}/> : null}
    <div className={`${styles.readerPane} ${entry.section === "album" ? "surface-raised" : ""}`}>
      <header className={styles.readerHeader}>
        {extras.section === "album" ? <>
          <div className={styles.albumIdentity}><AuthorLine entry={entry} location={extras.place?.name}/>{extras.instagramUrl !== undefined && <a href={extras.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="View on Instagram"><InstagramLogo size={24}/></a>}</div>
          {extras.place !== undefined && extras.place.name === undefined ? <p className={styles.place}><LocationPinIcon size={16}/>{extras.place.latitude}, {extras.place.longitude}</p> : null}
          <h1 className={styles.albumTitle}><InlineMarks>{entry.title}</InlineMarks></h1>
        </> : <>
          <div className={styles.headingRow}>{extras.section === "projects" && <Image src={extras.icon.src} alt="" width={extras.icon.width} height={extras.icon.height} className={styles.headingIcon}/>}<h1><InlineMarks>{entry.title}</InlineMarks></h1></div>
          {entry.description !== undefined && <p className={styles.description}><InlineMarks>{entry.description}</InlineMarks></p>}
          <div className={`${styles.readerIdentity} ${extras.section === "projects" ? "surface-raised shadow-lg" : ""}`}><AuthorLine entry={entry} minutes={minutes}/>{extras.section === "projects" && <nav className={styles.projectLinks} aria-label="Project links">{extras.links.map((link) => {
            const Icon = link.kind === "source" ? GitHubLogo : link.kind === "download" ? DownloadIcon : SearchBarIcon;
            return <a key={`${link.kind}:${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label} title={link.label}><Icon size={28}/></a>;
          })}</nav>}</div>
        </>}
        <ArticleActions entry={entry}/>
        {entry.tags.length > 0 && <nav aria-label="Tags" className={styles.readerTags}>{entry.tags.map((tag) => <a key={tag} href={`/${entry.section}/tags/${encodeURIComponent(tag)}`}>{tag}</a>)}</nav>}
        {outlined && (surface === "server" ? <nav className={`${styles.outline} surface-raised shadow-lg`} aria-label="Table of contents"><h2>On this page</h2><ol>{entry.parsed?.outline.map((item) => <li key={item.id} style={{ paddingInlineStart: `${Math.max(0, item.depth - 1)}rem` }}><a href={`#${item.id}`}>{item.text}</a></li>)}</ol></nav> : <details className={`${styles.outline} surface-raised shadow-lg`}><summary>On this page</summary><nav aria-label="Table of contents"><ol>{entry.parsed?.outline.map((item) => <li key={item.id} style={{ paddingInlineStart: `${Math.max(0, item.depth - 1)}rem` }}><a href={`#${item.id}`}>{item.text}</a></li>)}</ol></nav></details>)}
      </header>
      {entry.section !== "album" && !projectWithMedia && entry.cover !== undefined && entry.displayCover !== false ? <div className={styles.coverImage}><ImageViewer images={[entry.cover]} priority/></div> : null}
      {entry.body.kind === "document" ? <div className={styles.document}>{renderDocument({ document: entry.body.document, surface: surface === "server" ? "server" : "client" })}</div> : null}
      <footer className={`${styles.comments} ${entry.section === "album" ? "surface-raised" : ""}`}><Comments section={entry.section} slug={entry.slug}/></footer>
    </div>
    {projectWithMedia ? <div className={styles.albumImages}><ImageViewer images={projectImages} priority className={styles.albumViewer ?? ""}/></div> : null}
    {entry.section === "album" && entry.images.length > 0 ? <div className={styles.albumImages}><ImageViewer images={entry.images} priority className={styles.albumViewer ?? ""}/></div> : null}
  </article>;
}
