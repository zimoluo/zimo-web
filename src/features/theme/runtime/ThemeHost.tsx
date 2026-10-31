"use client";

import { useEffect, useRef } from "react";
import { applyProperties, compile } from "../compile/compile";
import type { CustomPropertyMap } from "../compile/compile";
import { resolve } from "../model/resolve";
import type { Scheme, ThemeSource } from "../model/types";
import { formatHex } from "../color";
import { activeThemeSource, effectiveScheme } from "./active-source";
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
  const painted = useRef<string | undefined>(undefined);

  useEffect(() => {
    const root = document.documentElement;

    const apply = (): void => {
      if (pending.current !== undefined) { cancelAnimationFrame(pending.current); pending.current = undefined; }
      const target = activeProfile();
      const source = activeThemeSource();
      const resolved = resolve(source, effectiveScheme(source, themeStore.getState().scheme));
      const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (meta) meta.content = formatHex(resolved.roles.brand);

      if (target === null) {
        previous.current = clearOverrides(root, previous.current);
        painted.current = undefined;
        document.body.style.color = formatHex(resolved.roles.text);
        return;
      }

      const scheme = effectiveScheme(target.source, target.scheme);
      const active = themeStore.getState().active;
      const identity = `${active.kind === "profile" ? active.index : ""}:${target.source.id}:${scheme}`;
      const paint = () => {
        pending.current = undefined;
        const theme = resolve(target.source, scheme);
        previous.current = applyProperties(root, compile(theme), previous.current);
        painted.current = identity;
        document.body.style.color = formatHex(theme.roles.text);
      };
      if (previous.current === undefined || painted.current !== identity) paint();
      else pending.current = requestAnimationFrame(paint);
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
