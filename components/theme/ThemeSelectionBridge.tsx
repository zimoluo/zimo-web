"use client";

import { useEffect } from "react";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useNavigation } from "@/lib/helperHooks";
import { resolveSelection } from "@/src/features/theme/runtime/legacy-theme-key";
import { themeStore } from "@/src/features/theme/store";

export function ThemeSelectionBridge() {
  const { settings } = useSettings();
  const navigationKey = useNavigation();

  const key = settings.pageTheme[navigationKey];
  const darkOverride = settings.darkModeThemesOverride;
  const profileIndex = settings.customThemeIndex;
  const profileCount = settings.customThemeData?.length ?? 0;

  useEffect(() => {
    const selection = resolveSelection({
      key,
      darkOverride,
      profileIndex,
      profileCount,
    });

    const state = themeStore.getState();

    if (selection.kind === "profile") state.selectProfile(selection.index);
    else state.selectBuiltIn(selection.id);
  }, [darkOverride, key, profileCount, profileIndex]);

  return null;
}
