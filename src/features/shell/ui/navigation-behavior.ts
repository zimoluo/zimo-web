import { useSettings } from "../../settings";
import { advanceScrollIntent, initialScrollIntent } from "./scroll-intent";

export function attachNavigationBehavior(root: HTMLElement, menuButton: HTMLButtonElement | null) {
  const entries = root.querySelector<HTMLElement>("[data-navigation-destinations]");
  const windows = root.querySelector<HTMLElement>("[data-window-control]");
  const header = root.querySelector<HTMLElement>("nav");
  const anchor = root.querySelector<HTMLElement>("[data-navigation-anchor]");
  const previousInset = document.documentElement.style.getPropertyValue("--zw-window-inset-top");
  let inset = previousInset;
  let intent = initialScrollIntent(window.scrollY);
  let frame: number | undefined;
  let connected = true;
  let menuOpen = false;
  const present = (name: string, value: string) => { if (root.dataset[name] !== value) root.dataset[name] = value; };
  const paint = () => {
    if (!connected) return;
    const settings = useSettings.getState().navigation;
    const focused = entries?.contains(document.activeElement) === true;
    const expanded = settings.bar === "pinned" || (settings.bar === "auto" && (intent.expanded || focused));
    present("navExpanded", String(expanded));
    present("contextStrip", String(settings.contextStrip));
    present("compact", String(header !== null && getComputedStyle(header).getPropertyValue("--zw-compact-header").trim() === "1"));
    const suppressed = menuOpen && window.innerWidth < 794;
    if (entries) {
      entries.inert = !expanded || suppressed;
      entries.setAttribute("aria-hidden", String(entries.inert));
    }
    if (windows) { windows.inert = window.innerWidth < 768 || root.getBoundingClientRect().width < 480; windows.setAttribute("aria-hidden", String(windows.inert)); }
    if (anchor) root.style.setProperty("--zw-destination-width", `${anchor.getBoundingClientRect().width}px`);
    inset = `${Math.ceil(root.getBoundingClientRect().bottom + 8)}px`;
    if (document.documentElement.style.getPropertyValue("--zw-window-inset-top") !== inset) document.documentElement.style.setProperty("--zw-window-inset-top", inset);
  };
  const scroll = () => {
    if (frame !== undefined || useSettings.getState().navigation.bar !== "auto") return;
    frame = requestAnimationFrame(() => { frame = undefined; const next = advanceScrollIntent(intent, window.scrollY); const changed = next.expanded !== intent.expanded; intent = next; if (changed) paint(); });
  };
  const focus = () => { queueMicrotask(() => { if (connected) paint(); }); };
  const observer = new ResizeObserver(paint);
  observer.observe(root);
  if (anchor) observer.observe(anchor);
  const unsubscribe = useSettings.subscribe((state, previous) => {
    if (state.navigation.bar !== previous.navigation.bar || state.navigation.contextStrip !== previous.navigation.contextStrip) {
      intent = initialScrollIntent(window.scrollY); paint();
    }
  });
  window.addEventListener("scroll", scroll, { passive: true });
  root.addEventListener("focusin", focus);
  root.addEventListener("focusout", focus);
  paint();
  return {
    setMenuOpen(open: boolean) {
      const closing = menuOpen && !open;
      menuOpen = open;
      if (closing) intent = { ...intent, expanded: true, travel: 0, direction: 0 };
      if (open && window.innerWidth < 794 && entries?.contains(document.activeElement)) menuButton?.focus({ preventScroll: true });
      paint();
    },
    dispose() {
      connected = false;
      if (frame !== undefined) cancelAnimationFrame(frame);
      observer.disconnect(); unsubscribe();
      if (document.documentElement.style.getPropertyValue("--zw-window-inset-top") === inset) {
        if (previousInset) document.documentElement.style.setProperty("--zw-window-inset-top", previousInset);
        else document.documentElement.style.removeProperty("--zw-window-inset-top");
      }
      window.removeEventListener("scroll", scroll);
      root.removeEventListener("focusin", focus); root.removeEventListener("focusout", focus);
    },
  };
}
