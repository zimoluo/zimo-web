import type { MetadataRoute } from "next";
import { fetchAllEntries } from "@/lib/dataLayer/server/awsEntryFetcher";
import { baseUrl } from "@/lib/constants/navigationFinder";

type SectionSpec = {
  readonly route: string;
  readonly directory: string;
  readonly mode: "markdown" | "json";
  readonly priority: number;
};

const SECTIONS: readonly SectionSpec[] = [
  { route: "blog", directory: "blog/text", mode: "markdown", priority: 0.8 },
  { route: "photos", directory: "photos/entries", mode: "json", priority: 0.7 },
  { route: "projects", directory: "projects/entries", mode: "json", priority: 0.7 },
  { route: "management", directory: "about/text", mode: "markdown", priority: 0.4 },
];

const STATIC_ROUTES: readonly (readonly [string, number])[] = [
  ["", 1],
  ["blog", 0.9],
  ["photos", 0.9],
  ["projects", 0.9],
  ["about", 0.6],
  ["design", 0.5],
  ["design/theme-maker", 0.5],
  ["notebook", 0.3],
];

type EntrySummary = {
  readonly slug?: string;
  readonly unlisted?: boolean;
  readonly date?: string;
  readonly lastEditedDate?: string;
  readonly tags?: readonly string[];
};

const url = (path: string): string =>
  path === "" ? baseUrl : `${baseUrl.replace(/\/$/, "")}/${path}`;

const lastModified = (entry: EntrySummary): Date | undefined => {
  const stamp = entry.lastEditedDate ?? entry.date;
  if (stamp === undefined) return undefined;
  const parsed = new Date(stamp);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map(([path, priority]) => ({
    url: url(path),
    changeFrequency: "weekly",
    priority,
  }));

  const tags = new Set<string>();

  for (const section of SECTIONS) {
    let listed: readonly EntrySummary[] = [];
    try {
      listed = (await fetchAllEntries(section.directory, section.mode, [
        "slug",
        "date",
        "lastEditedDate",
        "unlisted",
        "tags",
      ])) as readonly EntrySummary[];
    } catch (error) {
      console.error(`sitemap: could not list ${section.directory}`, error);
      continue;
    }

    for (const entry of listed) {
      if (entry.slug === undefined || entry.unlisted === true) continue;

      const modified = lastModified(entry);
      entries.push({
        url: url(`${section.route}/${entry.slug}`),
        changeFrequency: "monthly",
        priority: section.priority,
        ...(modified === undefined ? {} : { lastModified: modified }),
      });

      if (section.route === "blog") {
        for (const tag of entry.tags ?? []) tags.add(tag);
      }
    }
  }

  for (const tag of [...tags].sort()) {
    entries.push({
      url: url(`blog/tags/${encodeURIComponent(tag)}`),
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  return entries;
}
