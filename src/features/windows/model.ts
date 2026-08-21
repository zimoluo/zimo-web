import type { Rect, Vec2 } from "./geometry/types";

export type WindowId = string & { readonly __brand: "WindowId" };

export type WindowDefinitionId = string & {
  readonly __brand: "WindowDefinitionId";
};

export type WindowInstance = {
  readonly id: WindowId;
  readonly definitionId: WindowDefinitionId;
  readonly props: Readonly<Record<string, unknown>>;
  readonly rect: Rect;
  readonly group: number;
  readonly singletonKey?: string | undefined;
};

export type WindowsState = {
  readonly instances: Readonly<Record<string, WindowInstance>>;
  readonly order: readonly WindowId[];
  readonly minimized: boolean;
  readonly tidyTarget: Readonly<Record<string, Vec2>> | null;
};

export const GROUP_STRIDE = 1000;

export const emptyWindows = (): WindowsState => ({
  instances: {},
  order: [],
  minimized: false,
  tidyTarget: null,
});

export const windowCount = (state: WindowsState): number => state.order.length;

export const instanceOf = (
  state: WindowsState,
  id: WindowId,
): WindowInstance | undefined => state.instances[id];

export const frontmost = (state: WindowsState): WindowId | undefined =>
  state.order[state.order.length - 1];

export function zIndexOf(state: WindowsState, id: WindowId): number {
  const position = state.order.indexOf(id);
  if (position === -1) return 0;
  const instance = state.instances[id];
  return (instance?.group ?? 0) * GROUP_STRIDE + position;
}

export const orderedInstances = (
  state: WindowsState,
): readonly WindowInstance[] =>
  state.order
    .map((id) => state.instances[id])
    .filter((instance): instance is WindowInstance => instance !== undefined);

export function findBySingleton(
  state: WindowsState,
  key: string,
): WindowId | undefined {
  return state.order.find(
    (id) => state.instances[id]?.singletonKey === key,
  );
}

export function openWindow(
  state: WindowsState,
  instance: WindowInstance,
): WindowsState {
  if (instance.singletonKey !== undefined) {
    const existing = findBySingleton(state, instance.singletonKey);
    if (existing !== undefined) return focusWindow(state, existing);
  }

  return {
    ...state,
    instances: { ...state.instances, [instance.id]: instance },
    order: [...state.order.filter((id) => id !== instance.id), instance.id],
    minimized: false,
    tidyTarget: null,
  };
}

export function closeWindow(state: WindowsState, id: WindowId): WindowsState {
  if (state.instances[id] === undefined) return state;

  const instances = { ...state.instances };
  delete instances[id];

  const tidyTarget = dropTidyTarget(state.tidyTarget, id);

  return {
    ...state,
    instances,
    order: state.order.filter((other) => other !== id),
    ...(tidyTarget === undefined ? {} : { tidyTarget }),
  };
}

const dropTidyTarget = (
  targets: WindowsState["tidyTarget"],
  id: WindowId,
): WindowsState["tidyTarget"] | undefined => {
  if (targets === null || targets[id] === undefined) return undefined;
  const next = { ...targets };
  delete next[id];
  return Object.keys(next).length === 0 ? null : next;
};

export function focusWindow(state: WindowsState, id: WindowId): WindowsState {
  if (state.instances[id] === undefined) return state;
  if (frontmost(state) === id && !state.minimized) return state;

  return {
    ...state,
    order: [...state.order.filter((other) => other !== id), id],
    minimized: false,
  };
}

export function moveWindow(
  state: WindowsState,
  id: WindowId,
  rect: Rect,
): WindowsState {
  const instance = state.instances[id];
  if (instance === undefined) return state;

  const same =
    instance.rect.x === rect.x &&
    instance.rect.y === rect.y &&
    instance.rect.width === rect.width &&
    instance.rect.height === rect.height;

  if (same) return state;

  return {
    ...state,
    instances: { ...state.instances, [id]: { ...instance, rect } },
  };
}

export function updateProps(
  state: WindowsState,
  id: WindowId,
  props: Readonly<Record<string, unknown>>,
): WindowsState {
  const instance = state.instances[id];
  if (instance === undefined) return state;

  return {
    ...state,
    instances: { ...state.instances, [id]: { ...instance, props } },
  };
}

export const setMinimized = (
  state: WindowsState,
  minimized: boolean,
): WindowsState =>
  state.minimized === minimized ? state : { ...state, minimized };

export const setTidyTargets = (
  state: WindowsState,
  tidyTarget: Readonly<Record<string, Vec2>> | null,
): WindowsState => ({ ...state, tidyTarget });

export function closeAll(state: WindowsState): WindowsState {
  return state.order.length === 0
    ? state
    : { ...state, instances: {}, order: [], tidyTarget: null };
}

export type PersistedWindow = {
  readonly id: string;
  readonly definitionId: string;
  readonly props: Readonly<Record<string, unknown>>;
  readonly rect: Rect;
  readonly group: number;
};

export const PERSISTED_FIELDS = [
  "id",
  "definitionId",
  "props",
  "rect",
  "group",
] as const;

export const toPersisted = (instance: WindowInstance): PersistedWindow => ({
  id: instance.id,
  definitionId: instance.definitionId,
  props: instance.props,
  rect: instance.rect,
  group: instance.group,
});

export const persist = (
  state: WindowsState,
): readonly PersistedWindow[] =>
  orderedInstances(state).map(toPersisted);
