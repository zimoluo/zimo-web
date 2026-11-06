import "server-only";

import { unstable_cache } from "next/cache";
import { fetchAllEntries } from "./awsEntryFetcher";
import { restoreDisplayText } from "@/lib/lightMarkUpProcessor";
import { normalizeSearchEntry } from "@/lib/searchUtil";

const sources = {
  blog: { directory: "blog/text", mode: "markdown" },
  photos: { directory: "photos/entries", mode: "json" },
  projects: { directory: "projects/entries", mode: "json" },
  management: { directory: "about/text", mode: "markdown" },
} as const;

const fields = ["slug", "title", "description", "tags", "author", "authors", "date", "lastEditedDate", "location", "unlisted"];

const readSection = unstable_cache(async (section: EntrySection) => {
  const { directory, mode } = sources[section];
  const entries = await fetchAllEntries(directory, mode, fields);
  return entries.flatMap((entry) => {
    const normalized = normalizeSearchEntry(section, entry, restoreDisplayText);
    return normalized ? [normalized] : [];
  });
}, ["site-search-metadata-v1"], { revalidate: 1800 });

export async function readSearchIndex(): Promise<SiteSearchIndex> {
  const sections = Object.keys(sources) as EntrySection[];
  const results = await Promise.allSettled(sections.map(readSection));
  return {
    entries: results.flatMap((result) => result.status === "fulfilled" ? result.value : []),
    unavailable: sections.filter((_, index) => results[index].status === "rejected"),
  };
}
