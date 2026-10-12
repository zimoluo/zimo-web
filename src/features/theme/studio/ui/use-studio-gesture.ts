"use client";

import { useCallback, useEffect, useRef } from "react";
import { useStudio } from "../store";

export function useStudioGesture() {
  const owner = useRef<symbol | null>(null), active = useRef(false);
  if (owner.current === null) owner.current = Symbol("Studio control");
  const begin = useCallback(() => { active.current = true; useStudio.getState().beginGesture(owner.current ?? undefined); }, []);
  const end = useCallback(() => { if (!active.current) return; active.current = false; useStudio.getState().endGesture(owner.current ?? undefined); }, []);
  useEffect(() => end, [end]);
  return { begin, end };
}
