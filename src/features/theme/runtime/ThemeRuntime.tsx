"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { DEFAULT_ROUTE_THEMES, useTheme } from "../store";
import { listedThemeIds, themeIds } from "../registry";
import { routeKey } from "../model/preferences";
import { isBirthday, isChristmas, isHalloween, isNewYear, isRightAroundHalloween, isZimoWebDay } from "@/lib/seasonUtil";
function seasonalTheme(): string | undefined {
  if (isNewYear()) return "celebration";
  if (isChristmas()) return "christmas";
  if (isBirthday()) { const age = new Date().getFullYear() - 2005; const id = age === 18 ? "birthday" : `birthday${age}`; return (themeIds as readonly string[]).includes(id) ? id : "birthday-generic"; }
  if (isZimoWebDay()) return "perpetuity";
  if (isHalloween()) return isRightAroundHalloween() ? "halloween" : "spookfest";
  return undefined;
}
let shuffled = false;
export function ThemeRuntime() {
  const pathname = usePathname();
  const seasonal = useTheme((state) => state.seasonal);
  const shuffle = useTheme((state) => state.shuffle);
  useEffect(() => {
    const state = useTheme.getState();
    if (shuffle && !shuffled) {
      shuffled = true;
      for (const route of Object.keys(DEFAULT_ROUTE_THEMES) as (keyof typeof DEFAULT_ROUTE_THEMES)[]) {
        state.selectRoute(route); const chosen = listedThemeIds[Math.floor(Math.random() * listedThemeIds.length)]; if (chosen) useTheme.getState().selectBuiltIn(chosen);
      }
    }
    state.selectRoute(routeKey(pathname), seasonal ? seasonalTheme() : undefined);
  }, [pathname, seasonal, shuffle]);
  return null;
}
