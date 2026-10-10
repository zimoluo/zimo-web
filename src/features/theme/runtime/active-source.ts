import { getTheme, themeIds, type ThemeId } from "../registry";
import { themeStore } from "../store";
import type { ThemeSource, Scheme } from "../model/types";

export function activeThemeSource(): ThemeSource {
  const state = themeStore.getState();
  if (state.active.kind === "profile") {
    return state.profiles[state.active.index] ?? getTheme("whiteout");
  }
  return getTheme((themeIds as readonly string[]).includes(state.active.id) ? state.active.id as ThemeId : "whiteout");
}

export const effectiveScheme = (source: ThemeSource, scheme: Scheme): Scheme => source.schemes.kind === "single" ? source.schemes.scheme : scheme;
