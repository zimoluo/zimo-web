import { requireSlug } from "./model/ids";
import type { Slug } from "./model/ids";
import type { Section } from "./model/types";

export const sectionPath = (section: Section): string => `/${section}`;

export const entryPath = (section: Section, slug: Slug | string): string =>
  `/${section}/${requireSlug(slug)}`;

export const tagPath = (section: Section, tag: string): string =>
  `/${section}/tag/${encodeURIComponent(tag)}`;

export const FEED_PATH = "/blog/feed.rss";

export const apiEntriesPath = (section: Section): string =>
  `/api/v1/entries/${section}`;

export const apiEntryPath = (section: Section, slug: Slug | string): string =>
  `/api/v1/entries/${section}/${requireSlug(slug)}`;

export const apiCommentsPath = (section: Section, slug: Slug | string): string =>
  `${apiEntryPath(section, slug)}/comments`;

export const apiReactionsPath = (
  section: Section,
  slug: Slug | string,
): string => `${apiEntryPath(section, slug)}/reactions`;
