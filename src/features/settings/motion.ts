import { settingsStore } from "./store";

const query = "(prefers-reduced-motion: reduce)";
export const reducedTransitions = (): boolean => settingsStore.getState().motion.transitions === "reduced" || window.matchMedia(query).matches;

export function watchReducedTransitions(reduce: () => void): () => void {
  const media = window.matchMedia(query);
  const check = () => { if (media.matches || settingsStore.getState().motion.transitions === "reduced") reduce(); };
  const stop = settingsStore.subscribe((state, previous) => {
    if (state.motion.transitions !== previous.motion.transitions) check();
  });
  media.addEventListener("change", check);
  check();
  return () => { stop(); media.removeEventListener("change", check); };
}
