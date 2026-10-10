import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { createThrottledJsonStorage } from "../../lib/store/throttled-storage";
import { loadThemeSource } from "./model/schema";
import { themePreferencesSchema, type ThemePreferences } from "./model/preferences";
import { themeIds } from "./registry";
import type { NavigationKey, Scheme, ThemeSource } from "./model/types";

export type ActiveTheme = ThemePreferences["active"];
export type ThemeState = ThemePreferences & { readonly route: NavigationKey };
export type ThemeActions = {
  readonly selectBuiltIn: (id: string) => void;
  readonly selectProfile: (index: number) => void;
  readonly selectRoute: (route: NavigationKey, override?: string) => void;
  readonly selectEverywhere: (active: ActiveTheme) => void;
  readonly setScheme: (scheme: Scheme) => void;
  readonly setSchemePreference: (preference: Scheme | "system") => void;
  readonly setSeasonal: (enabled: boolean) => void;
  readonly setShuffle: (enabled: boolean) => void;
  readonly addProfile: (source: unknown) => { readonly ok: boolean; readonly issues?: readonly string[] };
  readonly replaceProfile: (index: number, source: ThemeSource) => void;
  readonly removeProfile: (index: number) => void;
  readonly moveProfile: (index: number, offset: number) => void;
  readonly restorePreferences: (source: unknown) => boolean;
};
export type ThemeStore = ThemeState & ThemeActions;
export const DEFAULT_THEME_ID = "whiteout";
export const DEFAULT_ROUTE_THEMES: Readonly<Record<NavigationKey, string>> = { home: "whiteout", blog: "blog", photos: "photos", projects: "projects", about: "about", management: "unity", design: "velvet", themeMaker: "penumbra", notebook: "cherry", christmasTree: "christmas" };
const routes = Object.keys(DEFAULT_ROUTE_THEMES) as NavigationKey[];
const initialState: ThemeState = { revision: 0, active: { kind: "builtIn", id: DEFAULT_THEME_ID }, scheme: "light", schemePreference: "system", profiles: [], seasonal: true, shuffle: false, byRoute: {}, route: "home" };
export const themePreferencesOf = (state: ThemeState): ThemePreferences => ({ revision: state.revision, active: state.active, scheme: state.scheme, schemePreference: state.schemePreference, profiles: state.profiles, seasonal: state.seasonal, shuffle: state.shuffle, byRoute: state.byRoute });
export const useTheme = create<ThemeStore>()(subscribeWithSelector(persist((write, get) => {
  const set = (next: Partial<ThemeStore> | ((state: ThemeStore) => Partial<ThemeStore>)) => write((state) => ({ ...(typeof next === "function" ? next(state) : next), revision: state.revision + 1 }));
  const select = (active: ActiveTheme) => set((state) => ({ active, byRoute: { ...state.byRoute, [state.route]: active } }));
  return {
    ...initialState,
    selectBuiltIn: (id) => { if ((themeIds as readonly string[]).includes(id)) select({ kind: "builtIn", id }); },
    selectProfile: (index) => { if (Number.isInteger(index) && index >= 0 && index < get().profiles.length) select({ kind: "profile", index }); },
    selectRoute: (route, override) => {
      const active = override ? { kind: "builtIn" as const, id: override } : get().byRoute[route] ?? { kind: "builtIn" as const, id: DEFAULT_ROUTE_THEMES[route] };
      if (get().route !== route || JSON.stringify(get().active) !== JSON.stringify(active)) set({ route, active });
    },
    selectEverywhere: (active) => { if (active.kind === "profile" && !get().profiles[active.index]) return; if (active.kind === "builtIn" && !(themeIds as readonly string[]).includes(active.id)) return; set({ active, byRoute: Object.fromEntries(routes.map((route) => [route, active])) }); },
    setScheme: (scheme) => { if (scheme !== get().scheme) set({ scheme }); },
    setSchemePreference: (schemePreference) => set({ schemePreference, ...(schemePreference === "system" ? {} : { scheme: schemePreference }) }),
    setSeasonal: (seasonal) => set({ seasonal }),
    setShuffle: (shuffle) => set({ shuffle }),
    addProfile: (source) => { const result = loadThemeSource(source); if (!result.ok) return { ok: false, issues: result.issues }; set((state) => ({ profiles: [...state.profiles, result.theme] })); return { ok: true }; },
    replaceProfile: (index, source) => { const result = loadThemeSource(source); if (!result.ok || !get().profiles[index] || JSON.stringify(get().profiles[index]) === JSON.stringify(result.theme)) return; set((state) => ({ profiles: state.profiles.map((profile, i) => i === index ? result.theme : profile) })); },
    removeProfile: (index) => {
      if (!get().profiles[index]) return;
      const adjust = (active: ActiveTheme): ActiveTheme => active.kind !== "profile" ? active : active.index === index ? { kind: "builtIn", id: DEFAULT_THEME_ID } : { kind: "profile", index: active.index > index ? active.index - 1 : active.index };
      set((state) => ({ profiles: state.profiles.filter((_, i) => i !== index), active: adjust(state.active), byRoute: Object.fromEntries(Object.entries(state.byRoute).map(([key, active]) => [key, adjust(active)])) }));
    },
    moveProfile: (index, offset) => {
      const state = get(); const target = Math.max(0, Math.min(state.profiles.length - 1, index + offset)); const profile = state.profiles[index]; if (!profile || index === target) return;
      const profiles = [...state.profiles]; profiles.splice(index, 1); profiles.splice(target, 0, profile);
      const adjust = (active: ActiveTheme): ActiveTheme => active.kind === "profile" ? { kind: "profile", index: profiles.indexOf(state.profiles[active.index] ?? profile) } : active;
      set({ profiles, active: adjust(state.active), byRoute: Object.fromEntries(Object.entries(state.byRoute).map(([key, active]) => [key, adjust(active)])) });
    },
    restorePreferences: (source) => { const parsed = themePreferencesSchema.safeParse(source); if (!parsed.success) return false; write(parsed.data); return true; },
  };
}, { name: "zw.theme", skipHydration: true, version: 1, storage: createThrottledJsonStorage<ThemeStore>({ delayMs: 300 }), partialize: (state) => themePreferencesOf(state) as ThemeStore, merge: (persisted, current) => { const parsed = themePreferencesSchema.safeParse(persisted); return parsed.success ? { ...current, ...parsed.data } : current; } })));
export const themeStore = { getState: () => useTheme.getState(), subscribe: useTheme.subscribe };
