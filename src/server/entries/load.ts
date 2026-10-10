import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { objects, storageCacheKey } from "../storage/object";
import { entryTag, entriesTag, readEntry, readSummaries } from "./read";
import { parseSlug } from "../../features/entries/model/ids";
import type { EntrySummary, Section } from "../../features/entries/model/types";
import type { LoadedEntry } from "../../features/entries/model/loaded";
import { parseDocument } from "../../features/document/parse";

export const loadSummaries = cache(async (section: Section) =>
  unstable_cache(async () => {
    const summaries = await readSummaries(objects(), section);
    return enrichSummaries(section, summaries);
  }, ["section-display", storageCacheKey(), section], { revalidate: 3600, tags: [entriesTag(section)] })());

export async function enrichSummaries(section: Section, summaries: readonly EntrySummary[]): Promise<readonly EntrySummary[]> {
  if (section === "management") return summaries;
  return Promise.all(summaries.map(async (summary) => {
      if (section === "projects" && summary.display?.icon !== undefined || section === "album" && summary.display?.images !== undefined || section === "blog" && summary.display?.readingMinutes !== undefined) return summary;
      const loaded = await findEntry(section, summary.slug);
      if (loaded === null) return summary;
      return { ...summary, display: { ...summary.display,
        ...(loaded.extras.section === "projects" ? {icon:loaded.extras.icon} : {}),
        ...(section === "album" ? {images:loaded.images} : {}),
        ...(loaded.parsed === null ? {} : {readingMinutes:loaded.parsed.readingMinutes}),
      } };
  }));
}

export const findEntry = cache(async (section: Section, rawSlug: string): Promise<LoadedEntry | null> => {
  const slug = parseSlug(rawSlug);
  if (slug === null) return null;
  const entry = await unstable_cache(async () => {
    const source = await readEntry(objects(), section, slug);
    if (source === null) return null;
    const parsed = source.markdown === undefined ? null : await parseDocument(source.markdown, { idNamespace: slug });
    if(parsed !== null) {
      const attach = (node:unknown):void => {
        if(typeof node !== "object" || node === null) return;
        const value=node as {type?:string;tagName?:string;properties?:Record<string,unknown>;children?:unknown[]};
        if(value.type === "element" && value.tagName === "img" && value.properties !== undefined) {
          const asset=source.entry.images.find((image)=>image.src === value.properties?.src);
          if(asset !== undefined) Object.assign(value.properties,{width:asset.width,height:asset.height,alt:asset.alt,...(asset.placeholder === undefined ? {} : {placeholder:asset.placeholder}),...(asset.caption === undefined ? {} : {caption:asset.caption}),...(asset.originalSrc === undefined ? {} : {originalSrc:asset.originalSrc})});
        }
        value.children?.forEach(attach);
      };
      attach(parsed.document);
    }
    const { markdown: _markdown, ...stored } = source.entry;
    return { ...stored, body: parsed === null ? { kind: "none" as const } : { kind: "document" as const, document: parsed.document }, parsed };
  }, ["entry", storageCacheKey(), section, slug], { revalidate: 604800, tags: [entryTag(section, slug)] })();
  return entry;
});

export const loadEntry = cache(async (section: Section, slug: string): Promise<LoadedEntry> => {
  const entry = await findEntry(section, slug);
  if (entry === null) notFound();
  return entry;
});
