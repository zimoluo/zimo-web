"use client";

import { useEffect, useRef } from "react";
import { applyProperties, compile } from "../compile/compile";
import type { CustomPropertyMap } from "../compile/compile";
import { resolve } from "../model/resolve";
import type { Scheme, ThemeSource } from "../model/types";
import { themeStore, useTheme } from "../store";

const clearOverrides = (
  target: HTMLElement,
  previous: CustomPropertyMap | undefined,
): undefined => {
  if (previous === undefined) return undefined;
  for (const name of previous.keys()) target.style.removeProperty(name);
  return undefined;
};

function activeProfile(): { readonly source: ThemeSource; readonly scheme: Scheme } | null {
  const state = themeStore.getState();
  if (state.active.kind !== "profile") return null;

  const source = state.profiles[state.active.index];
  if (source === undefined) return null;

  return { source, scheme: state.scheme };
}

export function ThemeHost() {
  const previous = useRef<CustomPropertyMap | undefined>(undefined);
  const pending = useRef<number | undefined>(undefined);

  useEffect(() => {
    const root = document.documentElement;

    const apply = (): void => {
      const target = activeProfile();

      if (target === null) {
        previous.current = clearOverrides(root, previous.current);
        return;
      }

      if (pending.current !== undefined) cancelAnimationFrame(pending.current);

      pending.current = requestAnimationFrame(() => {
        pending.current = undefined;
        const next = compile(resolve(target.source, target.scheme));
        previous.current = applyProperties(root, next, previous.current);
      });
    };

    apply();

    const unsubscribe = useTheme.subscribe(
      (state) => [state.active, state.scheme, state.profiles] as const,
      apply,
      { equalityFn: (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2] },
    );

    return () => {
      unsubscribe();
      if (pending.current !== undefined) cancelAnimationFrame(pending.current);
    };
  }, []);

  return null;
}
