import { apiEntryPath, apiEntriesPath } from "./paths";
import type { Section, EntrySummary } from "./model/types";
import type { LoadedEntry } from "./model/loaded";
import { parseEntrySummary, parseLoadedEntry } from "./model/schema";
import { z } from "zod";
export async function fetchEntry(section: Section, slug: string, signal?: AbortSignal): Promise<LoadedEntry> {
  const response = await fetch(apiEntryPath(section, slug), signal === undefined ? {} : { signal });
  if (!response.ok) throw new Error(response.status === 404 ? "That entry does not exist." : "Could not load that entry.");
  return parseLoadedEntry(await response.json());
}
export async function fetchSummaries(section: Section, signal?: AbortSignal): Promise<readonly EntrySummary[]> {
  const entries: EntrySummary[] = [];
  let cursor: string | undefined;
  const seen = new Set<string>();
  do {
    const query = new URLSearchParams({ limit: "200", ...(cursor === undefined ? {} : { cursor }) });
    const response = await fetch(`${apiEntriesPath(section)}?${query}`, signal === undefined ? {} : { signal });
    if (!response.ok) throw new Error("Could not load the entries.");
    const page = z.object({ items:z.array(z.unknown()),nextCursor:z.string().optional() }).parse(await response.json());
    entries.push(...page.items.map(parseEntrySummary));
    cursor = page.nextCursor;
    if (cursor !== undefined && seen.has(cursor)) throw new Error("The entry index returned a repeated page.");
    if (cursor !== undefined) seen.add(cursor);
  } while (cursor !== undefined);
  return entries;
}
