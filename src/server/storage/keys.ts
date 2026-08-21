import { requireSlug } from "../../features/entries/model/ids";
import type { Slug } from "../../features/entries/model/ids";
import type { Section } from "../../features/entries/model/types";

export type DocumentSection = "blog" | "management";
export type DataSection = "album" | "projects";

export const DOCUMENT_SECTIONS: readonly DocumentSection[] = [
  "blog",
  "management",
];

export const DATA_SECTIONS: readonly DataSection[] = ["album", "projects"];

export const isDocumentSection = (
  section: Section,
): section is DocumentSection =>
  (DOCUMENT_SECTIONS as readonly Section[]).includes(section);

export const entryFormat = (section: Section): "md" | "json" =>
  isDocumentSection(section) ? "md" : "json";

export const encodeSub = (sub: string): string => encodeURIComponent(sub);

export const keys = {
  entryDocument: (section: DocumentSection, slug: Slug | string): string =>
    `${section}/documents/${requireSlug(slug)}.md`,

  entryData: (section: DataSection, slug: Slug | string): string =>
    `${section}/entries/${requireSlug(slug)}.json`,

  entry: (section: Section, slug: Slug | string): string =>
    isDocumentSection(section)
      ? keys.entryDocument(section, slug)
      : keys.entryData(section as DataSection, slug),

  entryPrefix: (section: Section): string =>
    isDocumentSection(section) ? `${section}/documents/` : `${section}/entries/`,

  sectionIndex: (section: Section): string => `${section}/index.json`,

  commentThread: (section: Section, slug: Slug | string): string =>
    `${section}/comments/${requireSlug(slug)}.json`,

  reactions: (section: Section, slug: Slug | string): string =>
    `${section}/reactions/${requireSlug(slug)}.json`,

  homeMessages: (): string => "home/messages.json",

  user: (sub: string): string => `account/users/${encodeSub(sub)}.json`,

  treeMessages: (): string => "special/christmas/tree.json",

  authorAvatar: (id: string): string => `blog/author/${id}`,

  backup: (at: string, name: string): string => `backup/${at}/${name}`,
} as const;

export function slugFromKey(section: Section, key: string): Slug | null {
  const prefix = keys.entryPrefix(section);
  const suffix = `.${entryFormat(section)}`;
  if (!key.startsWith(prefix) || !key.endsWith(suffix)) return null;

  const body = key.slice(prefix.length, key.length - suffix.length);
  try {
    return requireSlug(body);
  } catch {
    return null;
  }
}

export const MUTABLE_PREFIXES: readonly string[] = [
  "blog/comments/",
  "album/comments/",
  "projects/comments/",
  "management/comments/",
  "blog/reactions/",
  "album/reactions/",
  "projects/reactions/",
  "management/reactions/",
  "account/users/",
  "home/",
  "special/",
];
