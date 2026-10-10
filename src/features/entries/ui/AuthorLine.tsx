import Image from "next/image";
import type { EntrySummary } from "../model/types";
import { formatAbsolute, readingTime } from "../../../lib/datetime";
import styles from "./entries.module.css";

export function AuthorLine({ entry, minutes, location }: { readonly entry: EntrySummary; readonly minutes?: number | undefined; readonly location?: string | undefined }) {
  return <div className={styles.authorLine}>
    <div className={styles.authorPortraits}>{entry.authors.map((author) => author.avatar === undefined ? null : <Image key={author.id} src={author.avatar.src} alt="" width={author.avatar.width} height={author.avatar.height} loading="lazy" />)}</div>
    <div><p>{entry.authors.map((author) => author.name).join(", ")}</p><p className={styles.authorDate}>{location === undefined ? "" : `${location} · `}<time dateTime={entry.publishedAt}>{formatAbsolute(entry.publishedAt)}</time>{minutes === undefined ? "" : ` · ${readingTime(minutes)}`}{entry.updatedAt === undefined ? null : <span> · Edited <time dateTime={entry.updatedAt}>{formatAbsolute(entry.updatedAt)}</time></span>}</p></div>
  </div>;
}
