import { activeThemeSource } from "../runtime/active-source";
import { schemesOf } from "../model/resolve";
import { useTheme } from "../store";
import { subscribeProfileAutosave } from "./autosave";
import { settleStudioControls } from "./edit-boundary";
import { useStudio } from "./store";

let views = 0;
export function acquireStudioEditor(): () => void {
  if (views++ === 0) {
    const theme = useTheme.getState(), source = activeThemeSource();
    useStudio.getState().load(source, theme.active.kind === "profile" ? theme.active.index : null);
    const schemes = schemesOf(source);
    useStudio.getState().select({ scheme: schemes.includes(theme.scheme) ? theme.scheme : schemes[0] ?? "light" });
  }
  const stopAutosave = subscribeProfileAutosave();
  let active = true;
  return () => {
    if (!active) return;
    active = false;
    if (--views === 0) { settleStudioControls(); useStudio.getState().endGesture(); }
    stopAutosave();
  };
}
