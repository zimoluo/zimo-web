"use client";

import { create } from "zustand";
import type { ColorRef } from "../../model/types";

export type ColorMode = "tone" | "role" | "oklch" | "hex" | "eyedropper";
export type ColorTarget = {
  readonly anchor: HTMLElement;
  readonly value: () => ColorRef;
  readonly allow: readonly ColorMode[];
  readonly onChange: (value: ColorRef) => void;
  readonly onBegin?: () => void;
  readonly onCommit?: () => void;
  readonly label: string;
};

export const useColorPicker = create<{ readonly target: ColorTarget | null; readonly open: (target: ColorTarget) => void; readonly close: () => void }>((set, get) => ({
  target: null,
  open: (target) => {
    get().target?.onCommit?.();
    set({ target });
  },
  close: () => {
    get().target?.onCommit?.();
    set({ target: null });
  },
}));
