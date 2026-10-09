"use client";

import { definitionLookup, definitionOf, countsTowardLimit } from "./definitions";
import type { KnownWindowId } from "./definitions";
import { useWindows } from "./store";
import type { WindowDefinitionId, WindowId } from "./model";
import { findBySingleton } from "./model";
import { solveDrag } from "./geometry/solve-resize";
import { insetsFrom, viewportOf } from "./viewport";
import { notify } from "../notifications";
import { focusWindowElement } from "./element-registry";
import { useSettings } from "../settings";

export function openWindowDefinition(definitionId: KnownWindowId, props: Readonly<Record<string, unknown>> = {}, center?: { readonly x: number; readonly y: number }): WindowId | null {
  const definition = definitionOf(definitionId);
  if (definition === undefined) return null;
  const validated = definitionLookup.validateProps(definitionId, props);
  if (validated === null) throw new Error(`Invalid props for ${definitionId}`);
  const state = useWindows.getState();
  if (state.minimized) state.minimize(false);
  if (definition.singletonKey !== undefined) {
    const existing = findBySingleton(state, definition.singletonKey);
    if (existing !== undefined) { state.focus(existing); focusWindowElement(existing); return existing; }
  }
  const limit = useSettings.getState().windows.limit;
  if (countsTowardLimit(definitionId) && state.order.filter((id) => countsTowardLimit(state.instances[id]?.definitionId ?? "")).length >= limit) { notify({title:"Windows",body:`The window limit is ${limit}. Close a window or change the limit in Settings.`,icon:"window"}); return null; }
  const size = definition.geometry.defaultSize;
  const viewport = viewportOf({ width: window.innerWidth, height: window.innerHeight }, insetsFrom(document.documentElement));
  const start = { x: (center?.x ?? viewport.width / 2) - size.width / 2, y: (center?.y ?? viewport.height / 2) - size.height / 2, width: Math.min(size.width, viewport.width), height: Math.min(size.height, viewport.height - viewport.insets.top) };
  const rect = solveDrag({ start, delta: { x: 0, y: 0 }, viewport, dragBarHeight: 44 });
  return state.open({ definitionId: definitionId as WindowDefinitionId, props: validated, rect, group: definition.group, singletonKey: definition.singletonKey });
}
