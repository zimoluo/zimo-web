"use client";

import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useDragGesture } from "../../../../lib/gesture/use-drag-gesture";
import CrossIcon from "../../../../ui/icons/CrossIcon";
import DuplicateIcon from "../../../../ui/icons/entries/DuplicateIcon";
import VisibleIcon from "../../../../ui/icons/entries/VisibleIcon";
import InvisibleIcon from "../../../../ui/icons/entries/InvisibleIcon";
import UpDownSwitchIcon from "../../../../ui/icons/entries/UpDownSwitchIcon";
import { formatOklch } from "../../color";
import { layerToCss } from "../../compile/gradient";
import { resolve } from "../../model/resolve";
import type { GradientLayer, SurfaceSource } from "../../model/types";
import { previewScheme } from "../../runtime/active-source";
import { selectedLayer, selectedLayers, studioSourceController, useStudio } from "../store";
import styles from "./studio.module.css";

const names = { linear: "Linear gradient", radial: "Radial gradient", conic: "Conic gradient", raw: "Custom CSS" } as const;
const visible = (surface: SurfaceSource): SurfaceSource => ({ ...surface, layers: surface.layers.map(layer => ({ ...layer, enabled: true })) });

function LayerRow({ id, kind, enabled, index, total, chosen }: { readonly id: string; readonly kind: GradientLayer["kind"]; readonly enabled: boolean; readonly index: number; readonly total: number; readonly chosen: boolean }) {
  const row = useRef<HTMLDivElement>(null);
  const drag = useDragGesture({
    axis: "y",
    onStart: (_pointer, handle) => {
      const element = row.current;
      if (!element) return null;
      element.dataset.dragging = "";
      return { element, list: handle.closest("[data-layer-list]") };
    },
    onMove: (_pointer, context, delta) => { context.element.style.transform = `translateY(${delta.y}px)`; },
    onCancel: (_pointer, context) => { context.element.style.transform = ""; delete context.element.dataset.dragging; },
    onEnd: (pointer, context) => {
      context.element.style.transform = ""; delete context.element.dataset.dragging;
      const siblings = Array.from(context.list?.querySelectorAll<HTMLElement>("[data-layer-id]") ?? []);
      const original = siblings.findIndex(element => element.dataset.layerId === id);
      const target = siblings.filter(element => element.dataset.layerId !== id && pointer.clientY > element.getBoundingClientRect().top + element.getBoundingClientRect().height / 2).length;
      useStudio.getState().reorderLayer(id, target - original);
    },
  });
  const remove = () => {
    const list = row.current?.closest("[data-layer-list]");
    const siblings = Array.from(list?.querySelectorAll<HTMLElement>("[data-layer-id]") ?? []);
    const next = siblings[index + 1] ?? siblings[index - 1];
    useStudio.getState().removeLayer(id);
    (next?.querySelector<HTMLButtonElement>("[data-layer-select]") ?? list?.closest("section")?.querySelector<HTMLButtonElement>("[data-add-layer]"))?.focus({ preventScroll: true });
  };
  return <div ref={row} role="listitem" data-layer-id={id} data-selected={chosen || undefined} data-disabled={!enabled || undefined} className={styles.layerRow}>
    <div className={styles.layerHeading}>
      <button type="button" className={styles.layerDrag} style={drag.style} onPointerDown={drag.onPointerDown} aria-label={`Drag ${kind} layer`} title="Drag to reorder; use arrow keys to move" onKeyDown={event => { if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); useStudio.getState().reorderLayer(id, event.key === "ArrowUp" ? -1 : 1); } }}><span className={styles.dragGlyph}><UpDownSwitchIcon size={12} /><UpDownSwitchIcon size={12} className={styles.downArrow ?? ""} /></span></button>
      <button type="button" data-layer-select="" className={styles.layerName} aria-pressed={chosen} aria-label={`Edit ${names[kind]} layer${enabled ? "" : ", disabled"}`} onClick={() => useStudio.getState().select({ layerId: id })}><span data-layer-preview={id} className={styles.layerPreview} aria-hidden="true" /><span>{names[kind]}</span></button>
      <button type="button" className={styles.layerVisibility} aria-label={enabled ? "Hide layer" : "Show layer"} title={enabled ? "Hide layer" : "Show layer"} aria-pressed={enabled} onClick={() => useStudio.getState().setLayer(id, layer => { layer.enabled = !enabled; })}>{enabled ? <VisibleIcon size={18} /> : <InvisibleIcon size={18} />}</button>
    </div>
    <div className={styles.layerActions}>
      <button type="button" disabled={index === 0} aria-label="Move layer up" title="Move up" onClick={() => useStudio.getState().reorderLayer(id, -1)}><UpDownSwitchIcon size={16} /></button>
      <button type="button" disabled={index === total - 1} aria-label="Move layer down" title="Move down" onClick={() => useStudio.getState().reorderLayer(id, 1)}><UpDownSwitchIcon size={16} className={styles.downArrow ?? ""} /></button>
      <button type="button" aria-label="Duplicate layer" title="Duplicate" onClick={() => useStudio.getState().duplicateLayer(id)}><DuplicateIcon size={18} /></button>
      <button type="button" aria-label="Remove layer" title="Remove" onClick={remove}><CrossIcon size={16} /></button>
    </div>
  </div>;
}

export function LayerShelf() {
  const root = useRef<HTMLDivElement>(null);
  const role = useStudio(state => state.selection.surface);
  const chosen = useStudio(state => selectedLayer(state)?.id);
  const layers = useStudio(useShallow(state => selectedLayers(state).map(layer => JSON.stringify([layer.id, layer.kind, layer.enabled !== false]))));
  const signature = JSON.stringify(layers);
  useEffect(() => {
    const paint = () => {
      const { draft, selection } = useStudio.getState();
      const scheme = previewScheme(draft, selection.scheme), source = draft.surfaces?.[role], appearance = draft.appearance?.[scheme], override = appearance?.surfaces?.[role];
      const theme = resolve({ ...draft, ...(source === undefined ? {} : { surfaces: { ...draft.surfaces, [role]: visible(source) } }), ...(override === undefined ? {} : { appearance: { ...draft.appearance, [scheme]: { ...appearance, surfaces: { ...appearance?.surfaces, [role]: visible(override) } } } }) }, scheme);
      root.current?.querySelectorAll<HTMLElement>("[data-layer-preview]").forEach(element => {
        const layer = theme.surfaces[role].layers.find(value => value.id === element.dataset.layerPreview);
        element.style.backgroundImage = layer === undefined ? "none" : layerToCss(layer, "all", role);
        element.style.setProperty("--zw-surface-alpha", "1");
        for (const [name, color] of Object.entries(theme.roles)) element.style.setProperty(`--zw-role-${name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`, formatOklch(color));
      });
    };
    paint(); return studioSourceController.subscribe(paint);
  }, [role, signature]);
  return <div ref={root} data-layer-list="" role={layers.length === 0 ? undefined : "list"} aria-label={layers.length === 0 ? undefined : "Surface layers"} className={styles.layerList}>{layers.map((key, index) => { const [id, kind, enabled] = JSON.parse(key) as [string, GradientLayer["kind"], boolean]; return <LayerRow key={id} id={id} kind={kind} enabled={enabled} index={index} total={layers.length} chosen={id === chosen} />; })}{layers.length === 0 && <p className={styles.hint}>This surface has no layers.</p>}</div>;
}
