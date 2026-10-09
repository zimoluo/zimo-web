"use client";

import { useEffect } from "react";
import { accountStore, restoreAccount, syncSettings } from "../../account";
import { workspaceDataOf, workspaceStore, migrateWorkspace, useWorkspace } from "../../workspace";
import { writeRenderCookie } from "../../theme/runtime/SchemeHost";
import { themeStore, useTheme } from "../../theme";
import { themePreferencesOf } from "../../theme/store";
import { migrateThemePreferences } from "../../theme/model/preferences";
import { migrateSettings } from "../migrate";
import { safeParseSettings } from "../model/schema";
import { settingsStore, useSettings } from "../store";

export function SettingsHost() {
  useEffect(() => {
    void useSettings.persist.rehydrate();
    void useTheme.persist.rehydrate();
    void useWorkspace.persist.rehydrate();
    try {
      const legacy = localStorage.getItem("websiteSettings");
      if (legacy !== null) {
        const data: unknown = JSON.parse(legacy);
        if (localStorage.getItem("zw.settings") === null) { const migrated = safeParseSettings(migrateSettings(data)); if (migrated) useSettings.getState().replaceAll(migrated); }
        if (localStorage.getItem("zw.theme") === null) themeStore.getState().restorePreferences(migrateThemePreferences(data));
        if (localStorage.getItem("zw.workspace") === null) workspaceStore.getState().restoreWorkspace(migrateWorkspace(data));
      }
    } catch { }
    let disposed = false;
    let applying = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const reconcile = () => {
      const user = accountStore.getState().user;
      if (!user) return;
      applying = true;
      const local = settingsStore.getState();
      if (local.sync.enabled) {
        if (user.websiteSettings && user.websiteSettings.revision > local.revision) local.replaceAll(user.websiteSettings);
        if (user.syncedTheme && user.syncedTheme.revision > themeStore.getState().revision) themeStore.getState().restorePreferences(user.syncedTheme);
        if (user.syncedWorkspace && user.syncedWorkspace.revision > workspaceStore.getState().revision) workspaceStore.getState().restoreWorkspace(user.syncedWorkspace);
      }
      applying = false;
    };
    const schedule = () => {
      if (applying) return;
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(async () => {
        const settings = safeParseSettings(settingsStore.getState());
        if (!settings?.sync.enabled || !accountStore.getState().user) return;
        try { await syncSettings(settings, { theme: themePreferencesOf(themeStore.getState()), workspace: workspaceDataOf(workspaceStore.getState()) }); } catch { }
      }, 2000);
    };
    const flush = () => {
      const settings = safeParseSettings(settingsStore.getState());
      if (!settings?.sync.enabled || !accountStore.getState().user) return;
      navigator.sendBeacon("/api/v1/me/settings", new Blob([JSON.stringify({ settings, domains: { theme: themePreferencesOf(themeStore.getState()), workspace: workspaceDataOf(workspaceStore.getState()) } })], { type: "application/json" }));
    };
    window.addEventListener("pagehide", flush);
    const stopAccount = accountStore.subscribe(reconcile);
    const stopSettings = settingsStore.subscribe(schedule);
    const stopTheme = themeStore.subscribe(schedule);
    const stopWorkspace = workspaceStore.subscribe(schedule);
    if (!accountStore.getState().restored) void restoreAccount().then((user) => { if (!disposed) accountStore.getState().setUser(user); }).catch(() => { if (!disposed) accountStore.getState().setUser(null); });
    reconcile();
    const applyReading = () => {
      const state = settingsStore.getState();
      document.documentElement.style.setProperty("--zw-reading-preference-blur", `${state.reading.blur}px`);
      document.documentElement.dataset.serif = String(state.reading.serif);
      document.documentElement.dataset.toc = String(state.reading.tableOfContents);
      document.documentElement.dataset.transitions = state.motion.transitions;
      document.documentElement.dataset.nav = state.navigation.bar;
      writeRenderCookie({ f: state.reading.serif ? "serif" : "sans", toc: state.reading.tableOfContents ? "1" : "0", nav: state.navigation.bar });
    };
    applyReading(); const stopReading = settingsStore.subscribe(applyReading);
    return () => { disposed = true; window.removeEventListener("pagehide", flush); if (timer !== undefined) clearTimeout(timer); stopAccount(); stopSettings(); stopTheme(); stopWorkspace(); stopReading(); };
  }, []);
  return null;
}
