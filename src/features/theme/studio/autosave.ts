import { loadThemeSource } from "../model/schema";
import { useTheme } from "../store";
import { useStudio } from "./store";

let owners = 0;
let release: (() => void) | null = null;

export function subscribeProfileAutosave(): () => void {
  owners++;
  if (release === null) {
    const edits = useStudio.subscribe((state) => [state.draft, state.gesturing] as const, () => {
      const state = useStudio.getState();
      if (state.gesturing || state.profileIndex === null) return;
      const parsed = loadThemeSource(state.draft);
      if (parsed.ok) useTheme.getState().replaceProfile(state.profileIndex, parsed.theme);
    }, { equalityFn: (a, b) => a[0] === b[0] && a[1] === b[1] });
    const profiles = useTheme.subscribe((state) => state.profiles, (next, previous) => {
      const current = useStudio.getState();
      if (current.profileIndex === null) return;
      const profile = previous[current.profileIndex];
      const index = profile === undefined ? -1 : next.indexOf(profile);
      if (index >= 0 && index !== current.profileIndex) useStudio.setState({ profileIndex: index });
      else if (index < 0) {
        const parsed = loadThemeSource(current.draft);
        if (next.length < previous.length || !parsed.ok || JSON.stringify(next[current.profileIndex]) !== JSON.stringify(parsed.theme)) useStudio.setState({ profileIndex: null });
      }
    });
    release = () => { edits(); profiles(); };
  }
  let subscribed = true;
  return () => {
    if (!subscribed) return;
    subscribed = false;
    if (--owners === 0) { release?.(); release = null; }
  };
}
