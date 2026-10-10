"use client";

import { useEffect, useId, useRef, useSyncExternalStore, type CSSProperties } from "react";
import { MarkScene } from "../../backdrop";
import { formatOklch } from "../color";
import { surfaceImages } from "../compile/gradient";
import { compile, applyProperties, type CustomPropertyMap } from "../compile/compile";
import { Mark } from "../mark/Mark";
import { resolve } from "../model/resolve";
import type { Scheme, ThemeSource } from "../model/types";
import type { ResolvedTheme } from "../model/resolved-theme";
import { themeStore } from "../store";
import { activeThemeSource, effectiveScheme, previewScheme } from "./active-source";
export type ThemeSourceController = { readonly read: () => { readonly source: ThemeSource; readonly scheme: Scheme }; readonly subscribe: (listener: () => void) => () => void };
export const activeSourceController: ThemeSourceController = { read: () => ({ source: activeThemeSource(), scheme: themeStore.getState().scheme }), subscribe: (listener) => themeStore.subscribe(listener) };
const markProperties = (theme: ResolvedTheme): CustomPropertyMap => {
  const properties = new Map([...compile(theme)].filter(([key]) => key.startsWith("--zw-mark-") || key === "--zw-surface-page-image"));
  if (theme.mark.backdrop) properties.set("--zw-surface-page-image", surfaceImages(theme.mark.backdrop, "page").image);
  const palette = theme.backdrop?.scenes[0]?.palette;
  properties.set("--zw-mark-scene-base", formatOklch(palette?.base ?? theme.roles.brand));
  properties.set("--zw-mark-scene-highlight", formatOklch(palette?.highlight ?? theme.roles.panel));
  properties.set("--zw-mark-scene-accent", formatOklch(palette?.accent ?? theme.roles.accent));
  properties.set("--zw-mark-scene-stroke", formatOklch(theme.mark.stroke));
  return properties;
};
export function ThemeMark({ className, controller = activeSourceController, title = "Zimo Web", primary = false }: { readonly className?: string; readonly controller?: ThemeSourceController; readonly title?: string; readonly primary?: boolean }) {
  const root = useRef<HTMLSpanElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const readStructure = () => { const source = controller.read().source; return JSON.stringify({ mark: source.mark }, (key, value: unknown) => key === "color" || key === "stroke" ? undefined : value); };
  useSyncExternalStore(controller.subscribe, readStructure, readStructure);
  const initial = controller.read();
  const schemeOf = controller === activeSourceController ? effectiveScheme : previewScheme;
  const theme = resolve(initial.source, schemeOf(initial.source, initial.scheme));
  useEffect(() => {
    let frame: number | undefined; let previous: CustomPropertyMap | undefined;
    const apply = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { frame = undefined; const { source, scheme } = controller.read(); if (root.current) previous = applyProperties(root.current, markProperties(resolve(source, schemeOf(source, scheme))), previous); });
    };
    apply(); const unsubscribe = controller.subscribe(apply);
    return () => { unsubscribe(); if (frame !== undefined) cancelAnimationFrame(frame); };
  }, [controller, schemeOf]);
  return <span ref={root} className={`inline-block aspect-square ${className ?? ""}`} style={controller === activeSourceController ? undefined : Object.fromEntries(markProperties(theme)) as CSSProperties} role="img" aria-label={title}>{theme.mark.mode === "scene" ? <MarkScene sceneId={theme.mark.sceneId ?? "gallery"} themeId={theme.id} primary={primary} className="size-full" /> : <Mark mark={theme.mark} size="100%" id={id} />}</span>;
}
