"use client";

import { useEffect, useRef } from "react";
import { formatOklch } from "../../color";
import { effectiveScheme } from "../../runtime/active-source";
import { resolve, resolveColorRef, toRampSpec } from "../../model/resolve";
import type { ColorRef } from "../../model/types";
import { useStudio } from "../store";
import { useColorPicker, type ColorMode } from "./store";

export function resolveSwatch(value: ColorRef): string {
  const state = useStudio.getState();
  const theme = resolve(state.draft, effectiveScheme(state.draft, state.selection.scheme));
  return formatOklch(resolveColorRef(value, toRampSpec(state.draft.ramp), theme.roles));
}

export function ColorSwatch({ label, value, onChange, allow = ["tone", "role", "oklch", "hex", "eyedropper"] }: {
  readonly label: string;
  readonly value: () => ColorRef;
  readonly onChange: (value: ColorRef) => void;
  readonly allow?: readonly ColorMode[];
}) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const paint = () => { if (ref.current) ref.current.style.backgroundColor = resolveSwatch(value()); };
    paint();
    return useStudio.subscribe(paint);
  }, [value]);
  return <button type="button" ref={ref} aria-label={label} className="size-11 rounded-xl border border-line shadow-xs"
    onClick={() => {
      const anchor = ref.current;
      if (!anchor) return;
      useColorPicker.getState().open({ anchor, value, allow, onChange, onCommit: () => useStudio.getState().endGesture(), label });
      useStudio.getState().beginGesture();
    }} />;
}
