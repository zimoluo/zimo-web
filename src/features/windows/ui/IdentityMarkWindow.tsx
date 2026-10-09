"use client";
import { useMemo, useState } from "react";
import { ThemeMark, getTheme, listedThemeIds, themeIds, useTheme } from "../../theme";
import type { ThemeSourceController } from "../../theme";
import { useWindowInstance } from "../window-identity";
export default function IdentityMarkWindow() {
  const { instance, updateProps } = useWindowInstance();
  const [spinning, setSpinning] = useState(false);
  const themeId = typeof instance?.props.themeId === "string" ? instance.props.themeId : "";
  const scheme = useTheme((state) => state.scheme);
  const chosenId = themeIds.find((id) => id === themeId);
  const source = chosenId === undefined ? undefined : getTheme(chosenId);
  const controller = useMemo<ThemeSourceController | undefined>(() => source === undefined ? undefined : ({ read: () => ({source,scheme}), subscribe: () => () => {} }), [scheme,source]);
  return <div className="flex h-full flex-col items-center gap-2 p-4"><button type="button" className="grow min-h-0 aspect-square" aria-label="Spin the mark" onClick={() => setSpinning((value) => !value)} style={{ rotate: spinning ? "360deg" : "0deg", transition: "rotate var(--zw-duration-transition) var(--zw-ease-enter)" }}><ThemeMark className="size-full" {...(controller === undefined ? {} : {controller})} /></button><label className="w-full">Mark theme<select value={themeId} onChange={(event) => updateProps({ themeId: event.target.value })} className="surface-widget w-full rounded-lg p-2"><option value="">Current theme</option>{listedThemeIds.map((id) => <option key={id} value={id}>{id}</option>)}</select></label></div>;
}
