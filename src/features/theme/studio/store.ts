"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { applyPatches, enablePatches, produceWithPatches, type Draft, type Patch } from "immer";
import type { ThemeSource, Scheme, RoleName, SurfaceRole, GradientLayer, GradientStop, LayerId, ColorRef } from "../model/types";
import { defaultLightRoles, defaultSurfaces } from "../model/defaults";
import { resolve } from "../model/resolve";

enablePatches();

export const newTheme = (id = crypto.randomUUID()): ThemeSource => ({
  formatVersion: 2, id, name: "New theme", ramp: { hue: 260, chroma: 0.5 },
  schemes: { kind: "dual", light: defaultLightRoles, mirrorDark: true, darkReviewed: false },
});

export type StudioSelection = {
  readonly scheme: Scheme;
  readonly role: RoleName | null;
  readonly surface: SurfaceRole;
  readonly layerId: LayerId | null;
  readonly stopIndex: number;
  readonly markRegion: 0 | 1 | 2;
};

type HistoryEntry = { readonly forward: readonly Patch[]; readonly inverse: readonly Patch[] };
export type StudioState = {
  readonly draft: ThemeSource;
  readonly baseline: ThemeSource;
  readonly profileIndex: number | null;
  readonly selection: StudioSelection;
  readonly history: { readonly past: readonly HistoryEntry[]; readonly future: readonly HistoryEntry[] };
  readonly gesturing: boolean;
  readonly pendingEdit: boolean;
};

export type StudioActions = {
  readonly load: (source: ThemeSource, index?: number | null) => void;
  readonly edit: (recipe: (draft: Draft<ThemeSource>) => void) => void;
  readonly select: (patch: Partial<StudioSelection>) => void;
  readonly beginGesture: (owner?: symbol) => void;
  readonly endGesture: (owner?: symbol) => void;
  readonly undo: () => void;
  readonly redo: () => void;
  readonly revert: () => void;
  readonly markSaved: (profileIndex: number) => void;
  readonly setLayer: (id: LayerId, recipe: (layer: Draft<GradientLayer>) => void) => void;
  readonly addLayer: (kind: GradientLayer["kind"]) => void;
  readonly removeLayer: (id: LayerId) => void;
  readonly duplicateLayer: (id: LayerId) => void;
  readonly reorderLayer: (id: LayerId, offset: number) => void;
  readonly setStop: (id: LayerId, index: number, patch: Partial<GradientStop>) => void;
  readonly addStop: (id: LayerId) => void;
  readonly removeStop: (id: LayerId, index: number) => void;
};

export const makeLayer = (kind: GradientLayer["kind"], id = crypto.randomUUID()): GradientLayer => {
  const stops: readonly GradientStop[] = [
    { at: 0, color: { kind: "role", role: "panel" } },
    { at: 100, color: { kind: "role", role: "accent" } },
  ];
  switch (kind) {
    case "linear": return { id, kind, direction: { kind: "angle", deg: 45 }, stops };
    case "radial": return { id, kind, at: { x: 50, y: 50 }, extent: { kind: "ellipse", x: 50, y: 50 }, stops };
    case "conic": return { id, kind, from: 0, at: { x: 50, y: 50 }, stops };
    case "raw": return { id, kind, css: "linear-gradient(45deg, transparent, currentColor)" };
  }
};

export function convertLayer(layer: GradientLayer, kind: GradientLayer["kind"]): GradientLayer {
  if (layer.kind === kind) return layer;
  const base = makeLayer(kind, layer.id);
  const common = {
    ...base,
    ...(layer.enabled === undefined ? {} : { enabled: layer.enabled }),
    ...(layer.interpolation === undefined ? {} : { interpolation: layer.interpolation }),
    ...(layer.alpha === undefined ? {} : { alpha: layer.alpha }),
    ...(layer.variation === undefined ? {} : { variation: layer.variation }),
  };
  return common.kind !== "raw" && layer.kind !== "raw" ? { ...common, stops: layer.stops } : common;
}

export const niceRange = (minimum: number, maximum: number, step = 50): readonly [number, number] => [
  Math.floor(Math.min(0, minimum) / step) * step,
  Math.ceil(Math.max(100, maximum) / step) * step,
];

const seed = newTheme("studio-draft");
const initialSelection: StudioSelection = { scheme: "light", role: null, surface: "widget", layerId: null, stopIndex: 0, markRegion: 0 };
let transaction: { forward: Patch[]; inverse: Patch[]; owner?: symbol } | null = null;

const appearanceScheme = (source: ThemeSource, selected: Scheme): Scheme => source.schemes.kind === "single" ? source.schemes.scheme : selected;

export function selectedSurface(state: StudioState, role = state.selection.surface) {
  const scheme = appearanceScheme(state.draft, state.selection.scheme);
  return state.draft.appearance?.[scheme]?.surfaces?.[role] ?? state.draft.surfaces?.[role] ?? defaultSurfaces[role];
}

export function editableSurface(draft: Draft<ThemeSource>, selection: Pick<StudioSelection, "scheme" | "surface">) {
  const target = draft.appearance?.[appearanceScheme(draft, selection.scheme)] ?? draft;
  target.surfaces ??= {};
  const role = selection.surface;
  target.surfaces[role] ??= JSON.parse(JSON.stringify(draft.surfaces?.[role] ?? defaultSurfaces[role])) as Draft<typeof defaultSurfaces[typeof role]>;
  return target.surfaces[role];
}

export function selectedBackdrop(state: StudioState) {
  return state.draft.appearance?.[appearanceScheme(state.draft, state.selection.scheme)]?.backdrop ?? state.draft.backdrop;
}

export function editableBackdrop(draft: Draft<ThemeSource>, scheme: Scheme) {
  const target = draft.appearance?.[appearanceScheme(draft, scheme)] ?? draft;
  target.backdrop ??= JSON.parse(JSON.stringify(draft.backdrop ?? { scenes: [] })) as Draft<NonNullable<ThemeSource["backdrop"]>>;
  return target.backdrop;
}

export function selectedMark(state: StudioState) {
  return state.draft.appearance?.[appearanceScheme(state.draft, state.selection.scheme)]?.mark ?? state.draft.mark;
}

export function editableMark(draft: Draft<ThemeSource>, scheme: Scheme) {
  const target = draft.appearance?.[appearanceScheme(draft, scheme)] ?? draft;
  target.mark ??= JSON.parse(JSON.stringify(draft.mark ?? { mode: "outline" })) as Draft<NonNullable<ThemeSource["mark"]>>;
  if (target.mark.mode === "split" && target.mark.gradients?.length === 1) {
    const gradient = target.mark.gradients[0];
    target.mark.gradients = [gradient, JSON.parse(JSON.stringify(gradient)) as Draft<typeof gradient>, JSON.parse(JSON.stringify(gradient)) as Draft<typeof gradient>];
  }
  return target.mark;
}

export const useStudio = create<StudioState & StudioActions>()(subscribeWithSelector((set, get) => {
  const surface = (draft: Draft<ThemeSource>) => editableSurface(draft, get().selection);
  const remember = (draft: ThemeSource, entry: HistoryEntry) => set((state) => ({
    draft, history: { past: [...state.history.past.slice(-199), entry], future: [] },
  }));
  return {
    draft: seed, baseline: seed, profileIndex: null, selection: initialSelection,
    history: { past: [], future: [] }, gesturing: false, pendingEdit: false,
    load: (source, index = null) => {
      transaction = null;
      set({ draft: source, baseline: source, profileIndex: index, selection: { ...initialSelection, scheme: source.schemes.kind === "single" ? source.schemes.scheme : source.surfaceScheme ?? "light" },
        history: { past: [], future: [] }, gesturing: false, pendingEdit: false });
    },
    edit: (recipe) => {
      const [next, forward, inverse] = produceWithPatches(get().draft, recipe);
      if (!forward.length) return;
      if (transaction !== null) {
        transaction.forward.push(...forward);
        transaction.inverse.unshift(...inverse);
        set({ draft: next, pendingEdit: true });
      } else remember(next, { forward, inverse });
    },
    select: (patch) => set((state) => ({ selection: { ...state.selection, ...patch } })),
    beginGesture: (owner) => {
      if (transaction !== null && transaction.owner === owner) return;
      if (transaction !== null) get().endGesture();
      transaction = { forward: [], inverse: [], ...(owner === undefined ? {} : { owner }) };
      set({ gesturing: true, pendingEdit: false });
    },
    endGesture: (owner) => {
      if (owner !== undefined && transaction?.owner !== owner) return;
      const finished = transaction;
      transaction = null;
      if (finished !== null && finished.forward.length) remember(get().draft, { forward: finished.forward, inverse: finished.inverse });
      set({ gesturing: false, pendingEdit: false });
    },
    undo: () => {
      get().endGesture();
      const state = get();
      const entry = state.history.past.at(-1);
      if (!entry) return;
      set({ draft: applyPatches(state.draft, entry.inverse), history: {
        past: state.history.past.slice(0, -1), future: [...state.history.future, entry],
      } });
    },
    redo: () => {
      const state = get();
      const entry = state.history.future.at(-1);
      if (!entry) return;
      set({ draft: applyPatches(state.draft, entry.forward), history: {
        past: [...state.history.past, entry], future: state.history.future.slice(0, -1),
      } });
    },
    revert: () => get().load(get().baseline, get().profileIndex),
    markSaved: (profileIndex) => set({ baseline: get().draft, profileIndex }),
    setLayer: (id, recipe) => get().edit((draft) => {
      const layer = surface(draft)?.layers.find((candidate) => candidate.id === id);
      if (layer) recipe(layer);
    }),
    addLayer: (kind) => {
      const layer = makeLayer(kind);
      get().edit((draft) => { surface(draft)?.layers.unshift(layer as Draft<GradientLayer>); });
      get().select({ layerId: layer.id, stopIndex: 0 });
    },
    removeLayer: (id) => {
      const index = selectedLayers(get()).findIndex((layer) => layer.id === id);
      get().edit((draft) => { const value = surface(draft); if (value) value.layers = value.layers.filter((layer) => layer.id !== id); });
      if (get().selection.layerId === id) {
        const remaining = selectedLayers(get());
        get().select({ layerId: remaining[Math.min(index, remaining.length - 1)]?.id ?? null, stopIndex: 0 });
      }
    },
    duplicateLayer: (id) => {
      const nextId = crypto.randomUUID();
      get().edit((draft) => {
        const value = surface(draft);
        const index = value?.layers.findIndex((layer) => layer.id === id) ?? -1;
        const old = value?.layers[index];
        if (value && old) value.layers.splice(index + 1, 0, { ...old, id: nextId });
      });
      get().select({ layerId: nextId });
    },
    reorderLayer: (id, offset) => get().edit((draft) => {
      const value = surface(draft);
      if (!value) return;
      const index = value.layers.findIndex((layer) => layer.id === id);
      const target = Math.max(0, Math.min(value.layers.length - 1, index + offset));
      const old = value.layers[index];
      if (!old || target === index) return;
      value.layers.splice(index, 1);
      value.layers.splice(target, 0, old);
    }),
    setStop: (id, index, patch) => get().setLayer(id, (layer) => {
      if (layer.kind === "raw") return;
      const stop = layer.stops[index];
      if (stop) Object.assign(stop, patch);
    }),
    addStop: (id) => get().setLayer(id, (layer) => {
      if (layer.kind !== "raw") layer.stops.push({ at: 50, color: { kind: "tone", at: 0.5 } });
    }),
    removeStop: (id, index) => get().setLayer(id, (layer) => {
      if (layer.kind !== "raw" && layer.stops.length > 2) layer.stops.splice(index, 1);
    }),
  };
}));

export const studioSourceController = {
  read: () => ({ source: useStudio.getState().draft, scheme: useStudio.getState().selection.scheme }),
  subscribe: (listener: () => void) => useStudio.subscribe(
    (state) => [state.draft, state.selection.scheme] as const, listener,
    { equalityFn: (a, b) => a[0] === b[0] && a[1] === b[1] },
  ),
};

export const selectedLayers = (state: StudioState): readonly GradientLayer[] =>
  selectedSurface(state).layers;
export const selectedLayer = (state: StudioState): GradientLayer | undefined => {
  const layers = selectedLayers(state);
  return layers.find((layer) => layer.id === state.selection.layerId) ?? layers[0];
};
export const colorRefOf = (color: ColorRef): ColorRef => color;

export function insertRampStop(at?: number, lightness?: number): void {
  const current = useStudio.getState().draft.ramp.stops ?? [];
  let chosen = at;
  if (chosen === undefined) {
    const positions = [0, ...current.map((stop) => stop.at), 1]; let width = -1;
    for (let index = 1; index < positions.length; index++) { const lower = positions[index - 1] ?? 0; const upper = positions[index] ?? 1; if (upper - lower > width) { width = upper - lower; chosen = (lower + upper) / 2; } }
  }
  const value = Math.max(0, Math.min(1, chosen ?? .5));
  if (current.some((stop) => Math.abs(stop.at - value) < .001)) return;
  const state = useStudio.getState();
  const theme = resolve(state.draft, appearanceScheme(state.draft, state.selection.scheme));
  const sampled = lightness ?? theme.tone(value).l;
  useStudio.getState().edit((draft) => {
    draft.ramp.stops ??= [];
    if (draft.ramp.stops.length === 0) draft.ramp.stops.push({ at: 0, lightness: theme.tone(0).l }, { at: 1, lightness: theme.tone(1).l });
    const existing = draft.ramp.stops.find((stop) => Math.abs(stop.at - value) < .001);
    if (existing) existing.lightness = sampled;
    else draft.ramp.stops.push({ at: value, lightness: sampled });
    draft.ramp.stops.sort((a, b) => a.at - b.at);
  });
}
