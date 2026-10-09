import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

import { z } from "zod";
import { lightboxSchema } from "../media";
import { OVERLAY_KINDS } from "./model";
import type { OverlayKind } from "./model";

export type OverlayProps = Record<string, unknown>;

export type OverlayComponent = ComponentType<OverlayProps>;

export type OverlayEntry = {
  readonly title: string;
  readonly load: () => Promise<{ default: OverlayComponent }>;
  readonly propsSchema: z.ZodType<unknown>;
};

const nothing = z.object({});

const lightboxProps = lightboxSchema;

const entryProps = z.object({
  section: z.enum(["album", "projects"]),
  slug: z.string().min(1),
});

const treeMessageProps = z.object({ id: z.string().min(1) });

const treeConfirmProps = z.object({
  position: z.tuple([z.number(), z.number()]),
  sprite: z.string().min(1),
});



export const overlayRegistry: Readonly<Record<OverlayKind, OverlayEntry>> = {
  lightbox: {
    title: "Image",
    load: () => import("../media").then((module) => ({ default: module.Lightbox })),
    propsSchema: lightboxProps,
  },
  "album-entry": {
    title: "Album entry",
    load: () => import("../windows").then((module) => ({ default: module.EntryOverlay })),
    propsSchema: entryProps,
  },
  "project-entry": {
    title: "Project",
    load: () => import("../windows").then((module) => ({ default: module.EntryOverlay })),
    propsSchema: entryProps,
  },
  "tree-message": {
    title: "Message",
    load: () => import("../christmas-tree").then((module) => ({ default: module.TreeMessageOverlay })),
    propsSchema: treeMessageProps,
  },
  "tree-confirm": {
    title: "Hang this",
    load: () => import("../christmas-tree").then((module) => ({ default: module.TreeConfirmOverlay })),
    propsSchema: treeConfirmProps,
  },
  "tree-info": {
    title: "About the tree",
    load: () => import("../christmas-tree").then((module) => ({ default: module.TreeInfoOverlay })),
    propsSchema: nothing,
  },
  "studio-presets": {
    title: "Presets",
    load: () => import("../theme/studio").then((module) => ({ default: module.StudioRoot })),
    propsSchema: nothing,
  },
  "studio-settings": {
    title: "Studio settings",
    load: () => import("../theme/studio").then((module) => ({ default: module.StudioRoot })),
    propsSchema: nothing,
  },
};

const components = Object.fromEntries(
  OVERLAY_KINDS.map((kind) => [kind, lazy(overlayRegistry[kind].load)]),
) as Readonly<Record<OverlayKind, LazyExoticComponent<OverlayComponent>>>;

export const overlayComponent = (
  kind: OverlayKind,
): LazyExoticComponent<OverlayComponent> => components[kind];

export function validateOverlayProps(
  kind: OverlayKind,
  props: unknown,
): Readonly<Record<string, unknown>> | null {
  const result = overlayRegistry[kind].propsSchema.safeParse(props);
  return result.success
    ? (result.data as Readonly<Record<string, unknown>>)
    : null;
}

export const overlayTitle = (kind: OverlayKind): string =>
  overlayRegistry[kind].title;
