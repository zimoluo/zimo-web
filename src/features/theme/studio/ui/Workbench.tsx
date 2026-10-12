"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import { useDragGesture } from "../../../../lib/gesture/use-drag-gesture";
import { formatOklch, linearToGamma, maxChroma, oklchToLinearSrgb } from "../../color";
import { compile } from "../../compile/compile";
import { Mark } from "../../mark/Mark";
import { resolve } from "../../model/resolve";
import type { Scheme, ThemeSource } from "../../model/types";
import { effectiveScheme, previewScheme } from "../../runtime/active-source";
import { useTheme } from "../../store";
import { newTheme, studioSourceController, useStudio } from "../store";
import styles from "./studio.module.css";
import AddPlusIcon from "../../../../ui/icons/entries/AddPlusIcon";
import { useStudioGesture } from "./use-studio-gesture";

export const roleLabels = { text: "Text", textMuted: "Secondary", line: "Line", fill: "Fill", panel: "Panel", edge: "Edge", shade: "Shade", accent: "Accent", brand: "Browser" } as const;

export function ThemeThumbnail({ source, scheme = "light" }: { readonly source: ThemeSource; readonly scheme?: Scheme }) {
  const id = useId();
  const theme = useMemo(() => resolve(source, effectiveScheme(source, scheme)), [source, scheme]);
  const properties = useMemo(() => Object.fromEntries(compile(theme)), [theme]);
  return <span className={styles.thumbnail} style={{ ...properties, backgroundImage: properties["--zw-surface-widget-image"] ?? properties["--zw-surface-page-image"] } as CSSProperties}><Mark mark={theme.mark} id={`profile-${id}`} size="100%" /></span>;
}

export function ProfileShelf() {
  const profiles = useTheme((state) => state.profiles);
  const id = useStudio((state) => state.draft.id);
  const scheme = useStudio((state) => state.selection.scheme);
  return <div className={styles.profileShelf} data-empty={profiles.length === 0 || undefined} role="group" aria-label="Saved themes"><button type="button" className={styles.newProfile} aria-label="New theme" title="New theme" onClick={() => useStudio.getState().load(newTheme())}><AddPlusIcon size={24} /></button>{profiles.map((profile, index) => <button key={`${profile.id}-${index}`} type="button" className={styles.profileTile} aria-label={`Edit ${profile.name}`} aria-pressed={id === profile.id} title={profile.name} onClick={() => useStudio.getState().load(profile, index)}><ThemeThumbnail source={profile} scheme={scheme} /><span>{profile.name}</span></button>)}{profiles.length === 0 && <p>Saved themes live here.</p>}</div>;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
export function SeedField() {
  const canvas = useRef<HTMLCanvasElement>(null), gesture = useStudioGesture();
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (context) {
      const width = 180, height = 96;
      const pixels = context.createImageData(width, height);
      for (let x = 0; x < width; x++) {
        const h = x / (width - 1) * 360;
        const maximum = maxChroma(.7, h, "srgb");
        for (let y = 0; y < height; y++) {
          const rgb = oklchToLinearSrgb({ l: .7, c: maximum * (1 - y / (height - 1)), h });
          const at = (y * width + x) * 4;
          pixels.data[at] = Math.round(clamp(linearToGamma(rgb.r)) * 255);
          pixels.data[at + 1] = Math.round(clamp(linearToGamma(rgb.g)) * 255);
          pixels.data[at + 2] = Math.round(clamp(linearToGamma(rgb.b)) * 255);
          pixels.data[at + 3] = 255;
        }
      }
      context.putImageData(pixels, 0, 0);
    }
    const paint = () => {
      const state = useStudio.getState();
      if (marker.current) {
        marker.current.style.left = `${state.draft.ramp.hue / 360 * 100}%`;
        marker.current.style.top = `${(1 - state.draft.ramp.chroma) * 100}%`;
        marker.current.style.background = formatOklch(resolve(state.draft, previewScheme(state.draft, state.selection.scheme)).tone(.5));
      }
    };
    paint(); return studioSourceController.subscribe(paint);
  }, []);
  const change = (x: number, y: number, rect: DOMRect) => useStudio.getState().edit((draft) => { draft.ramp.hue = clamp((x - rect.left) / rect.width) * 360; draft.ramp.chroma = clamp(1 - (y - rect.top) / rect.height); });
  const drag = useDragGesture({ onStart: (pointer, element) => { const rect = element.getBoundingClientRect(); if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); gesture.begin(); change(pointer.clientX, pointer.clientY, rect); return rect; }, onMove: (pointer, rect) => change(pointer.clientX, pointer.clientY, rect), onEnd: () => gesture.end(), onCancel: () => gesture.end() });
  return <div className={styles.seedField} style={drag.style} onPointerDown={drag.onPointerDown} aria-hidden="true"><canvas ref={canvas} width={180} height={96} /><span ref={marker} /></div>;
}
