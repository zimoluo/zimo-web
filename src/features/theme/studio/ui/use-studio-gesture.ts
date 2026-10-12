"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStudio } from "../store";
import { subscribeEditBoundary } from "../edit-boundary";

export function useStudioGesture() {
  const [owner] = useState(() => Symbol("Studio control")), active = useRef(false);
  const begin = useCallback(() => { useStudio.getState().beginGesture(owner); active.current = true; }, [owner]);
  const end = useCallback(() => { if (!active.current) return; active.current = false; useStudio.getState().endGesture(owner); }, [owner]);
  const subscribeReset = useCallback((reset: () => void) => subscribeEditBoundary(owner, reset), [owner]);
  useEffect(() => subscribeReset(end), [subscribeReset, end]);
  useEffect(() => end, [end]);
  return { owner, begin, end, subscribeReset };
}
