"use client";

import { useEffect, useRef } from "react";
import { formatOklch } from "../../color";
import { previewScheme } from "../../runtime/active-source";
import { resolve, resolveColorRef, toRampSpec } from "../../model/resolve";
import type { ColorRef } from "../../model/types";
import { useStudio } from "../store";
import { useColorPicker, type ColorMode } from "./store";
import { useStudioGesture } from "../ui/use-studio-gesture";

export function resolveSwatch(value: ColorRef): string {
  const state = useStudio.getState();
  const theme = resolve(state.draft, previewScheme(state.draft, state.selection.scheme));
  return formatOklch(resolveColorRef(value, toRampSpec(state.draft.ramp), theme.roles));
}

export function ColorSwatch({ label, value, onChange, allow = ["tone", "role", "oklch", "hex", "eyedropper"] }: {
  readonly label: string;
  readonly value: () => ColorRef;
  readonly onChange: (value: ColorRef) => void;
  readonly allow?: readonly ColorMode[];
}) {
  const ref = useRef<HTMLButtonElement>(null), gesture = useStudioGesture();
  const expanded = useColorPicker((state) => state.target?.anchor === ref.current);
  useEffect(() => {
    const paint = () => { if (ref.current) ref.current.style.backgroundColor = resolveSwatch(value()); };
    paint();
    return useStudio.subscribe(paint);
  }, [value]);
  return <button type="button" ref={ref} data-color-swatch="" aria-label={label} aria-haspopup="dialog" aria-expanded={expanded} className="size-11 rounded-xl border border-line shadow-xs"
    onClick={() => {
      const anchor = ref.current;
      if (!anchor) return;
      useColorPicker.getState().open({ anchor, owner: gesture.owner, subscribeReset: gesture.subscribeReset, value, allow, onChange, onBegin: gesture.begin, onCommit: gesture.end, label });
      gesture.begin();
    }} />;
}
