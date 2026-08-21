"use client";

import { useEffect } from "react";
import { themeStore, useTheme } from "../store";
import type { Scheme } from "../model/types";

export const RENDER_COOKIE = "zw.render";

const readSystemScheme = (): Scheme =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export function writeRenderCookie(fields: Readonly<Record<string, string>>): void {
  const value = Object.entries(fields)
    .map(([key, entry]) => `${key}=${encodeURIComponent(entry)}`)
    .join("&");

  document.cookie = `${RENDER_COOKIE}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}

export function SchemeHost() {
  useEffect(() => {
    const apply = (): void => {
      const state = themeStore.getState();
      const scheme =
        state.schemePreference === "system" ? readSystemScheme() : state.schemePreference;

      if (scheme !== state.scheme) state.setScheme(scheme);

      const root = document.documentElement;
      root.dataset.scheme = scheme;
      if (state.active.kind === "builtIn") root.dataset.theme = state.active.id;

      writeRenderCookie({
        t: state.active.kind === "builtIn" ? state.active.id : "profile",
        s: scheme,
      });
    };

    apply();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);

    const unsubscribe = useTheme.subscribe(
      (state) => [state.active, state.schemePreference, state.scheme] as const,
      apply,
      { equalityFn: (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2] },
    );

    return () => {
      media.removeEventListener("change", apply);
      unsubscribe();
    };
  }, []);

  return null;
}
