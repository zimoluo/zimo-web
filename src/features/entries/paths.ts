import { requireSlug } from "./model/ids";
import type { Slug } from "./model/ids";
import type { Section } from "./model/types";

export type EntryFile = { readonly key: string; readonly format: "md" | "json" };

const LAYOUT: Readonly<Record<Section, EntryFile>> = {
  blog: { key: "blog/documents", format: "md" },
  album: { key: "album/entries", format: "json" },
  projects: { key: "projects/entries", format: "json" },
  management: { key: "management/documents", format: "md" },
};

export const entryFormat = (section: Section): "md" | "json" =>
  LAYOUT[section].format;

export const entryKey = (section: Section, slug: Slug | string): string => {
  const safe = requireSlug(slug);
  const layout = LAYOUT[section];
  return `${layout.key}/${safe}.${layout.format}`;
};

export const entryPrefix = (section: Section): string =>
  `${LAYOUT[section].key}/`;

export const indexKey = (section: Section): string => `${section}/index.json`;

export const commentsKey = (section: Section, slug: Slug | string): string =>
  `${section}/comments/${requireSlug(slug)}.json`;

export const reactionsKey = (section: Section, slug: Slug | string): string =>
  `${section}/reactions/${requireSlug(slug)}.json`;

export const slugFromKey = (section: Section, key: string): Slug | null => {
  const layout = LAYOUT[section];
  const prefix = `${layout.key}/`;
  const suffix = `.${layout.format}`;
  if (!key.startsWith(prefix) || !key.endsWith(suffix)) return null;
  const body = key.slice(prefix.length, key.length - suffix.length);
  try {
    return requireSlug(body);
  } catch {
    return null;
  }
};

export const entryPath = (section: Section, slug: Slug | string): string =>
  `/${section}/${requireSlug(slug)}`;
