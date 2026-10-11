"use client";

import dynamic from "next/dynamic";
import { memo, Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { activeThemeSource, effectiveScheme, previewScheme, formatOklch, resolve, routeKey, themeStore } from "../../theme";
import type { NavigationKey, ResolvedTheme, Scheme, ThemeSource } from "../../theme";
import { settingsStore, useSettings } from "../../settings";
import type { SceneComponentProps } from "../contract";
import { planScenes, structuralKey } from "../plan";
import type { PlannedScene } from "../plan";
import type { SceneRuntime } from "../runtime";
import { updateSceneRuntime } from "../runtime";
import { sceneRenderers } from "./scene-renderers";
import { PageTitle } from "./PageTitle";
import { SceneRuntimeContext } from "./SceneRuntimeContext";
import {usePaletteArtwork} from "./usePaletteArtwork";
import styles from "./backdrop.module.css";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });
export type BackdropSourceController = {
  readonly read: () => { readonly source: ThemeSource; readonly scheme: Scheme };
  readonly subscribe: (listener: () => void) => () => void;
};
export type HostedScene = PlannedScene & { readonly runtime: SceneRuntime };

function paletteStyle(input: SceneComponentProps): CSSProperties {
  const values: Record<string, string | number> = {};
  for (const [name, color] of Object.entries(input.palette)) values[`--zw-scene-${name}`] = formatOklch(color);
  for (const [name, value] of Object.entries(input.params)) {
    if (typeof value === "number") values[`--zw-scene-${name}`] = value;
  }
  return values as CSSProperties;
}
const DomScene = memo(function DomScene({ item, homeTitle }: { readonly item: HostedScene; readonly homeTitle: boolean }) {
  const ref=usePaletteArtwork(item.scene.id,item.runtime,item.scene.themeable!==false);
  const Component = sceneRenderers[item.scene.id];
  if (Component === undefined) throw new Error(`Missing renderer ${item.scene.id}`);
  return <div ref={ref} className={styles.scene} data-scene-key={item.key} data-scene-id={item.scene.id} data-quality={item.input.quality} style={paletteStyle(item.input)}>
    <SceneRuntimeContext value={item.runtime}><Suspense fallback={<div className={styles.staticField} />}><Component {...item.input} homeTitle={homeTitle} /></Suspense></SceneRuntimeContext>
  </div>;
});

const TitleScene = memo(function TitleScene({ item }: { readonly item: HostedScene }) {
  const ref = usePaletteArtwork(item.scene.id, item.runtime, true);
  return <div ref={ref} className={styles.scene} data-scene-key={`title:${item.key}`} style={paletteStyle(item.input)}><PageTitle variant="whiteout" /></div>;
});

function resolveSource(source: ThemeSource, scheme: Scheme, preview = false): ResolvedTheme {
  return resolve(source, (preview ? previewScheme : effectiveScheme)(source, scheme));
}

export function BackdropStack({ source, resolved, sourceController, navigation }: {
  readonly source?: ThemeSource;
  readonly resolved?: ResolvedTheme;
  readonly sourceController?: BackdropSourceController;
  readonly navigation?: NavigationKey;
}) {
  const pathname = usePathname();
  const route = navigation ?? routeKey(pathname);
  const backdrop = useSettings((state) => state.motion.backdrop);
  const rootRef = useRef<HTMLDivElement>(null);
  const [hosted, setHosted] = useState<readonly HostedScene[]>([]);
  useEffect(() => {

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = "connection" in navigator ? navigator.connection as { readonly saveData?: boolean; addEventListener?: (type: string, listener: () => void) => void; removeEventListener?: (type: string, listener: () => void) => void } : undefined;
    let current: readonly HostedScene[] = [];
    let signature = "";
    const apply = () => {
      const controlled = sourceController?.read();
      const theme = resolved ?? (controlled !== undefined ? resolveSource(controlled.source, controlled.scheme, true) : resolveSource(source ?? activeThemeSource(), themeStore.getState().scheme, source !== undefined));
      const plan = planScenes(theme, route, { backdrop: settingsStore.getState().motion.backdrop, reducedMotion: media.matches, saveData: connection?.saveData ?? false });
      const nextSignature = structuralKey(plan);
      if (signature !== nextSignature) {
        signature = nextSignature;
        current = plan.map((item) => ({ ...item, runtime: { input: item.input, listeners: new Set() } }));
        setHosted(current);
      } else {
        for (const item of current) {
          const next = plan.find((candidate) => candidate.key === item.key);
          if (next === undefined) continue;
          updateSceneRuntime(item.runtime, next.input);
          const node = rootRef.current?.querySelector<HTMLElement>(`[data-scene-key="${item.key}"]`);
          const titleNode = rootRef.current?.querySelector<HTMLElement>(`[data-scene-key="title:${item.key}"]`);
          for (const target of [node, titleNode]) {
            if (target !== undefined && target !== null) for (const [name, value] of Object.entries(paletteStyle(next.input))) target.style.setProperty(name, String(value));
          }
        }
      }
    };
    apply();
    const unsubscribe = sourceController?.subscribe(apply) ?? themeStore.subscribe(apply);
    media.addEventListener("change", apply);
    connection?.addEventListener?.("change", apply);
    return () => { unsubscribe(); media.removeEventListener("change", apply); connection?.removeEventListener?.("change", apply); };
  }, [source, resolved, sourceController, route, backdrop]);
  const r3f = useMemo(() => hosted.filter((item) => item.scene.surface === "r3f"), [hosted]);
  if (backdrop === "off") return null;
  return <div ref={rootRef} className={styles.stack} data-scope={sourceController !== undefined || source !== undefined || resolved !== undefined ? "contained" : "viewport"} aria-hidden="true">
    {hosted.filter((item) => item.scene.surface === "dom").map((item) => <DomScene key={item.key} item={item} homeTitle={route === "home"} />)}
    {route === "home" && hosted.filter((item) => item.scene.id === "whiteout").map((item) => <TitleScene key={`title:${item.key}`} item={item} />)}
    {r3f.length > 0 && <SceneCanvas scenes={r3f} contained={sourceController !== undefined || source !== undefined || resolved !== undefined} />}
  </div>;
}
