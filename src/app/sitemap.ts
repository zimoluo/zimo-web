import type { MetadataRoute } from "next";
import { loadSummaries } from "@/src/server/entries/load";
const BASE = "https://www.zimoluo.me";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result: MetadataRoute.Sitemap = ["", "blog", "album", "projects", "management", "about", "design", "design/theme-maker", "notebook"].map((path) => ({ url: `${BASE}/${path}`, changeFrequency: "weekly", priority: path === "" ? 1 : .8 }));
  for (const section of ["blog", "album", "projects", "management"] as const) {
    const entries = await loadSummaries(section);
    for (const entry of entries) result.push({ url: `${BASE}/${section}/${entry.slug}`, lastModified: entry.updatedAt ?? entry.publishedAt, changeFrequency: "monthly", priority: .7 });
    for (const tag of [...new Set(entries.flatMap((entry) => [...entry.tags]))].sort()) result.push({ url: `${BASE}/${section}/tags/${encodeURIComponent(tag)}`, changeFrequency: "weekly", priority: .5 });
  }
  return result;
}
