"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { v7 as uuidv7 } from "uuid";
import {
  dismiss,
  dismissAbove,
  dismissAll,
  dismissDesktopOnly,
  dismissTop,
  emptyOverlays,
  findBySingleton,
  present,
} from "./model";
import type {
  Overlay,
  OverlayId,
  OverlayKind,
  OverlaysState,
  Scrim,
} from "./model";

export type PresentRequest = {
  readonly kind: OverlayKind;
  readonly props?: Readonly<Record<string, unknown>> | undefined;
  readonly scrim?: Scrim | undefined;
  readonly singletonKey?: string | undefined;
  readonly expandTo?: string | undefined;
  readonly desktopOnly?: boolean | undefined;
};

export type OverlayActions = {
  readonly present: (request: PresentRequest) => OverlayId;
  readonly dismiss: (id: OverlayId) => void;
  readonly dismissAbove: (id: OverlayId) => void;
  readonly dismissTop: () => void;
  readonly dismissAll: () => void;
  readonly dropDesktopOnly: () => void;
};

export type OverlayStore = OverlaysState & OverlayActions;

export const useOverlays = create<OverlayStore>()(
  subscribeWithSelector((set, get) => ({
    ...emptyOverlays(),

    present: (request) => {
      if (request.singletonKey !== undefined) {
        const existing = findBySingleton(get(), request.singletonKey);
        if (existing !== undefined) { get().dismissAbove(existing); return existing; }
      }
      const id = uuidv7() as OverlayId;

      const overlay: Overlay = {
        id,
        kind: request.kind,
        props: request.props ?? {},
        scrim: request.scrim ?? "dim-blur",
        ...(request.singletonKey === undefined
          ? {}
          : { singletonKey: request.singletonKey }),
        ...(request.expandTo === undefined ? {} : { expandTo: request.expandTo }),
        ...(request.desktopOnly === undefined
          ? {}
          : { desktopOnly: request.desktopOnly }),
      };

      set((state) => present(state, overlay));
      return id;
    },

    dismiss: (id) => {
      set((state) => dismiss(state, id));
    },

    dismissAbove: (id) => {
      set((state) => dismissAbove(state, id));
    },

    dismissTop: () => {
      set(dismissTop);
    },

    dismissAll: () => {
      set(dismissAll);
    },

    dropDesktopOnly: () => {
      set(dismissDesktopOnly);
    },
  })),
);

export const selectOverlayOrder = (state: OverlayStore): readonly OverlayId[] =>
  state.order;

export const selectOverlay =
  (id: OverlayId) =>
  (state: OverlayStore): Overlay | undefined =>
    state.instances[id];

export const overlayStore = {
  getState: () => useOverlays.getState(),
  subscribe: useOverlays.subscribe,
};
