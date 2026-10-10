"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import type { Draft } from "immer";
import { useShallow } from "zustand/react/shallow";
import { BackdropStack, getScene, sceneIds, rasterizeMarkSvg } from "../../../backdrop";
import { useStripContribution } from "../../../navigation";
import { notify, notifyError } from "../../../notifications";
import { useSettings } from "../../../settings";
import { applyProperties, compile, type CustomPropertyMap } from "../../compile/compile";
import { apcaLc, contrastRatio, formatOklch } from "../../color";
import { mirrorRoles } from "../../model/mirror";
import { defaultSurfaces } from "../../model/defaults";
import { loadThemeSource } from "../../model/schema";
import { resolve, schemesOf } from "../../model/resolve";
import { ROLE_NAMES, SURFACE_ROLES, type ColorRef, type GradientLayer, type RoleName, type RoleValue, type ThemeSource } from "../../model/types";
import { exportMarkSvg } from "../../mark/export";
import { useDragGesture } from "../../../../lib/gesture/use-drag-gesture";
import { DEFAULT_BACKDROP_PALETTE } from "../../model/defaults";
import { activeThemeSource, previewScheme } from "../../runtime/active-source";
import { ThemeMark } from "../../runtime/ThemeMark";
import { getTheme, listedThemeIds } from "../../registry";
import { useTheme } from "../../store";
import { ColorSwatch } from "../color/ColorSwatch";
import { subscribeProfileAutosave } from "../autosave";
import { useColorPicker } from "../color/store";
import { convertLayer, newTheme, niceRange, selectedLayer, selectedLayers, studioSourceController, useStudio, insertRampStop, type StudioState } from "../store";
import { SchemeEditor } from "./SchemeEditor";
import { RampStrip, RolePositions } from "./RampStrip";
import styles from "./studio.module.css";
import { ProfileShelf, SeedField, ThemeThumbnail, roleLabels } from "./Workbench";

const edit = (recipe: (draft: Draft<ThemeSource>) => void) => useStudio.getState().edit(recipe);
const colorRef = (value: RoleValue): ColorRef => typeof value === "number" ? { kind: "tone", at: value } : value.kind === "alias" ? { kind: "role", role: value.of } : value;
const roleValue = (value: ColorRef): RoleValue => value.kind === "role" ? { kind: "alias", of: value.role } : value;
const rolesFor = (state: StudioState) => state.draft.schemes.kind === "single" ? state.draft.schemes.roles : state.selection.scheme === "dark" ? state.draft.schemes.dark ?? {} : state.draft.schemes.light;
const getRole = (role: RoleName): ColorRef => {
  const state = useStudio.getState(); const schemes = state.draft.schemes;
  const declared = rolesFor(state)[role]; if (declared !== undefined) return colorRef(declared);
  if (schemes.kind === "dual" && state.selection.scheme === "dark") return colorRef((schemes.mirrorDark === false ? schemes.light : mirrorRoles(schemes.light))[role]);
  return { kind: "tone", at: .5 };
};
const setRole = (role: RoleName, value: ColorRef) => edit((draft) => {
  if (draft.schemes.kind === "single") draft.schemes.roles[role] = roleValue(value);
  else if (useStudio.getState().selection.scheme === "light") draft.schemes.light[role] = roleValue(value);
  else { draft.schemes.dark ??= {}; draft.schemes.dark[role] = roleValue(value); }
});
const layerEdit = (recipe: (layer: Draft<GradientLayer>) => void) => {
  const layer = selectedLayer(useStudio.getState()); if (layer) useStudio.getState().setLayer(layer.id, recipe);
};
export function NumberField({ label, select, change, min, max, numberMin, numberMax, range, step = 1 }: {
  readonly label: string; readonly select: (state: StudioState) => number;
  readonly change: (value: number) => void; readonly min: number; readonly max: number; readonly numberMin?: number; readonly numberMax?: number; readonly range?: ((state: StudioState) => readonly [number, number]) | undefined; readonly step?: number;
}) {
  const value = useStudio(select);
  const [rangeMin, rangeMax] = range?.(useStudio.getState()) ?? [min, max];
  const lower = numberMin ?? rangeMin; const upper = numberMax ?? rangeMax;
  return <label className={styles.field}>{label}<span className={styles.numbers}><input aria-label={`${label} slider`} type="range" min={rangeMin} max={rangeMax} step={step} value={value} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); useStudio.getState().beginGesture(); }} onPointerUp={() => useStudio.getState().endGesture()} onPointerCancel={() => useStudio.getState().endGesture()} onBlur={() => useStudio.getState().endGesture()} onChange={(event) => change(Number(event.target.value))} /><input aria-label={label} type="number" min={lower} max={upper} step={step} value={value} onChange={(event) => { const next = Number(event.target.value); if (Number.isFinite(next)) change(Math.max(lower, Math.min(upper, next))); }} /></span></label>;
}
function TextField({ label, select, change }: { readonly label: string; readonly select: (state: StudioState) => string; readonly change: (value: string) => void }) {
  const value = useStudio(select);
  return <label className={styles.field}>{label}<input value={value} onChange={(event) => change(event.target.value)} /></label>;
}
function SelectField({ label, value, options, change }: { readonly label: string; readonly value: string; readonly options: readonly string[]; readonly change: (value: string) => void }) {
  return <label className={styles.field}>{label}<select value={value} onChange={(event) => change(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}
function CheckField({ label, checked, change }: { readonly label: string; readonly checked: boolean; readonly change: (value: boolean) => void }) {
  return <label className={styles.check}><input type="checkbox" checked={checked} onChange={(event) => change(event.target.checked)} />{label}</label>;
}
const section = (title: string, children: ReactNode, key?: string) => <section key={key} className={styles.section}><h2>{title}</h2>{children}</section>;
const advanced = (title: string, children: ReactNode, open?: boolean) => <details className={styles.advanced} open={open}><summary>{title}</summary>{children}</details>;

function RampEditor() {
  const ease = useStudio((state) => state.draft.ramp.ease ?? "default");
  const envelope = useStudio((state) => state.draft.ramp.envelope ?? "flat");
  const stops = useStudio((state) => state.draft.ramp.stops?.length ?? 0);
  return <>{section("Palette", <><SeedField /><div className={styles.seedNumbers}>
    <NumberField label="Hue" select={(state) => state.draft.ramp.hue} change={(hue) => edit((draft) => { draft.ramp.hue = hue; })} min={0} max={360} />
    <NumberField label="Relative chroma" select={(state) => state.draft.ramp.chroma} change={(chroma) => edit((draft) => { draft.ramp.chroma = chroma; })} min={0} max={1} step={0.001} />
    </div><RampStrip /><div className={styles.roles}>{ROLE_NAMES.map((role) => <div key={role}><ColorSwatch label={`${role} role`} value={() => getRole(role)} onChange={(value) => setRole(role, value)} allow={["tone", "oklch", "hex", "eyedropper"]} /><span>{roleLabels[role]}</span></div>)}</div><RolePositions /></>)}{advanced("Curve and stops", <>
    <NumberField label="Hue torsion" select={(state) => state.draft.ramp.torsion ?? 0} change={(torsion) => edit((draft) => { draft.ramp.torsion = torsion; })} min={-180} max={180} />
    <NumberField label="Light endpoint" select={(state) => state.draft.ramp.lightest ?? 0.985} change={(lightest) => edit((draft) => { draft.ramp.lightest = Math.max(lightest, (draft.ramp.darkest ?? 0.165) + .001); const endpoint = draft.ramp.stops?.find((stop) => stop.at === 0 && !stop.literal); if (endpoint) endpoint.lightness = draft.ramp.lightest; })} min={0.01} max={1} step={0.001} />
    <NumberField label="Dark endpoint" select={(state) => state.draft.ramp.darkest ?? 0.165} change={(darkest) => edit((draft) => { draft.ramp.darkest = Math.min(darkest, (draft.ramp.lightest ?? 0.985) - .001); const endpoint = draft.ramp.stops?.find((stop) => stop.at === 1 && !stop.literal); if (endpoint) endpoint.lightness = draft.ramp.darkest; })} min={0} max={0.99} step={0.001} />
    <SelectField label="Lightness curve" value={ease} options={["default", "linear", "contrast", "soft"]} change={(value) => edit((draft) => { if (value === "default" || value === "linear" || value === "contrast" || value === "soft") draft.ramp.ease = value; })} />
    <SelectField label="Chroma envelope" value={envelope} options={["flat", "dusty", "vivid"]} change={(value) => edit((draft) => { if (value === "flat" || value === "dusty" || value === "vivid") draft.ramp.envelope = value; })} />
    {Array.from({ length: stops }, (_, index) => <div key={index} className={styles.row}><NumberField label={`Ramp stop ${index + 1}`} min={0} max={1} range={(state) => [index === 0 ? 0 : (state.draft.ramp.stops?.[index - 1]?.at ?? 0) + .001, state.draft.ramp.stops?.[index + 1] ? (state.draft.ramp.stops[index + 1]?.at ?? 1) - .001 : 1]} step={0.001} select={(state) => state.draft.ramp.stops?.[index]?.at ?? 0} change={(at) => edit((draft) => { const stop = draft.ramp.stops?.[index]; if (stop) stop.at = at; })} /><NumberField label="Lightness" min={0} max={1} step={0.001} select={(state) => state.draft.ramp.stops?.[index]?.lightness ?? 0.5} change={(lightness) => edit((draft) => { const stop = draft.ramp.stops?.[index]; if (stop) stop.lightness = lightness; })} /><NumberField label="Chroma deviation" min={-1} max={1} step={0.01} select={(state) => { const chroma = state.draft.ramp.stops?.[index]?.chroma; return chroma && "delta" in chroma ? chroma.delta : 0; }} change={(delta) => edit((draft) => { const stop = draft.ramp.stops?.[index]; if (stop) { delete stop.literal; stop.chroma = { delta }; } })} /><NumberField label="Hue deviation" min={-180} max={180} select={(state) => { const hue = state.draft.ramp.stops?.[index]?.hue; return hue && "delta" in hue ? hue.delta : 0; }} change={(delta) => edit((draft) => { const stop = draft.ramp.stops?.[index]; if (stop) { delete stop.literal; stop.hue = { delta }; } })} /><ColorSwatch label={`Ramp stop ${index + 1} literal`} allow={["oklch", "hex", "eyedropper"]} value={() => { const stop = useStudio.getState().draft.ramp.stops?.[index]; return stop?.literal ? { kind: "literal", value: stop.literal } : { kind: "tone", at: stop?.at ?? .5 }; }} onChange={(value) => edit((draft) => { const stop = draft.ramp.stops?.[index]; if (stop && value.kind === "literal") stop.literal = value.value; })} /><button type="button" aria-label={`Remove ramp stop ${index + 1}`} onClick={() => edit((draft) => { draft.ramp.stops?.splice(index, 1); })}>×</button></div>)}
    <button type="button" onClick={() => insertRampStop()}>Add ramp stop</button>
  </>, stops > 0)}<SchemeEditor /></>;
}
function StopEditor({ index }: { readonly index: number }) {
  const extended = useSettings((state) => state.studio.extendedStopRange);
  const color = () => { const layer = selectedLayer(useStudio.getState()); return layer && layer.kind !== "raw" ? layer.stops[index]?.color ?? { kind: "tone" as const, at: 0.5 } : { kind: "tone" as const, at: 0.5 }; };
  return <div className={styles.stop}><ColorSwatch label={`Stop ${index + 1} color`} value={color} onChange={(color) => layerEdit((layer) => { if (layer.kind !== "raw" && layer.stops[index]) layer.stops[index].color = color; })} /><NumberField label={`Stop ${index + 1} position`} min={0} max={100} range={extended ? (state) => { const layer = selectedLayer(state); const positions = layer && layer.kind !== "raw" ? layer.stops.map((stop) => stop.at) : [0, 100]; return niceRange(Math.min(...positions), Math.max(...positions)); } : undefined} numberMin={extended ? -300 : 0} numberMax={extended ? 400 : 100} step={0.1} select={(state) => { const layer = selectedLayer(state); return layer && layer.kind !== "raw" ? layer.stops[index]?.at ?? 0 : 0; }} change={(at) => layerEdit((layer) => { if (layer.kind !== "raw" && layer.stops[index]) layer.stops[index].at = at; })} /><NumberField label={`Stop ${index + 1} alpha`} min={0} max={1} step={0.01} select={(state) => { const layer = selectedLayer(state); return layer && layer.kind !== "raw" ? layer.stops[index]?.alpha ?? 1 : 1; }} change={(alpha) => layerEdit((layer) => { if (layer.kind !== "raw" && layer.stops[index]) layer.stops[index].alpha = alpha; })} /><button type="button" aria-label={`Remove stop ${index + 1}`} onClick={() => { const layer = selectedLayer(useStudio.getState()); if (layer) useStudio.getState().removeStop(layer.id, index); }}>×</button></div>;
}
function LayerEditor() {
  const meta = useStudio(useShallow((state) => { const layer = selectedLayer(state); return { id: layer?.id, kind: layer?.kind, length: layer && layer.kind !== "raw" ? layer.stops.length : 0, enabled: layer?.enabled !== false, repeating: layer && layer.kind !== "raw" ? layer.repeating === true : false, space: layer?.interpolation?.space ?? "srgb", hue: layer?.interpolation?.hue ?? "shorter", alpha: layer?.alpha ?? "scaled" }; }));
  const showInterpolation = useSettings((state) => state.studio.showInterpolation);
  if (!meta.id || !meta.kind) return <p>Add a layer to paint this surface.</p>;
  return section("Selected layer", <>
    <SelectField label="Gradient type" value={meta.kind} options={["linear", "radial", "conic", "raw"]} change={(kind) => { if (kind === "linear" || kind === "radial" || kind === "conic" || kind === "raw") edit((draft) => { const state = useStudio.getState(); const layer = selectedLayer(state); if (!layer) return; draft.surfaces ??= {}; const surface = state.selection.surface; draft.surfaces[surface] ??= JSON.parse(JSON.stringify(defaultSurfaces[surface])); const target = draft.surfaces[surface]; if (target) { const index = target.layers.findIndex((candidate) => candidate.id === layer.id); if (index >= 0) target.layers[index] = convertLayer(layer, kind) as Draft<GradientLayer>; } }); }} />
    <CheckField label="Enabled" checked={meta.enabled} change={(enabled) => layerEdit((layer) => { layer.enabled = enabled; })} />
    {meta.kind === "raw" ? <TextField label="CSS background image" select={(state) => { const layer = selectedLayer(state); return layer?.kind === "raw" ? layer.css : ""; }} change={(css) => layerEdit((layer) => { if (layer.kind === "raw") layer.css = css; })} /> : <>
      <CheckField label="Repeating" checked={meta.repeating} change={(repeating) => layerEdit((layer) => { if (layer.kind !== "raw") layer.repeating = repeating; })} />
      {meta.kind === "linear" && <NumberField label="Direction" min={-360} max={360} select={(state) => { const layer = selectedLayer(state); return layer?.kind === "linear" && layer.direction.kind === "angle" ? layer.direction.deg : 0; }} change={(deg) => layerEdit((layer) => { if (layer.kind === "linear") layer.direction = { kind: "angle", deg }; })} />}
      {meta.kind === "conic" && <NumberField label="Starting angle" min={-360} max={360} select={(state) => { const layer = selectedLayer(state); return layer?.kind === "conic" ? layer.from : 0; }} change={(from) => layerEdit((layer) => { if (layer.kind === "conic") layer.from = from; })} />}
      {(meta.kind === "radial" || meta.kind === "conic") && (["x", "y"] as const).map((axis) => <NumberField key={axis} label={`Center ${axis}`} min={-100} max={200} select={(state) => { const layer = selectedLayer(state); return layer?.kind === "radial" || layer?.kind === "conic" ? layer.at[axis] : 50; }} change={(value) => layerEdit((layer) => { if (layer.kind === "radial" || layer.kind === "conic") layer.at[axis] = value; })} />)}
      {meta.kind === "radial" && (["x", "y"] as const).map((axis) => <NumberField key={axis} label={`Radius ${axis}`} min={0.1} max={300} select={(state) => { const layer = selectedLayer(state); return layer?.kind === "radial" && layer.extent.kind === "ellipse" ? layer.extent[axis] : 50; }} change={(value) => layerEdit((layer) => { if (layer.kind === "radial") layer.extent = { kind: "ellipse", x: layer.extent.kind === "ellipse" ? layer.extent.x : 50, y: layer.extent.kind === "ellipse" ? layer.extent.y : 50, [axis]: value }; })} />)}
      <SelectField label="Opacity binding" value={meta.alpha} options={["scaled", "fixed"]} change={(value) => layerEdit((layer) => { if (value === "scaled" || value === "fixed") layer.alpha = value; })} />
      {showInterpolation && <><SelectField label="Interpolation" value={meta.space} options={["srgb", "srgb-linear", "oklab", "oklch", "hsl", "lch", "lab", "display-p3"]} change={(value) => layerEdit((layer) => { layer.interpolation = { space: value as "srgb", hue: meta.hue }; })} /><SelectField label="Hue interpolation" value={meta.hue} options={["shorter", "longer", "increasing", "decreasing"]} change={(value) => layerEdit((layer) => { layer.interpolation = { space: meta.space, hue: value as "shorter" }; })} /></>}
      {Array.from({ length: meta.length }, (_, index) => <StopEditor key={`${meta.id}-${index}`} index={index} />)}
      <button type="button" onClick={() => { if (meta.id) useStudio.getState().addStop(meta.id); }}>Add stop</button>
    </>}
  </>);
}
function LayerRow({ id, kind, chosen }: { readonly id: string; readonly kind: string; readonly chosen: boolean }) {
  const row = useRef<HTMLDivElement>(null);
  const drag = useDragGesture({
    axis: "y",
    onStart: (_pointer, handle) => { const element = row.current; if (!element) return null; return { element, list: handle.closest("[data-layer-list]") }; },
    onMove: (_pointer, context, delta) => { context.element.style.transform = `translateY(${delta.y}px)`; },
    onEnd: (pointer, context) => {
      context.element.style.transform = "";
      const siblings = Array.from(context.list?.querySelectorAll<HTMLElement>("[data-layer-id]") ?? []);
      const original = siblings.findIndex((element) => element.dataset.layerId === id);
      let target = 0;
      for (const element of siblings) { const rect = element.getBoundingClientRect(); if (pointer.clientY > rect.top + rect.height / 2) target++; }
      if (target > original) target--;
      useStudio.getState().reorderLayer(id, target - original);
    },
  });
  return <div ref={row} data-layer-id={id} className={styles.row}><button type="button" style={drag.style} onPointerDown={drag.onPointerDown} aria-label={`Drag ${kind} layer`} onKeyDown={(event) => { if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); useStudio.getState().reorderLayer(id, event.key === "ArrowUp" ? -1 : 1); } }}>↕</button><button type="button" aria-pressed={chosen} onClick={() => useStudio.getState().select({ layerId: id })}>{kind}</button><button type="button" aria-label="Move layer up" onClick={() => useStudio.getState().reorderLayer(id, -1)}>↑</button><button type="button" aria-label="Move layer down" onClick={() => useStudio.getState().reorderLayer(id, 1)}>↓</button><button type="button" aria-label="Duplicate layer" onClick={() => useStudio.getState().duplicateLayer(id)}>⧉</button><button type="button" aria-label="Remove layer" onClick={() => useStudio.getState().removeLayer(id)}>×</button></div>;
}
function SurfaceEditor() {
  const role = useStudio((state) => state.selection.surface);
  const layers = useStudio(useShallow((state) => selectedLayers(state).map((layer) => `${layer.id}|${layer.kind}`)));
  const chosen = useStudio((state) => selectedLayer(state)?.id);
  const surfaceEdit = (recipe: (value: Draft<NonNullable<ThemeSource["surfaces"]>[typeof role]>) => void) => edit((draft) => { draft.surfaces ??= {}; draft.surfaces[role] ??= JSON.parse(JSON.stringify(defaultSurfaces[role])) as Draft<typeof defaultSurfaces[typeof role]>; recipe(draft.surfaces[role]); });
  return <><SelectField label="Surface" value={role} options={SURFACE_ROLES} change={(value) => { const surface = SURFACE_ROLES.find((role) => role === value); if (surface) useStudio.getState().select({ surface, layerId: null }); }} />
    {section("Layers · top to bottom", <><div data-layer-list="" className={styles.layerList}>{layers.map((key) => { const [id = "", kind = "linear"] = key.split("|"); return <LayerRow key={id} id={id} kind={kind} chosen={id === chosen} />; })}</div><button type="button" onClick={() => useStudio.getState().addLayer("linear")}>Add layer</button></>)}
    <LayerEditor />
    {advanced("Lens and variation", <><NumberField label="Surface alpha" min={0} max={1} step={0.01} select={(state) => (state.draft.surfaces?.[role] ?? defaultSurfaces[role]).alpha ?? 1} change={(alpha) => surfaceEdit((value) => { if (value) value.alpha = alpha; })} />{(["blur", "saturate", "brightness"] as const).map((key) => <NumberField key={key} label={key} min={0} max={key === "blur" ? 100 : 3} step={key === "blur" ? 1 : 0.01} select={(state) => (state.draft.surfaces?.[role] ?? defaultSurfaces[role]).lens?.[key] ?? (key === "blur" ? 0 : 1)} change={(next) => surfaceEdit((value) => { if (value) { value.lens ??= {}; value.lens[key] = next; } })} />)}{(["rotate", "shift", "nudge", "count"] as const).map((key) => <NumberField key={key} label={`Variation ${key}`} min={key === "count" ? 1 : -100} max={key === "count" ? 32 : 100} select={(state) => (state.draft.surfaces?.[role] ?? defaultSurfaces[role]).variation?.[key] ?? (key === "count" ? 8 : 0)} change={(next) => surfaceEdit((value) => { if (value) { value.variation ??= {}; value.variation[key] = next; } })} />)}</>)}
  </>;
}
async function downloadMark(kind: "svg" | "png") {
  try {
    const { draft, selection } = useStudio.getState();
    const svg = exportMarkSvg(resolve(draft, previewScheme(draft, selection.scheme)).mark);
    const blob = kind === "png" ? await rasterizeMarkSvg(svg) : new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `${draft.id}-mark.${kind}`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) { notifyError(error instanceof Error ? error.message : "Unable to export the mark"); }
}
function MarkEditor() {
  const mode = useStudio((state) => state.draft.mark?.mode ?? "outline");
  const sceneId = useStudio((state) => state.draft.mark?.sceneId ?? "gallery");
  const region = useStudio((state) => state.selection.markRegion);
  const stops = useStudio((state) => state.draft.mark?.gradients?.[region]?.stops.length ?? 0);
  const ensure = (draft: Draft<ThemeSource>) => { draft.mark ??= { mode: "outline" }; return draft.mark; };
  return <>{section("Identity mark", <><SelectField label="Mark mode" value={mode} options={["outline", "unified", "split", "backdrop", "scene"]} change={(value) => edit((draft) => { const mark = ensure(draft); if (value === "outline" || value === "unified" || value === "split" || value === "backdrop" || value === "scene") { mark.mode = value; if (value !== "split") useStudio.getState().select({ markRegion: 0 }); if (value === "scene") mark.sceneId ??= "gallery"; if (value === "split" || value === "unified") { const gradient = mark.gradients?.[0] ?? { angle: 0, stops: [{ offset: 0, color: { kind: "tone" as const, at: 0.25 } }, { offset: 1, color: { kind: "tone" as const, at: 0.75 } }] }; mark.gradients = value === "split" ? [gradient, JSON.parse(JSON.stringify(gradient)), JSON.parse(JSON.stringify(gradient))] : [gradient]; } } })} /><div className={styles.row}>Stroke<ColorSwatch label="Mark stroke" value={() => useStudio.getState().draft.mark?.stroke ?? { kind: "role", role: "brand" }} onChange={(value) => edit((draft) => { ensure(draft).stroke = value; })} /></div>
    {mode === "scene" && <SelectField label="Mark scene" value={sceneId} options={["gallery", "gallery-3d"]} change={(value) => edit((draft) => { ensure(draft).sceneId = value; })} />}
    {mode === "split" && <SelectField label="Region" value={String(region)} options={["0", "1", "2"]} change={(value) => useStudio.getState().select({ markRegion: Number(value) as 0 | 1 | 2 })} />}
    {(mode === "split" || mode === "unified") && <><NumberField label="Mark gradient angle" min={-360} max={360} select={(state) => state.draft.mark?.gradients?.[region]?.angle ?? 0} change={(angle) => edit((draft) => { const gradient = draft.mark?.gradients?.[region]; if (gradient) gradient.angle = angle; })} />{Array.from({ length: stops }, (_, index) => <div className={styles.row} key={index}><ColorSwatch label={`Mark stop ${index + 1}`} allow={["oklch", "hex", "eyedropper"]} value={() => useStudio.getState().draft.mark?.gradients?.[region]?.stops[index]?.color ?? { kind: "tone", at: 0.5 }} onChange={(value) => edit((draft) => { const stop = draft.mark?.gradients?.[region]?.stops[index]; if (stop) stop.color = value; })} /><NumberField label={`Mark offset ${index + 1}`} min={0} max={1} step={0.01} select={(state) => state.draft.mark?.gradients?.[region]?.stops[index]?.offset ?? 0} change={(offset) => edit((draft) => { const stop = draft.mark?.gradients?.[region]?.stops[index]; if (stop) stop.offset = offset; })} /><button type="button" aria-label="Remove mark stop" onClick={() => edit((draft) => { const gradient = draft.mark?.gradients?.[region]; if (gradient && gradient.stops.length > 2) gradient.stops.splice(index, 1); })}>×</button></div>)}<button type="button" onClick={() => edit((draft) => { draft.mark?.gradients?.[region]?.stops.push({ offset: 0.5, color: { kind: "role", role: "accent" } }); })}>Add mark stop</button></>}<div className={styles.row}><button type="button" onClick={() => void downloadMark("svg")}>Export SVG</button><button type="button" onClick={() => void downloadMark("png")}>Export PNG</button></div>
  </>)}</>;
}
function SceneParams({ index, id }: { readonly index: number; readonly id: string }) {
  const scene = getScene(id); if (!scene) return null;
  return <>{Object.entries(scene.params).map(([name, spec]) => spec.kind === "number" ? <NumberField key={name} label={spec.label} min={spec.min} max={spec.max} step={spec.step ?? 1} select={(state) => Number(state.draft.backdrop?.scenes[index]?.params?.[name] ?? spec.default)} change={(value) => edit((draft) => { const ref = draft.backdrop?.scenes[index]; if (ref) { ref.params ??= {}; ref.params[name] = value; } })} /> : <SceneOption key={name} index={index} name={name} spec={spec} />)}</>;
}
function SceneOption({ index, name, spec }: { readonly index: number; readonly name: string; readonly spec: Exclude<import("../../../backdrop").SceneParamSpec, { kind: "number" }> }) {
  const value = useStudio((state) => state.draft.backdrop?.scenes[index]?.params?.[name] ?? spec.default);
  const change = (value: string | boolean) => edit((draft) => { const ref = draft.backdrop?.scenes[index]; if (ref) { ref.params ??= {}; ref.params[name] = value; } });
  return spec.kind === "boolean" ? <CheckField label={spec.label} checked={Boolean(value)} change={change} /> : <SelectField label={spec.label} value={String(value)} options={spec.options} change={change} />;
}
function BackdropEditor() {
  const ids = useStudio(useShallow((state) => state.draft.backdrop?.scenes.map((scene) => scene.id) ?? []));
  const [chosen, setChosen] = useState<string>(sceneIds[0] ?? "home");
  return <>{ids.map((id, index) => section(getScene(id)?.name ?? id, <div key={`${id}-${index}`}><SceneParams index={index} id={id} />{Object.entries(DEFAULT_BACKDROP_PALETTE).map(([name, fallback]) => <div key={name} className={styles.row}><span>{name}</span><ColorSwatch label={`${id} ${name} color`} value={() => useStudio.getState().draft.backdrop?.scenes[index]?.palette?.[name] ?? fallback} onChange={(value) => edit((draft) => { const scene = draft.backdrop?.scenes[index]; if (scene) { scene.palette ??= {}; scene.palette[name] = value; } })} /><button type="button" aria-label={`Reset ${id} ${name} color`} onClick={() => edit((draft) => { const scene = draft.backdrop?.scenes[index]; if (scene?.palette) delete scene.palette[name]; })}>Reset</button></div>)}<button type="button" onClick={() => edit((draft) => { draft.backdrop?.scenes.splice(index, 1); })}>Remove scene</button></div>, `${id}-${index}`))}<SelectField label="Backdrop scene" value={chosen} options={sceneIds} change={setChosen} /><button type="button" onClick={() => edit((draft) => { draft.backdrop ??= { scenes: [] }; draft.backdrop.scenes.push({ id: chosen }); })}>Add scene</button></>;
}
const pairs = [["text", "panel"], ["textMuted", "panel"], ["accent", "panel"], ["brand", "panel"], ["text", "fill"], ["line", "panel"]] as const;
function Preview() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let previous: CustomPropertyMap | undefined; let frame: number | undefined;
    const paint = () => { if (frame !== undefined) cancelAnimationFrame(frame); frame = requestAnimationFrame(() => {
      frame = undefined; const element = ref.current; if (!element) return;
      const state = useStudio.getState(); const theme = resolve(state.draft, previewScheme(state.draft, state.selection.scheme));
      previous = applyProperties(element, compile(theme), previous);
      element.querySelectorAll<HTMLElement>("[data-tone]").forEach((swatch) => { swatch.style.background = formatOklch(theme.tone(Number(swatch.dataset.tone))); });
      element.querySelectorAll<HTMLElement>("[data-contrast]").forEach((row, index) => { const pair = pairs[index]; if (!pair) return; const ratio = contrastRatio(theme.roles[pair[0]], theme.roles[pair[1]]); row.textContent = `${pair.join(" / ")}: ${ratio.toFixed(2)}:1 · APCA ${apcaLc(theme.roles[pair[0]], theme.roles[pair[1]]).toFixed(1)} · ${ratio >= 4.5 ? ratio >= 7 ? "AAA" : "AA" : ratio >= 3 ? "large text only" : "low contrast"}`; });
    }); };
    paint(); const unsubscribe = studioSourceController.subscribe(paint);
    return () => { unsubscribe(); if (frame !== undefined) cancelAnimationFrame(frame); };
  }, []);
  return <div ref={ref} className={styles.preview} aria-label="Theme preview"><div className={styles.previewScene}><BackdropStack sourceController={studioSourceController} /><div className={styles.previewContent}><ThemeMark className={styles.previewMark ?? ""} controller={studioSourceController} /><h2>Zimo Web</h2><p className={styles.previewSubtitle}>A place for work, thoughts, and small discoveries.</p><div className={`surface-widget surface-edge ${styles.previewCard}`}><h3>Hello there!</h3><p>A theme carries the same colors through text, windows, and the world behind them.</p><div className={styles.previewActions}><span className="surface-raised surface-edge">Explore</span><span className="surface-sunken">Notebook</span></div><div className={`surface-nested ${styles.previewInset}`}><strong>Something to remember</strong><p>Quiet details make room for the things that matter.</p></div></div></div></div><div className={styles.ramp} role="group" aria-label="Tone ramp">{Array.from({ length: 21 }, (_, index) => <span key={index} data-tone={index / 20} />)}</div><details className={styles.contrast}><summary>Contrast checks</summary>{pairs.map((pair) => <p key={pair.join("-")} data-contrast="" />)}</details></div>;
}
function ProfileActions() {
  const profiles = useTheme((state) => state.profiles);
  const [builtIn, setBuiltIn] = useState<string>("home");
  const input = useRef<HTMLInputElement>(null);
  return section("Profiles", <><div className={styles.builtinGrid} role="group" aria-label="Built-in themes">{listedThemeIds.map((id) => <button key={id} type="button" aria-label={`Start from ${getTheme(id).name}`} onClick={() => useStudio.getState().load({ ...getTheme(id), id: crypto.randomUUID(), hidden: false })}><ThemeThumbnail source={getTheme(id)} /><span>{getTheme(id).name}</span></button>)}</div><SelectField label="Start from a theme" value={builtIn} options={listedThemeIds} change={setBuiltIn} /><button type="button" onClick={() => { const id = listedThemeIds.find((id) => id === builtIn); if (id) useStudio.getState().load({ ...getTheme(id), id: crypto.randomUUID(), hidden: false }); }}>Use as starting point</button><button type="button" onClick={() => useStudio.getState().load(newTheme())}>New theme</button><div className={styles.layerList}>{profiles.map((profile, index) => <div className={styles.profileRow} key={`${profile.id}-${index}`}><ThemeThumbnail source={profile} /><button type="button" onClick={() => useStudio.getState().load(profile, index)}>{profile.name}</button><button type="button" aria-label={`Duplicate ${profile.name}`} onClick={() => { useTheme.getState().addProfile({ ...profile, id: crypto.randomUUID(), name: `${profile.name} copy` }); }}>⧉</button><button type="button" aria-label={`Move ${profile.name} up`} onClick={() => { useTheme.getState().moveProfile(index, -1); const current = useStudio.getState(); if (current.profileIndex !== null) { const selected = useTheme.getState().profiles.findIndex((profile) => profile.id === current.draft.id); if (selected >= 0) current.markSaved(selected); } }}>↑</button><button type="button" aria-label={`Delete ${profile.name}`} onClick={() => { useTheme.getState().removeProfile(index); const current = useStudio.getState(); if (current.profileIndex === index) current.load(current.draft); else if (current.profileIndex !== null && current.profileIndex > index) current.markSaved(current.profileIndex - 1); }}>×</button></div>)}</div><input ref={input} type="file" accept="application/json,.json" hidden onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; try { const result = loadThemeSource(JSON.parse(await file.text())); if (!result.ok) throw new Error(result.issues.join("\n")); useStudio.getState().load(result.theme); notify({ title: "Theme imported", icon: "studio" }); } catch (error) { notifyError(error instanceof Error ? error.message : "Unable to import theme"); } event.target.value = ""; }} /><button type="button" onClick={() => input.current?.click()}>Import theme</button><label className="flex min-h-11 cursor-pointer items-center rounded-lg bg-fill px-3">Seed from image<input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; const form = new FormData(); form.set("file", file); try { const response = await fetch("/api/v1/tools/image-palette", { method: "POST", body: form }); const data: unknown = await response.json(); if (!response.ok || typeof data !== "object" || data === null || !("theme" in data)) throw new Error("Unable to analyze the image."); const result = loadThemeSource(data.theme); if (!result.ok) throw new Error(result.issues.join("; ")); useStudio.getState().load(result.theme); } catch (error) { notifyError(error instanceof Error ? error.message : "Unable to analyze image"); } event.target.value = ""; }} /></label><button type="button" onClick={() => { const source = useStudio.getState().draft; const blob = new Blob([JSON.stringify(source, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `${source.id}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }}>Export theme</button></>);
}
function Toolbar() {
  const past = useStudio((state) => state.history.past.length);
  const future = useStudio((state) => state.history.future.length);
  const scheme = useStudio((state) => state.selection.scheme);
  const singleScheme = useStudio((state) => state.draft.schemes.kind === "single" ? state.draft.schemes.scheme : null);
  return <div className={styles.toolbar}><button type="button" aria-label="Undo" title="Undo · ⌘Z" disabled={!past} onClick={() => useStudio.getState().undo()}><span aria-hidden="true">↶</span></button><button type="button" aria-label="Redo" title="Redo · ⇧⌘Z" disabled={!future} onClick={() => useStudio.getState().redo()}><span aria-hidden="true">↷</span></button><button type="button" onClick={() => useStudio.getState().revert()}>Revert</button><select aria-label="Preview scheme" value={singleScheme ?? scheme} onChange={(event) => { const value = event.target.value; if (value === "dark" || value === "light") useStudio.getState().select({ scheme: value }); }}>{singleScheme !== "dark" && <option value="light">Light</option>}{singleScheme !== "light" && <option value="dark">Dark</option>}</select><button type="button" onClick={() => {
    useColorPicker.getState().close(); const state = useStudio.getState(); const result = loadThemeSource(state.draft); if (!result.ok) { notify({ title: "Theme needs attention", body: result.issues.join("; "), tone: "danger" }); return; }
    let index = state.profileIndex; if (index === null) { index = useTheme.getState().profiles.length; useTheme.getState().addProfile(result.theme); } else useTheme.getState().replaceProfile(index, result.theme);
    useStudio.getState().markSaved(index); useTheme.getState().selectProfile(index); notify({ title: "Theme applied", icon: "studio", duration: 2000 });
  }} className={styles.apply}>Save and apply</button></div>;
}
export function StudioRoot() {
  const [panel, setPanel] = useState("Color");
  const id = useId();
  const panels = ["Color", "Surfaces", "Mark", "Motion", "Profiles"];
  const themeName = useStudio((state) => state.draft.name);
  useStripContribution(useMemo(() => ({ id: "studio-editing", priority: 60, label: `${themeName} · editing` }), [themeName]));
  useEffect(() => {
    const theme = useTheme.getState(); useStudio.getState().load(activeThemeSource(), theme.active.kind === "profile" ? theme.active.index : null);
    useStudio.getState().select({ scheme: schemesOf(activeThemeSource()).includes(theme.scheme) ? theme.scheme : schemesOf(activeThemeSource())[0] ?? "light" });
    const keydown = (event: KeyboardEvent) => { if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") return; event.preventDefault(); if (event.shiftKey) useStudio.getState().redo(); else useStudio.getState().undo(); };
    window.addEventListener("keydown", keydown);
    const save = subscribeProfileAutosave();
    return () => { window.removeEventListener("keydown", keydown); useColorPicker.getState().close(); save(); };
  }, []);
  return <div data-backdrop-focus-scope="" className={`${styles.studio} surface-widget surface-widget-90 surface-edge`}><header className={styles.header}><div className={styles.identity}><h1>Theme Studio</h1><TextField label="Theme name" select={(state) => state.draft.name} change={(name) => edit((draft) => { draft.name = name; })} /></div><Toolbar /></header><div className={styles.body}><aside className={styles.editor}><ProfileShelf /><div className={styles.tabs} role="tablist" aria-label="Theme controls" onKeyDown={(event) => { const index = panels.indexOf(panel); const next = event.key === "ArrowRight" ? (index + 1) % panels.length : event.key === "ArrowLeft" ? (index + panels.length - 1) % panels.length : event.key === "Home" ? 0 : event.key === "End" ? panels.length - 1 : null; const chosen = next === null ? undefined : panels[next]; if (chosen) { event.preventDefault(); setPanel(chosen); event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")[next ?? 0]?.focus(); } }}>{panels.map((name) => <button key={name} id={`${id}-${name}`} type="button" role="tab" tabIndex={name === panel ? 0 : -1} aria-controls={`${id}-panel`} aria-selected={name === panel} onClick={() => setPanel(name)}>{name}</button>)}</div><div id={`${id}-panel`} role="tabpanel" aria-label={panel} aria-labelledby={`${id}-${panel}`} className={styles.panel}>{panel === "Color" ? <RampEditor /> : panel === "Surfaces" ? <SurfaceEditor /> : panel === "Mark" ? <MarkEditor /> : panel === "Motion" ? <BackdropEditor /> : <ProfileActions />}</div></aside><Preview /></div></div>;
}
