import { stripMarks } from "../../features/document/marks";
import type { EntrySummary } from "../../features/entries/model/types";
import { parseInstant } from "../../lib/datetime";

export const FEED_TITLE = "Blog | Zimo Web";
export const FEED_DESCRIPTION = "Blog articles from Zimo Web.";

const XML_ESCAPES: Readonly<Record<string, string>> = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  '"': "&quot;",
};

const INVALID_XML = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export const xml = (value: string): string =>
  value
    .replace(INVALID_XML, "")
    .replace(/[<>&'"]/g, (character) => XML_ESCAPES[character] ?? character);

export const rfc2822 = (iso: string, fallback: Date): string => {
  const parsed = parseInstant(iso);
  return (parsed ?? fallback).toUTCString();
};

const MIME_BY_EXTENSION: Readonly<Record<string, string>> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
};

export const mimeFor = (url: string): string => {
  const extension = url.split("?")[0]?.split(".").pop()?.toLowerCase() ?? "";
  return MIME_BY_EXTENSION[extension] ?? "image/jpeg";
};

export type FeedOptions = {
  readonly baseUrl: string;
  readonly builtAt: Date;
  readonly limit?: number | undefined;
};

const entryUrl = (baseUrl: string, slug: string): string =>
  new URL(encodeURIComponent(slug), new URL("blog/", baseUrl)).toString();

const item = (summary: EntrySummary, options: FeedOptions): string => {
  const url = entryUrl(options.baseUrl, summary.slug);
  const description = stripMarks(summary.description ?? "");
  const cover = summary.cover;

  const enclosure =
    cover === undefined
      ? ""
      : `\n      <enclosure url="${xml(
          new URL(cover.src, options.baseUrl).toString(),
        )}" type="${xml(mimeFor(cover.src))}" />`;

  const authors = summary.authors.map((author) => author.name).join(", ");

  return `    <item>
      <title>${xml(summary.title)}</title>
      <link>${xml(url)}</link>
      <description>${xml(description)}</description>
      <pubDate>${rfc2822(summary.updatedAt ?? summary.publishedAt, options.builtAt)}</pubDate>
      <guid isPermaLink="true">${xml(url)}</guid>
      <author>${xml(authors)}</author>${enclosure}
    </item>`;
};

export function buildFeed(
  summaries: readonly EntrySummary[],
  options: FeedOptions,
): string {
  const listed = summaries.filter((summary) => !summary.unlisted);
  const included =
    options.limit === undefined ? listed : listed.slice(0, options.limit);

  const channelLink = new URL("blog", options.baseUrl).toString();

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${xml(FEED_TITLE)}</title>
    <link>${xml(channelLink)}</link>
    <description>${xml(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${options.builtAt.toUTCString()}</lastBuildDate>
${included.map((summary) => item(summary, options)).join("\n")}
  </channel>
</rss>
`;
}
