"use client";
import { useCallback, useState } from "react";
import { useDragGesture } from "../../../../lib/gesture/use-drag-gesture";
import type { DragGestureOptions } from "../../../../lib/gesture/use-drag-gesture";
import { subscribeEditBoundary } from "../edit-boundary";

export function useStudioDrag<Context>(options: DragGestureOptions<Context>, owner?: symbol) {
  const [privateOwner] = useState(() => Symbol("Studio drag"));
  const token = owner ?? privateOwner;
  const subscribeCancel = useCallback((cancel: () => void) => subscribeEditBoundary(token, cancel), [token]);
  return useDragGesture({ ...options, subscribeCancel });
}
