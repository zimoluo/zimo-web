import type { Slug } from "../../features/entries/model/ids";
import {
  parseSectionIndex,
  parseStoredEntry,
} from "../../features/entries/model/schema";
import type { StoredEntry } from "../../features/entries/model/schema";
import type {
  EntrySummary,
  Section,
  SectionIndex,
} from "../../features/entries/model/types";
import { listed } from "../../features/entries/model/types";
import { isDocumentSection, keys, slugFromKey } from "../storage/keys";
import type { ObjectStore } from "../storage/object";

export const entriesTag = (section: Section): string => `entries:${section}`;

export const entryTag = (section: Section, slug: Slug | string): string =>
  `entry:${section}:${slug}`;

export const authorTag = (id: string): string => `author:${id}`;

export const EMPTY_INDEX = (section: Section): SectionIndex => ({
  section,
  builtAt: "1970-01-01T00:00:00Z",
  entries: [],
});

export async function readSectionIndex(
  store: ObjectStore,
  section: Section,
): Promise<SectionIndex> {
  const record = await store.readJson(
    keys.sectionIndex(section),
    parseSectionIndex,
  );
  return record?.value ?? EMPTY_INDEX(section);
}

export async function readSummaries(
  store: ObjectStore,
  section: Section,
  options: { readonly includeUnlisted?: boolean } = {},
): Promise<readonly EntrySummary[]> {
  const index = await readSectionIndex(store, section);
  return options.includeUnlisted === true ? index.entries : listed(index.entries);
}

export type EntrySource = {
  readonly entry: StoredEntry;
  readonly markdown?: string | undefined;
};

export async function readEntry(
  store: ObjectStore,
  section: Section,
  slug: Slug,
): Promise<EntrySource | null> {
  if (!isDocumentSection(section)) {
    const record = await store.readJson(
      keys.entry(section, slug),
      parseStoredEntry,
    );
    return record === null ? null : { entry: record.value };
  }

  const [document, index] = await Promise.all([
    store.readText(keys.entry(section, slug)),
    readSectionIndex(store, section),
  ]);

  if (document === null) return null;

  const summary = index.entries.find((candidate) => candidate.slug === slug);
  if (summary === undefined) return null;

  return {
    entry: { ...summary, images: [], extras: { section } as StoredEntry["extras"] },
    markdown: document.value,
  };
}

export async function listSlugs(
  store: ObjectStore,
  section: Section,
): Promise<readonly Slug[]> {
  const refs = await store.list(keys.entryPrefix(section));
  const slugs: Slug[] = [];

  for (const ref of refs) {
    const slug = slugFromKey(section, ref.key);
    if (slug !== null) slugs.push(slug);
  }

  return slugs;
}

export async function readAllEntries(
  store: ObjectStore,
  section: Section,
): Promise<readonly StoredEntry[]> {
  const slugs = await listSlugs(store, section);

  const sources = await Promise.all(
    slugs.map((slug) => readEntry(store, section, slug)),
  );

  return sources
    .filter((source): source is EntrySource => source !== null)
    .map((source) => source.entry);
}

export const tagsIn = (
  entries: readonly EntrySummary[],
): readonly { readonly tag: string; readonly count: number }[] => {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    for (const tag of entry.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => (b.count - a.count !== 0 ? b.count - a.count : a.tag < b.tag ? -1 : 1));
};

export const withTag = (
  entries: readonly EntrySummary[],
  tag: string,
): readonly EntrySummary[] => {
  const wanted = tag.toLocaleLowerCase();
  return entries.filter((entry) =>
    entry.tags.some((candidate) => candidate.toLocaleLowerCase() === wanted),
  );
};
