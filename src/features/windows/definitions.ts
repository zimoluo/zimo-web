import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import { z } from "zod";
import type { GeometryConstraints } from "./geometry/types";

export const WINDOW_DEFINITION_IDS = [
  "blog-reader",
  "album-entry",
  "project-entry",
  "management-reader",
  "calculator",
  "sticky-note",
  "studio",
  "settings",
] as const;

export type KnownWindowId = (typeof WINDOW_DEFINITION_IDS)[number];

export type SettingsTag =
  | "entry"
  | "blog"
  | "album"
  | "projects"
  | "table-of-contents"
  | "studio";

export type ChromeOptions = {
  readonly cornerRadius?: number | undefined;
  readonly blur?: boolean | undefined;
  readonly shadow?: boolean | undefined;
  readonly edgeHighlight?: boolean | undefined;
  readonly overflow?: "hidden" | "visible" | undefined;
  readonly startAnimation?: "full" | "reduced" | "none" | undefined;
};

export type WindowComponentProps = Record<string, unknown>;

export type WindowComponent = ComponentType<WindowComponentProps>;

export type WindowDefinition = {
  readonly id: KnownWindowId;
  readonly title: string;
  readonly load: () => Promise<{ default: WindowComponent }>;
  readonly geometry: GeometryConstraints;
  readonly chrome: ChromeOptions;
  readonly propsSchema: z.ZodType<unknown>;
  readonly countsTowardLimit?: boolean | undefined;
  readonly group?: number | undefined;
  readonly singletonKey?: string | undefined;
  readonly settingsTags?: readonly SettingsTag[] | undefined;
};

const nothing = z.object({});

const entryProps = z.object({
  section: z.string().min(1),
  slug: z.string().min(1),
});

const noteProps = z.object({ text: z.string() });

const placeholder = (): Promise<{ default: WindowComponent }> =>
  Promise.resolve({ default: () => null });

const readerGeometry: GeometryConstraints = {
  defaultSize: { width: 720, height: 640 },
  minSize: { width: 360, height: 320 },
  allowFullscreen: true,
};

export const windowDefinitions: Readonly<
  Record<KnownWindowId, WindowDefinition>
> = {
  "blog-reader": {
    id: "blog-reader",
    title: "Article",
    load: placeholder,
    geometry: readerGeometry,
    chrome: { blur: true, shadow: true, edgeHighlight: true },
    propsSchema: entryProps,
    settingsTags: ["entry", "blog", "table-of-contents"],
  },
  "album-entry": {
    id: "album-entry",
    title: "Album entry",
    load: placeholder,
    geometry: {
      defaultSize: { width: 820, height: 620 },
      minSize: { width: 380, height: 320 },
      allowFullscreen: true,
    },
    chrome: { blur: true, shadow: true },
    propsSchema: entryProps,
    settingsTags: ["entry", "album"],
  },
  "project-entry": {
    id: "project-entry",
    title: "Project",
    load: placeholder,
    geometry: readerGeometry,
    chrome: { blur: true, shadow: true },
    propsSchema: entryProps,
    settingsTags: ["entry", "projects"],
  },
  "management-reader": {
    id: "management-reader",
    title: "Policy",
    load: placeholder,
    geometry: readerGeometry,
    chrome: { blur: true, shadow: true },
    propsSchema: entryProps,
    settingsTags: ["entry", "table-of-contents"],
  },
  calculator: {
    id: "calculator",
    title: "Calculator",
    load: placeholder,
    geometry: {
      defaultSize: { width: 320, height: 460 },
      minSize: { width: 280, height: 420 },
      fixed: { width: true },
    },
    chrome: { shadow: true },
    propsSchema: nothing,
    singletonKey: "calculator",
  },
  "sticky-note": {
    id: "sticky-note",
    title: "Note",
    load: placeholder,
    geometry: {
      defaultSize: { width: 260, height: 260 },
      minSize: { width: 180, height: 180 },
    },
    chrome: { shadow: true, overflow: "visible" },
    propsSchema: noteProps,
    countsTowardLimit: false,
    group: 1,
  },
  studio: {
    id: "studio",
    title: "Studio",
    load: placeholder,
    geometry: {
      defaultSize: { width: 960, height: 700 },
      minSize: { width: 520, height: 440 },
      allowFullscreen: true,
    },
    chrome: { blur: true, shadow: true },
    propsSchema: nothing,
    singletonKey: "studio",
    settingsTags: ["studio"],
  },
  settings: {
    id: "settings",
    title: "Settings",
    load: placeholder,
    geometry: {
      defaultSize: { width: 520, height: 640 },
      minSize: { width: 360, height: 400 },
    },
    chrome: { blur: true, shadow: true },
    propsSchema: nothing,
    singletonKey: "settings",
  },
};

const components = Object.fromEntries(
  WINDOW_DEFINITION_IDS.map((id) => [id, lazy(windowDefinitions[id].load)]),
) as Readonly<Record<KnownWindowId, LazyExoticComponent<WindowComponent>>>;

export const windowComponent = (
  id: KnownWindowId,
): LazyExoticComponent<WindowComponent> => components[id];

export const isKnownWindow = (id: string): id is KnownWindowId =>
  (WINDOW_DEFINITION_IDS as readonly string[]).includes(id);

export const definitionOf = (id: string): WindowDefinition | undefined =>
  isKnownWindow(id) ? windowDefinitions[id] : undefined;

export function validateWindowProps(
  id: string,
  props: unknown,
): Readonly<Record<string, unknown>> | null {
  const definition = definitionOf(id);
  if (definition === undefined) return null;

  const result = definition.propsSchema.safeParse(props);
  return result.success
    ? (result.data as Readonly<Record<string, unknown>>)
    : null;
}

export const definitionLookup = {
  known: isKnownWindow,
  validateProps: validateWindowProps,
};

export const settingsTagsFor = (
  ids: readonly string[],
): readonly SettingsTag[] => {
  const tags = new Set<SettingsTag>();
  for (const id of ids) {
    for (const tag of definitionOf(id)?.settingsTags ?? []) tags.add(tag);
  }
  return [...tags];
};

export const countsTowardLimit = (id: string): boolean =>
  definitionOf(id)?.countsTowardLimit !== false;
