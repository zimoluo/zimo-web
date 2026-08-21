import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

import { z } from "zod";
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

const lightboxProps = z.object({
  images: z.array(z.unknown()).min(1),
  index: z.number().int().min(0),
});

const entryProps = z.object({
  section: z.string().min(1),
  slug: z.string().min(1),
});

const treeMessageProps = z.object({ id: z.string().min(1) });

const treeConfirmProps = z.object({
  position: z.tuple([z.number(), z.number()]),
  sprite: z.string().min(1),
});

const placeholder = (): Promise<{ default: OverlayComponent }> =>
  Promise.resolve({ default: () => null });

export const overlayRegistry: Readonly<Record<OverlayKind, OverlayEntry>> = {
  lightbox: {
    title: "Image",
    load: placeholder,
    propsSchema: lightboxProps,
  },
  "album-entry": {
    title: "Album entry",
    load: placeholder,
    propsSchema: entryProps,
  },
  "project-entry": {
    title: "Project",
    load: placeholder,
    propsSchema: entryProps,
  },
  "tree-message": {
    title: "Message",
    load: placeholder,
    propsSchema: treeMessageProps,
  },
  "tree-confirm": {
    title: "Hang this",
    load: placeholder,
    propsSchema: treeConfirmProps,
  },
  "tree-info": {
    title: "About the tree",
    load: placeholder,
    propsSchema: nothing,
  },
  "studio-presets": {
    title: "Presets",
    load: placeholder,
    propsSchema: nothing,
  },
  "studio-settings": {
    title: "Studio settings",
    load: placeholder,
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
