"use client";

import { useEffect } from "react";
import { activeThemeSource, effectiveScheme } from "./active-source";
import { DEFAULT_ROUTE_THEMES, themeStore, useTheme, type ThemeStore } from "../store";
import type { Scheme } from "../model/types";

export const RENDER_COOKIE = "zw.render";

const readSystemScheme = (): Scheme =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export function writeRenderCookie(fields: Readonly<Record<string, string>>): void {
  const current = document.cookie.split("; ").find((cookie) => cookie.startsWith(`${RENDER_COOKIE}=`))?.slice(RENDER_COOKIE.length + 1);
  const next = new URLSearchParams(current ?? "");
  for (const [key, entry] of Object.entries(fields)) next.set(key, entry);
  const value = next.toString();

  document.cookie = `${RENDER_COOKIE}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}

const profileScheme = (state: ThemeStore): Scheme | undefined => {
  const source = state.active.kind === "profile" ? state.profiles[state.active.index] : undefined;
  return source === undefined ? undefined : effectiveScheme(source, state.scheme);
};

export function SchemeHost() {
  useEffect(() => {
    const apply = (): void => {
      const state = themeStore.getState();
      const scheme =
        state.schemePreference === "system" ? readSystemScheme() : state.schemePreference;

      if (scheme !== state.scheme) state.setScheme(scheme);

      const root = document.documentElement;
      const renderedScheme = effectiveScheme(activeThemeSource(), scheme);
      root.dataset.scheme = renderedScheme;
      root.dataset.theme = state.active.kind === "builtIn" ? state.active.id : "profile";

      writeRenderCookie({
        ...Object.fromEntries(Object.keys(DEFAULT_ROUTE_THEMES).map((route) => { const active = state.byRoute[route as keyof typeof DEFAULT_ROUTE_THEMES]; return [`t.${route}`, active?.kind === "builtIn" ? active.id : ""]; })),
        r: state.route,
        t: state.active.kind === "builtIn" ? state.active.id : "profile",
        s: renderedScheme,
      });
    };

    apply();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);

    const unsubscribe = useTheme.subscribe(
      (state) => [state.active, state.schemePreference, state.scheme, state.route, state.byRoute, profileScheme(state)] as const,
      apply,
      { equalityFn: (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] },
    );

    return () => {
      media.removeEventListener("change", apply);
      unsubscribe();
    };
  }, []);

  return null;
}
