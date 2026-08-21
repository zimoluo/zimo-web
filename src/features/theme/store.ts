import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createThrottledJsonStorage } from "../../lib/store/throttled-storage";
import { loadThemeSource } from "./model/schema";
import type { Scheme, ThemeSource } from "./model/types";

export type ActiveTheme =
  | { readonly kind: "builtIn"; readonly id: string }
  | { readonly kind: "profile"; readonly index: number };

export type ThemeState = {
  readonly active: ActiveTheme;
  readonly scheme: Scheme;
  readonly schemePreference: Scheme | "system";
  readonly profiles: readonly ThemeSource[];
  readonly seasonal: boolean;
};

export type ThemeActions = {
  readonly selectBuiltIn: (id: string) => void;
  readonly selectProfile: (index: number) => void;
  readonly setScheme: (scheme: Scheme) => void;
  readonly setSchemePreference: (preference: Scheme | "system") => void;
  readonly setSeasonal: (enabled: boolean) => void;
  readonly addProfile: (source: unknown) => { readonly ok: boolean; readonly issues?: readonly string[] };
  readonly replaceProfile: (index: number, source: ThemeSource) => void;
  readonly removeProfile: (index: number) => void;
};

export type ThemeStore = ThemeState & ThemeActions;

type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> };

export const DEFAULT_THEME_ID = "home";

const initialState: ThemeState = {
  active: { kind: "builtIn", id: DEFAULT_THEME_ID },
  scheme: "light",
  schemePreference: "system",
  profiles: [],
  seasonal: true,
};

export const useTheme = create<ThemeStore>()(
  subscribeWithSelector(
    persist(
      immer((set) => ({
        ...initialState,

        selectBuiltIn: (id) => {
          set((state) => {
            (state as Mutable<ThemeState>).active = { kind: "builtIn", id };
          });
        },

        selectProfile: (index) => {
          set((state) => {
            if (index < 0 || index >= state.profiles.length) return;
            (state as Mutable<ThemeState>).active = { kind: "profile", index };
          });
        },

        setScheme: (scheme) => {
          set((state) => {
            (state as Mutable<ThemeState>).scheme = scheme;
          });
        },

        setSchemePreference: (preference) => {
          set((state) => {
            const target = state as Mutable<ThemeState>;
            target.schemePreference = preference;
            if (preference !== "system") target.scheme = preference;
          });
        },

        setSeasonal: (enabled) => {
          set((state) => {
            (state as Mutable<ThemeState>).seasonal = enabled;
          });
        },

        addProfile: (source) => {
          const result = loadThemeSource(source);
          if (!result.ok) return { ok: false, issues: result.issues };

          set((state) => {
            (state as Mutable<ThemeState>).profiles.push(
              result.theme as unknown as Mutable<ThemeSource>,
            );
          });
          return { ok: true };
        },

        replaceProfile: (index, source) => {
          set((state) => {
            const target = state as Mutable<ThemeState>;
            if (index < 0 || index >= target.profiles.length) return;
            target.profiles[index] = source as unknown as Mutable<ThemeSource>;
          });
        },

        removeProfile: (index) => {
          set((state) => {
            const target = state as Mutable<ThemeState>;
            if (index < 0 || index >= target.profiles.length) return;
            target.profiles.splice(index, 1);
            if (target.active.kind === "profile" && target.active.index >= target.profiles.length) {
              target.active = { kind: "builtIn", id: DEFAULT_THEME_ID };
            }
          });
        },
      })),
      {
        name: "zw.theme",
        version: 1,
        storage: createThrottledJsonStorage<ThemeStore>({ delayMs: 250 }),
        partialize: (state) =>
          ({
            active: state.active,
            scheme: state.scheme,
            schemePreference: state.schemePreference,
            profiles: state.profiles,
            seasonal: state.seasonal,
          }) as unknown as ThemeStore,
      },
    ),
  ),
);

export const themeStore = {
  getState: () => useTheme.getState(),
  subscribe: useTheme.subscribe,
};
