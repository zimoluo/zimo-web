export type OverlayId = string & { readonly __brand: "OverlayId" };

export const OVERLAY_KINDS = [
  "lightbox",
  "album-entry",
  "project-entry",
  "tree-message",
  "tree-confirm",
  "tree-info",
  "studio-presets",
  "studio-settings",
] as const;

export type OverlayKind = (typeof OVERLAY_KINDS)[number];

export type Scrim = "none" | "dim" | "dim-blur";

export type Overlay = {
  readonly id: OverlayId;
  readonly kind: OverlayKind;
  readonly props: Readonly<Record<string, unknown>>;
  readonly scrim: Scrim;
  readonly singletonKey?: string | undefined;
  readonly expandTo?: string | undefined;
  readonly desktopOnly?: boolean | undefined;
};

export type OverlaysState = {
  readonly instances: Readonly<Record<string, Overlay>>;
  readonly order: readonly OverlayId[];
};

export const emptyOverlays = (): OverlaysState => ({ instances: {}, order: [] });

export const topmost = (state: OverlaysState): OverlayId | undefined =>
  state.order[state.order.length - 1];

export const isTopmost = (state: OverlaysState, id: OverlayId): boolean =>
  topmost(state) === id;

export const overlayCount = (state: OverlaysState): number => state.order.length;

export const orderedOverlays = (state: OverlaysState): readonly Overlay[] =>
  state.order
    .map((id) => state.instances[id])
    .filter((overlay): overlay is Overlay => overlay !== undefined);

export function findBySingleton(
  state: OverlaysState,
  key: string,
): OverlayId | undefined {
  return state.order.find((id) => state.instances[id]?.singletonKey === key);
}

export function present(state: OverlaysState, overlay: Overlay): OverlaysState {
  if (overlay.singletonKey !== undefined) {
    const existing = findBySingleton(state, overlay.singletonKey);
    if (existing !== undefined) return dismissAbove(state, existing);
  }

  return {
    instances: { ...state.instances, [overlay.id]: overlay },
    order: [...state.order.filter((id) => id !== overlay.id), overlay.id],
  };
}

export function dismiss(state: OverlaysState, id: OverlayId): OverlaysState {
  if (state.instances[id] === undefined) return state;

  const instances = { ...state.instances };
  delete instances[id];

  return { instances, order: state.order.filter((other) => other !== id) };
}

export function dismissAbove(
  state: OverlaysState,
  id: OverlayId,
): OverlaysState {
  const position = state.order.indexOf(id);
  if (position === -1) return state;
  if (position === state.order.length - 1) return state;

  const kept = state.order.slice(0, position + 1);
  const instances: Record<string, Overlay> = {};
  for (const keptId of kept) {
    const overlay = state.instances[keptId];
    if (overlay !== undefined) instances[keptId] = overlay;
  }

  return { instances, order: kept };
}

export function dismissTop(state: OverlaysState): OverlaysState {
  const top = topmost(state);
  return top === undefined ? state : dismiss(state, top);
}

export function dismissAll(state: OverlaysState): OverlaysState {
  return state.order.length === 0 ? state : emptyOverlays();
}

export function dismissDesktopOnly(state: OverlaysState): OverlaysState {
  const survivors = state.order.filter(
    (id) => state.instances[id]?.desktopOnly !== true,
  );

  if (survivors.length === state.order.length) return state;

  const instances: Record<string, Overlay> = {};
  for (const id of survivors) {
    const overlay = state.instances[id];
    if (overlay !== undefined) instances[id] = overlay;
  }

  return { instances, order: survivors };
}

export function scrimFor(state: OverlaysState, id: OverlayId): Scrim {
  const overlay = state.instances[id];
  if (overlay === undefined || overlay.scrim === "none") return "none";

  const position = state.order.indexOf(id);
  const below = state.order
    .slice(0, position)
    .some((other) => state.instances[other]?.scrim !== "none");

  return below ? "none" : overlay.scrim;
}

export const isOverlayKind = (value: string): value is OverlayKind =>
  (OVERLAY_KINDS as readonly string[]).includes(value);
