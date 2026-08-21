import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createThrottledJsonStorage } from "../../lib/store/throttled-storage";
import { SETTINGS_VERSION, defaultSettings } from "./defaults";
import { migrateSettings } from "./migrate";
import type { Settings } from "./model/settings";

type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> };

export type SettingsActions = {
  readonly setReading: (patch: Partial<Settings["reading"]>) => void;
  readonly setMotion: (patch: Partial<Settings["motion"]>) => void;
  readonly setNotifications: (patch: Partial<Settings["notifications"]>) => void;
  readonly setNavigation: (patch: Partial<Settings["navigation"]>) => void;
  readonly setWindows: (patch: Partial<Settings["windows"]>) => void;
  readonly setStudio: (patch: Partial<Settings["studio"]>) => void;
  readonly setComments: (patch: Partial<Settings["comments"]>) => void;
  readonly setSound: (patch: Partial<Settings["sound"]>) => void;
  readonly setSync: (patch: Partial<Settings["sync"]>) => void;
  readonly setExperiment: (name: string, enabled: boolean) => void;
  readonly replaceAll: (next: Settings) => void;
  readonly reset: () => void;
};

export type SettingsStore = Settings & SettingsActions;

const preferencesOf = (state: Settings) => ({
  version: state.version,
  revision: state.revision,
  reading: state.reading,
  motion: state.motion,
  notifications: state.notifications,
  comments: state.comments,
  sound: state.sound,
  navigation: state.navigation,
  windows: state.windows,
  studio: state.studio,
  sync: state.sync,
  experiments: state.experiments,
});

export const useSettings = create<SettingsStore>()(
  subscribeWithSelector(
    persist(
      immer((set) => {
        const patch = <K extends keyof Settings>(
          domain: K,
          value: Partial<Settings[K]>,
        ): void => {
          set((state) => {
            const target = state as Mutable<Settings>;
            Object.assign(target[domain] as object, value);
            target.revision += 1;
          });
        };

        return {
          ...defaultSettings,

          setReading: (value) => patch("reading", value),
          setMotion: (value) => patch("motion", value),
          setNotifications: (value) => patch("notifications", value),
          setNavigation: (value) => patch("navigation", value),
          setWindows: (value) => patch("windows", value),
          setStudio: (value) => patch("studio", value),
          setComments: (value) => patch("comments", value),
          setSound: (value) => patch("sound", value),
          setSync: (value) => patch("sync", value),

          setExperiment: (name, enabled) => {
            set((state) => {
              const target = state as Mutable<Settings>;
              target.experiments[name] = enabled;
              target.revision += 1;
            });
          },

          replaceAll: (next) => {
            set((state) => {
              Object.assign(state as Mutable<Settings>, next);
            });
          },

          reset: () => {
            set((state) => {
              Object.assign(state as Mutable<Settings>, defaultSettings);
            });
          },
        };
      }),
      {
        name: "zw.settings",
        version: SETTINGS_VERSION,
        storage: createThrottledJsonStorage<SettingsStore>({ delayMs: 250 }),
        partialize: (state) => preferencesOf(state) as unknown as SettingsStore,
        migrate: (persisted, version) =>
          migrateSettings(persisted, version) as unknown as SettingsStore,
      },
    ),
  ),
);

export const settingsStore = {
  getState: () => useSettings.getState(),
  subscribe: useSettings.subscribe,
};
