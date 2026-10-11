"use client";
import { useMemo, useState } from "react";
import { ThemeMark, getTheme, listedThemeIds, themeIds, useTheme } from "../../theme";
import styles from "./windows.module.css";
import type { ThemeSourceController } from "../../theme";
import { useWindowInstance } from "../window-identity";
export default function IdentityMarkWindow() {
  const { instance, updateProps } = useWindowInstance();
  const [rotation, setRotation] = useState(0);
  const themeId = typeof instance?.props.themeId === "string" ? instance.props.themeId : "";
  const scheme = useTheme((state) => state.scheme);
  const chosenId = themeIds.find((id) => id === themeId);
  const source = chosenId === undefined ? undefined : getTheme(chosenId);
  const controller = useMemo<ThemeSourceController | undefined>(() => source === undefined ? undefined : ({ read: () => ({source,scheme}), subscribe: () => () => {} }), [scheme,source]);
  return <div className="flex h-full flex-col items-center gap-2 p-4"><button type="button" className={`${styles.markSpin} grow min-h-0 aspect-square`} aria-label="Spin the mark" onClick={() => setRotation((value) => value + 360)} style={{ rotate: `${rotation}deg`, transition: "rotate 600ms ease-in-out" }}><ThemeMark className="size-full" {...(controller === undefined ? {} : {controller})} /></button><label className="grid w-full gap-2 text-sm">Mark theme<span className="surface-widget surface-outline block rounded-lg"><select value={themeId} onChange={(event) => updateProps({ themeId: event.target.value })} className="w-full rounded-lg bg-transparent p-2"><option value="">Current theme</option>{listedThemeIds.map((id) => <option key={id} value={id}>{getTheme(id).name}</option>)}</select></span></label></div>;
}
