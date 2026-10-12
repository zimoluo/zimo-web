import { useNavigationUi } from "../../navigation/store";
import { useSettings } from "../../settings";
import { advanceScrollIntent, initialScrollIntent } from "./scroll-intent";
import { layoutHeader, planHeaderMotion, type HeaderLayout, type HeaderRect } from "./header-layout";
import { createHeaderMotion, rectFrames } from "./header-motion";

export function attachNavigationBehavior(root: HTMLElement, menuButton: HTMLButtonElement | null) {
  const entries = root.querySelector<HTMLElement>("[data-navigation-destinations]");
  const windows = root.querySelector<HTMLElement>("[data-window-control]");
  const anchor = root.querySelector<HTMLElement>("[data-navigation-anchor]");
  const slot = root.querySelector<HTMLElement>("[data-context-slot]");
  const previousInset = document.documentElement.style.getPropertyValue("--zw-window-inset-top");
  const previousDelay = document.documentElement.style.getPropertyValue("--zw-sidebar-account-enter-delay");
  const motion = createHeaderMotion();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let inset = previousInset;
  let delay = previousDelay;
  let intent = initialScrollIntent(window.scrollY);
  let frame: number | undefined;
  let connected = true;
  let menuOpen = useNavigationUi.getState().sideMenuExpanded;
  let layout: HeaderLayout | undefined;
  let wasReduced = reduced.matches || useSettings.getState().motion.transitions === "reduced";
  const present = (name: string, value: string) => { if (root.dataset[name] !== value) root.dataset[name] = value; };
  const property = (name: string, value: string) => { if (root.style.getPropertyValue(name) !== value) root.style.setProperty(name, value); };
  const rect = (element: HTMLElement | null): HeaderRect => { const box = element?.getBoundingClientRect(); return { x: box?.left ?? 0, y: box?.top ?? 10, width: box?.width ?? 0, height: box?.height ?? 52 }; };
  const textWidth = (element: Element | null) => {
    if (!element) return 0;
    const range = document.createRange(); range.selectNodeContents(element);
    return range.getBoundingClientRect().width;
  };
  const measureCommand = (detail: boolean, limit: number) => {
    const label = slot?.querySelector("[data-context-label]") ?? null;
    const shortcut = slot?.querySelector("kbd") ?? null;
    const extra = slot?.querySelector<HTMLElement>("[data-context-detail]");
    const action = slot?.querySelector<HTMLElement>('[aria-label="Context action"]');
    return 24 + 20 + 16 + Math.min(limit, textWidth(label)) + textWidth(shortcut) + (detail && extra ? extra.scrollWidth + 8 : 0) + (action?.offsetWidth ?? 0) + (action ? 8 : 0);
  };
  const updateInset = () => {
    if (!connected) return;
    inset = `${Math.ceil(root.getBoundingClientRect().bottom + 8)}px`;
    if (document.documentElement.style.getPropertyValue("--zw-window-inset-top") !== inset) document.documentElement.style.setProperty("--zw-window-inset-top", inset);
  };
  const paint = () => {
    if (!connected) return;
    const settings = useSettings.getState();
    const reduceMotion = reduced.matches || settings.motion.transitions === "reduced";
    if (reduceMotion && !wasReduced) {
      motion.dispose();
      if (typeof CSSTransition !== "undefined") for (const element of [root, document.querySelector<HTMLDialogElement>('dialog[aria-label="Site menu"]')]) {
        for (const animation of element?.getAnimations({ subtree: true }) ?? []) if (animation instanceof CSSTransition) animation.cancel();
      }
    }
    wasReduced = reduceMotion;
    const focused = entries?.contains(document.activeElement) === true;
    const expanded = settings.navigation.bar === "pinned" || (settings.navigation.bar === "auto" && (intent.expanded || focused));
    const span = window.innerWidth - (menuOpen && window.innerWidth >= 532 ? 396 : 0);
    const labels = entries ? [...entries.querySelectorAll<HTMLElement>('[data-destination-label]')].reduce((sum, element) => sum + element.getBoundingClientRect().width, 0) : 0;
    const baseWidth = Math.round((entries?.getBoundingClientRect().width ?? 228) - labels);
    const next = layoutHeader({ width: window.innerWidth, menu: menuOpen, expanded, strip: settings.navigation.contextStrip, destinations: baseWidth, command: measureCommand(span >= 900, span >= 900 ? 352 : 192) });
    if (layout !== undefined && JSON.stringify(layout) === JSON.stringify(next)) { updateInset(); return; }
    const commandBefore = rect(slot);
    const navBefore = rect(entries);
    const navPaintBefore = entries ? getComputedStyle(entries) : null;
    const navOpacityBefore = navPaintBefore?.opacity ?? "1";
    const navFilterBefore = navPaintBefore?.filter ?? "none";
    const windowBefore = rect(windows);
    const heightBefore = root.getBoundingClientRect().height;
    const anchorBefore = anchor ? getComputedStyle(anchor) : null;
    const navLeftBefore = anchorBefore?.left ?? "84px";
    const navTranslateBefore = anchorBefore?.translate ?? "0px";
    const plan = planHeaderMotion({ command: commandBefore, nav: navBefore, headerVisible: layout?.visible ?? next.visible, navVisible: layout?.nav.visible ?? next.nav.visible, windowsVisible: layout?.windows.visible ?? next.windows.visible, sidebarBoundary: layout?.sidebarBoundary ?? next.sidebarBoundary }, next);
    const skipMotion = layout === undefined || reduceMotion;
    present("navExpanded", String(expanded)); present("contextStrip", String(settings.navigation.contextStrip));
    present("compact", String(next.nav.alignment === -50)); present("headerLayout", next.mode);
    present("headerVisible", String(next.visible)); present("navVisible", String(next.nav.visible)); present("navExit", next.nav.exit); present("hoverLabels", String(next.nav.labels));
    present("windowsVisible", String(next.windows.visible)); present("commandVisible", String(next.command.visible)); present("contextDetail", String(next.command.detail));
    root.setAttribute("aria-hidden", String(!next.visible)); root.inert = !next.visible;
    if (entries) { entries.inert = !next.nav.visible; entries.setAttribute("aria-hidden", String(entries.inert)); }
    if (windows) { windows.inert = !next.windows.visible; windows.setAttribute("aria-hidden", String(windows.inert)); }
    if (slot) { slot.inert = !next.command.visible; slot.setAttribute("aria-hidden", String(slot.inert)); }
    property("--zw-header-height", `${next.height}px`); property("--zw-header-opacity", next.visible ? "1" : "0");
    property("--zw-nav-left", `${next.nav.anchor}px`); property("--zw-nav-align", `${next.nav.alignment}%`);
    property("--zw-window-left", `${next.windows.x}px`);
    property("--zw-command-left", `${next.command.x}px`); property("--zw-command-top", `${next.command.y}px`); property("--zw-command-width", `${next.command.width}px`);
    property("--zw-command-label-limit", `${next.command.labelLimit}px`);
    property("--zw-header-enter-delay", `${skipMotion ? 0 : plan.headerEnterDelay}ms`);
    property("--zw-nav-enter-delay", `${skipMotion ? 0 : plan.navEnterDelay}ms`);
    property("--zw-window-enter-delay", `${skipMotion ? 0 : plan.windowEnterDelay}ms`);
    delay = `${skipMotion ? 0 : plan.accountEnterDelay}ms`;
    document.documentElement.style.setProperty("--zw-sidebar-account-enter-delay", delay);
    if (layout === undefined || layout.nav.anchor !== next.nav.anchor || layout.nav.alignment !== next.nav.alignment) motion.animate(anchor, [{ left: navLeftBefore, translate: navTranslateBefore }, { left: `${next.nav.anchor}px`, translate: `${next.nav.alignment}%` }], skipMotion);
    if (layout?.height !== next.height) motion.animate(root, [{ height: `${heightBefore}px` }, { height: `${next.height}px` }], skipMotion);
    if (layout === undefined || layout.command.x !== next.command.x || layout.command.y !== next.command.y || layout.command.width !== next.command.width) motion.animate(slot, rectFrames(plan.command), skipMotion);
    if (layout?.windows.x !== next.windows.x) {
      const entering = plan.windowEnterDelay > 0;
      const frames: Keyframe[] = [{ left: `${windowBefore.x}px`, offset: 0, pointerEvents: entering ? "none" : "auto" }, ...(plan.holdWindows ? [{ left: `${windowBefore.x}px`, offset: .4 }] : []), ...(entering ? [{ pointerEvents: "none", offset: .9 }] : []), { left: `${next.windows.x}px`, offset: 1, pointerEvents: "auto" }];
      motion.animate(windows, frames.map(keyframe => ({ ...keyframe, easing: "cubic-bezier(.37,.01,.11,.93)" })), skipMotion);
    }
    if (plan.navFade || plan.navEnterDelay > 0 || motion.has(entries)) {
      const start = { opacity: navOpacityBefore, filter: navFilterBefore, offset: 0 };
      const end = { opacity: next.nav.visible ? 1 : 0, filter: next.nav.visible ? "blur(0px)" : "blur(8px)", offset: 1 };
      const duration = plan.navFade ? 300 : plan.navEnterDelay > 0 ? plan.navEnterDelay + 180 : next.nav.visible ? 180 : 80;
      const frames = plan.navFade ? [start, { opacity: 0, filter: "blur(8px)", offset: .27 }, { opacity: 0, filter: "blur(8px)", offset: .75 }, end] : plan.navEnterDelay > 0 ? [start, { opacity: 0, filter: "blur(8px)", offset: 80 / duration }, { opacity: 0, filter: "blur(8px)", offset: plan.navEnterDelay / duration }, end] : [start, end];
      motion.animate(entries, frames.map(keyframe => ({ ...keyframe, easing: "ease-out" })), skipMotion, duration);
    }
    layout = next;
    updateInset();
  };
  const scroll = () => {
    if (frame !== undefined || useSettings.getState().navigation.bar !== "auto") return;
    frame = requestAnimationFrame(() => { frame = undefined; const next = advanceScrollIntent(intent, window.scrollY); const changed = next.expanded !== intent.expanded; intent = next; if (changed) paint(); });
  };
  const focus = () => { queueMicrotask(() => { if (!connected) return; if ([entries, windows, slot].some(element => element?.contains(document.activeElement))) motion.dispose(); paint(); }); };
  const dimensions = new ResizeObserver(updateInset); dimensions.observe(root);
  const content = new ResizeObserver(paint); if (anchor) content.observe(anchor);
  const mutations = new MutationObserver(paint); if (slot) mutations.observe(slot, { childList: true, characterData: true, subtree: true });
  const unsubscribe = useSettings.subscribe((state, previous) => {
    if (state.navigation.bar !== previous.navigation.bar || state.navigation.contextStrip !== previous.navigation.contextStrip || state.motion.transitions !== previous.motion.transitions) {
      if (state.navigation.bar !== previous.navigation.bar) intent = { ...initialScrollIntent(window.scrollY), expanded: true };
      paint();
    }
  });
  window.addEventListener("scroll", scroll, { passive: true }); window.addEventListener("resize", paint);
  root.addEventListener("focusin", focus); root.addEventListener("focusout", focus); reduced.addEventListener("change", paint);
  paint(); void document.fonts.ready.then(() => { if (connected) paint(); });
  const unsubscribeMenu = useNavigationUi.subscribe((state, previous) => {
    if (state.sideMenuExpanded === previous.sideMenuExpanded) return;
    const closing = menuOpen && !state.sideMenuExpanded; menuOpen = state.sideMenuExpanded;
    if (closing) intent = { ...intent, expanded: true, travel: 0, direction: 0 };
    if (menuOpen && window.innerWidth < 794 && entries?.contains(document.activeElement)) menuButton?.focus({ preventScroll: true });
    paint();
  });
  return {
    dispose() {
      connected = false; if (frame !== undefined) cancelAnimationFrame(frame);
      motion.dispose(); dimensions.disconnect(); content.disconnect(); mutations.disconnect(); unsubscribe(); unsubscribeMenu();
      for (const [name, value, previous] of [["--zw-window-inset-top", inset, previousInset], ["--zw-sidebar-account-enter-delay", delay, previousDelay]]) {
        if (document.documentElement.style.getPropertyValue(name!) !== value) continue;
        if (previous) document.documentElement.style.setProperty(name!, previous); else document.documentElement.style.removeProperty(name!);
      }
      window.removeEventListener("scroll", scroll); window.removeEventListener("resize", paint);
      root.removeEventListener("focusin", focus); root.removeEventListener("focusout", focus); reduced.removeEventListener("change", paint);
    },
  };
}
