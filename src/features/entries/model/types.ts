import type { DocumentNode } from "../../document/model/types";
import type { AuthorId, Slug } from "./ids";

export const SECTIONS = ["blog", "album", "projects", "management"] as const;

export type Section = (typeof SECTIONS)[number];

export const isSection = (input: string): input is Section =>
  (SECTIONS as readonly string[]).includes(input);

export type ImageAsset = {
  readonly src: string;
  readonly originalSrc?: string | undefined;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly caption?: string | undefined;
  readonly focus?: { readonly x: number; readonly y: number } | undefined;
  readonly placeholder?: string | undefined;
};

export type AuthorRef = {
  readonly id: AuthorId;
  readonly name: string;
  readonly avatar?: ImageAsset | undefined;
};

export type Place = {
  readonly latitude: number;
  readonly longitude: number;
  readonly name?: string | undefined;
};

export const LINK_KINDS = [
  "source",
  "demo",
  "download",
  "article",
  "store",
  "other",
] as const;

export type LinkKind = (typeof LINK_KINDS)[number];

export type ProjectLink = {
  readonly label: string;
  readonly url: string;
  readonly kind: LinkKind;
};

export type SectionExtras =
  | { readonly section: "blog" }
  | { readonly section: "management" }
  | {
      readonly section: "album";
      readonly place?: Place | undefined;
      readonly instagramUrl?: string | undefined;
    }
  | {
      readonly section: "projects";
      readonly links: readonly ProjectLink[];
      readonly icon: ImageAsset;
    };

export type ExtrasFor<S extends Section> = Extract<
  SectionExtras,
  { readonly section: S }
>;

export type EntryDisplay = {
  readonly icon?: ImageAsset | undefined;
  readonly images?: readonly ImageAsset[] | undefined;
  readonly readingMinutes?: number | undefined;
};

export type EntrySummary = {
  readonly section: Section;
  readonly slug: Slug;
  readonly title: string;
  readonly description?: string | undefined;
  readonly publishedAt: string;
  readonly updatedAt?: string | undefined;
  readonly unlisted: boolean;
  readonly tags: readonly string[];
  readonly authors: readonly AuthorRef[];
  readonly cover?: ImageAsset | undefined;
  readonly displayCover?: boolean | undefined;
  readonly display?: EntryDisplay | undefined;
};

export type EntryBody =
  | { readonly kind: "document"; readonly document: DocumentNode }
  | { readonly kind: "none" };

export type Entry = EntrySummary & {
  readonly body: EntryBody;
  readonly images: readonly ImageAsset[];
  readonly extras: SectionExtras;
};

export type SectionEntry<S extends Section> = Omit<
  Entry,
  "section" | "extras"
> & {
  readonly section: S;
  readonly extras: ExtrasFor<S>;
};

export type SectionIndex = {
  readonly section: Section;
  readonly builtAt: string;
  readonly entries: readonly EntrySummary[];
};

export const HAS_DOCUMENT: Readonly<Record<Section, boolean>> = {
  blog: true,
  album: false,
  projects: true,
  management: true,
};

export const aspectRatio = (image: ImageAsset): number =>
  image.width / image.height;

export const DEFAULT_FOCUS = { x: 0.5, y: 0.5 } as const;

export const objectPosition = (image: ImageAsset): string => {
  const focus = image.focus ?? DEFAULT_FOCUS;
  return `${(focus.x * 100).toFixed(4).replace(/\.?0+$/, "")}% ${(focus.y * 100)
    .toFixed(4)
    .replace(/\.?0+$/, "")}%`;
};

export const listed = (entries: readonly EntrySummary[]): EntrySummary[] =>
  entries.filter((entry) => !entry.unlisted);
