import { loadThemeSource } from "../model/schema";
import { useTheme } from "../store";
import { useStudio } from "./store";
export function subscribeProfileAutosave(): () => void {
  return useStudio.subscribe((state) => [state.draft, state.gesturing] as const, () => {
    const state = useStudio.getState();
    if (state.gesturing || state.profileIndex === null) return;
    const parsed = loadThemeSource(state.draft);
    if (parsed.ok) useTheme.getState().replaceProfile(state.profileIndex, parsed.theme);
  }, { equalityFn: (a, b) => a[0] === b[0] && a[1] === b[1] });
}
