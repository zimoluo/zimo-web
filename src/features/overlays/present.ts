"use client";

import { useOverlays } from "./store";
import type { PresentRequest } from "./store";
import { validateOverlayProps } from "./registry";
export function presentOverlay(request: PresentRequest) {
  const props = validateOverlayProps(request.kind, request.props ?? {});
  if (props === null) throw new Error(`Invalid props for ${request.kind}`);
  return useOverlays.getState().present({ ...request, props });
}
