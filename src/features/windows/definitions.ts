import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import { z } from "zod";
import type { GeometryConstraints } from "./geometry/types";

export type SettingsTag =
  | "entry"
  | "blog"
  | "album"
  | "projects"
  | "table-of-contents"
  | "studio"
  | "calculator";

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
  readonly id: string;
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
  section: z.enum(["blog", "album", "projects", "management"]),
  slug: z.string(),
});

const noteProps = z.object({ text: z.string().default("") });

const readerLoader = () => import("./ui/EntryReader");

const readerGeometry: GeometryConstraints = {
  defaultSize: { width: 720, height: 640 },
  minSize: { width: 360, height: 320 },
  allowFullscreen: true,
};

const definitions = {
  "blog-reader": {
    id: "blog-reader",
    title: "Article",
    load: readerLoader,
    geometry: readerGeometry,
    chrome: { blur: true, shadow: true, edgeHighlight: true },
    propsSchema: entryProps,
    settingsTags: ["entry", "blog", "table-of-contents"],
  },
  "album-entry": {
    id: "album-entry",
    title: "Album entry",
    load: readerLoader,
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
    load: readerLoader,
    geometry: readerGeometry,
    chrome: { blur: true, shadow: true },
    propsSchema: entryProps,
    settingsTags: ["entry", "projects"],
  },
  "management-reader": {
    id: "management-reader",
    title: "Policy",
    load: readerLoader,
    geometry: readerGeometry,
    chrome: { blur: true, shadow: true },
    propsSchema: entryProps,
    settingsTags: ["entry", "table-of-contents"],
  },
  calculator: {
    id: "calculator",
    title: "Calculator",
    load: () => import("../calculator").then((module) => ({ default: module.Calculator })),
    geometry: {
      defaultSize: { width: 320, height: 460 },
      minSize: { width: 280, height: 420 },
      fixed: { width: true },
    },
    chrome: { shadow: true },
    propsSchema: z.object({ presetExpression: z.array(z.string()).optional(), presetHistory: z.string().optional() }),
    singletonKey: "calculator",
    settingsTags: ["calculator"],
  },
  "sticky-note": {
    id: "sticky-note",
    title: "Note",
    load: () => import("./ui/StickyNote"),
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
    load: () => import("../theme/studio").then((module) => ({ default: module.StudioRoot })),
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
    load: () => import("../settings").then((module) => ({ default: module.SettingsPanel })),
    geometry: {
      defaultSize: { width: 520, height: 640 },
      minSize: { width: 360, height: 400 },
    },
    chrome: { blur: true, shadow: true },
    propsSchema: nothing,
    singletonKey: "settings",
  },
  "window-picker": {
    id: "window-picker", title: "Windows", load: () => import("./ui/WindowPicker"),
    geometry: { defaultSize: { width: 560, height: 480 }, minSize: { width: 320, height: 300 } },
    chrome: { shadow: true }, propsSchema: nothing, singletonKey: "window-picker", countsTowardLimit: false,
  },
  notebook: {
    id: "notebook", title: "Notebook", load: () => import("../notebook").then((module) => ({ default: module.NotebookEditor })),
    geometry: { defaultSize: { width: 560, height: 460 }, minSize: { width: 320, height: 300 } },
    chrome: { shadow: true }, propsSchema: nothing,
  },
  "signal-generator": {
    id: "signal-generator", title: "Signal Generator", load: () => import("../signal").then((module) => ({ default: module.SignalGenerator })),
    geometry: { defaultSize: { width: 480, height: 420 }, minSize: { width: 320, height: 300 } },
    chrome: { shadow: true }, propsSchema: z.object({title:z.string().optional(),body:z.string().optional(),icon:z.string().optional()}),
  },
  "identity-mark": {
    id: "identity-mark", title: "Favicon", load: () => import("./ui/IdentityMarkWindow"),
    geometry: { defaultSize: { width: 240, height: 260 }, minSize: { width: 160, height: 160 } },
    chrome: { shadow: true }, propsSchema: z.object({ themeId: z.string().optional() }),
  },
  navigator: {
    id: "navigator", title: "Navigator", load: () => import("./ui/Navigator"),
    geometry: { defaultSize: { width: 320, height: 360 }, minSize: { width: 250, height: 200 } },
    chrome: { shadow: true }, propsSchema: nothing,
  },
  "web-frame": {
    id: "web-frame", title: "Window Web", load: () => import("./ui/WebFrame"),
    geometry: { defaultSize: { width: 640, height: 480 }, minSize: { width: 320, height: 300 } },
    chrome: { shadow: true }, propsSchema: z.object({ url: z.url().default("https://www.zimoluo.me/"), zoom: z.number().positive().default(0.83) }), singletonKey: "web-frame",
  },
  wikipedia: {
    id: "wikipedia", title: "Wikipedia", load: () => import("./ui/WebFrame"),
    geometry: { defaultSize: { width: 640, height: 480 }, minSize: { width: 320, height: 300 } },
    chrome: { shadow: true }, propsSchema: z.object({ url: z.url().default("https://en.wikipedia.org/wiki/Main_Page"), zoom: z.number().positive().default(0.83) }), singletonKey: "wikipedia",
  },
  blank: {
    id: "blank", title: "Blank", load: () => import("./ui/Blank"),
    geometry: { defaultSize: { width: 360, height: 360 }, minSize: { width: 128, height: 128 } },
    chrome: { shadow: true }, propsSchema: nothing,
  },
  debugger: {
    id: "debugger", title: "Debugger", load: () => import("./ui/WindowDebugger"),
    geometry: { defaultSize: { width: 600, height: 420 }, minSize: { width: 360, height: 300 } },
    chrome: { shadow: true }, propsSchema: nothing,
  },
} satisfies Record<string, WindowDefinition>;

export type KnownWindowId = keyof typeof definitions;
export const WINDOW_DEFINITION_IDS = Object.keys(definitions) as KnownWindowId[];
export const windowDefinitions: Readonly<Record<KnownWindowId, WindowDefinition>> = definitions;

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
