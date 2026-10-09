"use client";

import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { v7 as uuidv7 } from "uuid";
import { createThrottledJsonStorage } from "../../lib/store/throttled-storage";
import type { Rect, Size, Vec2 } from "./geometry/types";
import {
  closeAll,
  closeWindow,
  emptyWindows,
  focusWindow,
  moveWindow,
  openWindow,
  persist as persistWindows,
  setMinimized,
  setTidyTargets,
  updateProps,
} from "./model";
import type {
  PersistedWindow,
  WindowDefinitionId,
  WindowId,
  WindowInstance,
  WindowsState,
} from "./model";
import { restoreLayout } from "./restore";
import { definitionLookup, definitionOf } from "./definitions";
import { findBySingleton } from "./model";
import type { DefinitionLookup } from "./restore";

export type OpenRequest = {
  readonly definitionId: WindowDefinitionId;
  readonly rect: Rect;
  readonly props?: Readonly<Record<string, unknown>> | undefined;
  readonly group?: number | undefined;
  readonly singletonKey?: string | undefined;
};

export type WindowActions = {
  readonly open: (request: OpenRequest) => WindowId;
  readonly close: (id: WindowId) => void;
  readonly closeEverything: () => void;
  readonly focus: (id: WindowId) => void;
  readonly commitRect: (id: WindowId, rect: Rect) => void;
  readonly setProps: (
    id: WindowId,
    props: Readonly<Record<string, unknown>>,
  ) => void;
  readonly minimize: (minimized: boolean) => void;
  readonly setTidy: (targets: Readonly<Record<string, Vec2>> | null) => void;
  readonly hydrate: (
    raw: unknown,
    viewport: Size,
    definitions: DefinitionLookup,
  ) => readonly string[];
};

export type WindowStore = WindowsState & WindowActions;

export type SavedLayout = {
  readonly viewport: Size;
  readonly windows: readonly PersistedWindow[];
};

export const useWindows = create<WindowStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...emptyWindows(),

        open: (request) => {
          if (request.singletonKey !== undefined) {
            const existing = findBySingleton(get(), request.singletonKey);
            if (existing !== undefined) { get().focus(existing); return existing; }
          }
          const id = uuidv7() as WindowId;

          const instance: WindowInstance = {
            id,
            definitionId: request.definitionId,
            props: request.props ?? {},
            rect: request.rect,
            group: request.group ?? 0,
            ...(request.singletonKey === undefined
              ? {}
              : { singletonKey: request.singletonKey }),
          };

          set((state) => openWindow(state, instance));
          return id;
        },

        close: (id) => {
          set((state) => closeWindow(state, id));
        },

        closeEverything: () => {
          set(closeAll);
        },

        focus: (id) => {
          set((state) => focusWindow(state, id));
        },

        commitRect: (id, rect) => {
          set((state) => moveWindow(state, id, rect));
        },

        setProps: (id, props) => {
          set((state) => updateProps(state, id, props));
        },

        minimize: (minimized) => {
          set((state) => setMinimized(state, minimized));
        },

        setTidy: (targets) => {
          set((state) => setTidyTargets(state, targets));
        },

        hydrate: (raw, viewport, definitions) => {
          const result = restoreLayout(raw, viewport, definitions);

          set((state) =>
            result.windows.reduce(
              (next, window) => openWindow(next, { ...window, id: window.id as WindowId, definitionId: window.definitionId as WindowDefinitionId, group: definitionOf(window.definitionId)?.group ?? 0, singletonKey: definitionOf(window.definitionId)?.singletonKey }),
              { ...emptyWindows(), minimized: state.minimized },
            ),
          );

          return result.issues.map((issue) =>
            issue.definitionId === undefined
              ? `#${issue.index}: ${issue.reason}`
              : `#${issue.index} (${issue.definitionId}): ${issue.reason}`,
          );
        },
      }),
      {
        name: "zw.windows",
        version: 1,
        storage: createThrottledJsonStorage<WindowStore>({ delayMs: 500 }),
        skipHydration: true,
        merge: (raw, current) => {
          if (typeof window === "undefined") return current;
          const restored = restoreLayout(raw, { width: window.innerWidth, height: window.innerHeight }, definitionLookup);
          return restored.windows.reduce((state, saved) => {
            const definition = definitionOf(saved.definitionId);
            return { ...state, ...openWindow(state, { ...saved, id: saved.id as WindowId, definitionId: saved.definitionId as WindowDefinitionId, group: definition?.group ?? 0, singletonKey: definition?.singletonKey }) };
          }, current);
        },
        partialize: (state) =>
          ({
            viewport: typeof window === "undefined" ? { width: 1280, height: 800 } : { width: window.innerWidth, height: window.innerHeight },
            windows: persistWindows(state),
            minimized: state.minimized,
          }) as unknown as WindowStore,
      },
    ),
  ),
);

export const selectOrder = (state: WindowStore): readonly WindowId[] =>
  state.order;

export const selectInstance =
  (id: WindowId) =>
  (state: WindowStore): WindowInstance | undefined =>
    state.instances[id];

export const selectMinimized = (state: WindowStore): boolean => state.minimized;

export const windowStore = {
  getState: () => useWindows.getState(),
  subscribe: useWindows.subscribe,
};
