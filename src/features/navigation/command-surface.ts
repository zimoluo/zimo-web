import { useSettings } from "../settings";
import { commandPlacement, type CommandRect } from "./command-geometry";

export function createCommandSurface(popup: HTMLElement, container: HTMLDialogElement | null, closed: () => void, dismiss: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  let phase: "closed" | "opening" | "open" | "closing" = "closed";
  let animation: Animation | null = null, detailAnimation: Animation | null = null;
  let origin: HTMLElement | null = null, resting: CommandRect | null = null;
  let connected = true;
  const present = (next: typeof phase) => { phase = next; popup.dataset.commandPhase = next; };
  const rect = (node: HTMLElement): CommandRect => { const box = node.getBoundingClientRect(); return { x: box.x, y: box.y, width: box.width, height: box.height }; };
  const reduced = () => media.matches || useSettings.getState().motion.transitions === "reduced" || typeof popup.animate !== "function";
  const viewport = (): CommandRect => { const view = window.visualViewport; return { x: view?.offsetLeft ?? 0, y: view?.offsetTop ?? 0, width: view?.width ?? innerWidth, height: view?.height ?? innerHeight }; };
  const source = () => {
    if (container !== null) return null;
    const node = document.querySelector<HTMLElement>('[data-command-origin]');
    if (!node || !node.isConnected || node.closest('[data-command-visible="false"], [data-header-visible="false"]')) return null;
    const box = rect(node), view = viewport();
    return box.width > 0 && box.height > 0 && box.y >= view.y - 1 && box.y + box.height <= view.y + view.height ? node : null;
  };
  const cover = (node: HTMLElement | null) => {
    if (origin === node) return;
    if (origin) { delete origin.dataset.paletteCovered; origin.inert = false; }
    origin = node;
    if (origin) { origin.dataset.paletteCovered = "true"; origin.inert = true; }
  };
  const cancel = () => { animation?.cancel(); animation = null; detailAnimation?.cancel(); detailAnimation = null; };
  const frame = (box: CommandRect, radius: string, opacity: number): Keyframe => ({ left: `${box.x}px`, top: `${box.y}px`, width: `${box.width}px`, height: `${box.height}px`, borderRadius: radius, opacity });
  const target = () => {
    const anchor = source(), placement = commandPlacement(viewport(), anchor ? rect(anchor) : null);
    popup.style.left = `${placement.x}px`; popup.style.top = `${placement.y}px`; popup.style.width = `${placement.width}px`;
    popup.style.maxHeight = `${placement.maxHeight}px`; popup.style.setProperty("--zw-command-field-height", `${placement.fieldHeight}px`);
    popup.style.height = ""; popup.style.borderRadius = `${placement.fieldHeight / 2}px`; popup.style.opacity = "1";
    return rect(popup);
  };
  const finishClose = () => {
    if (!connected) return;
    cancel(); present("closed"); popup.style.opacity = "0"; cover(null); resting = null; closed();
  };
  const tween = (from: Keyframe, to: Keyframe, duration: number, done: () => void) => {
    cancel();
    const next = popup.animate([from, to], { duration, easing: "cubic-bezier(.37,.01,.11,.93)", fill: "both" });
    animation = next;
    void next.finished.then(() => { if (connected && animation === next) { animation = null; next.cancel(); done(); } }, () => {});
  };
  const close = (native = false) => {
    if (phase === "closed" || phase === "closing") return;
    const before = rect(popup), radius = getComputedStyle(popup).borderRadius, opacity = Number(getComputedStyle(popup).opacity);
    present("closing"); popup.inert = true; popup.style.pointerEvents = "none";
    const anchor = source();
    if (!native && popup.matches(":popover-open")) popup.hidePopover();
    if (reduced()) { finishClose(); return; }
    const destination = anchor ? rect(anchor) : { ...before, y: before.y - 8 };
    popup.style.opacity = "0";
    tween(frame(before, radius, opacity), frame(destination, anchor ? `${destination.height / 2}px` : radius, 0), 280, finishClose);
  };
  const reflow = () => {
    if (!connected || phase === "closed" || phase === "closing" || !popup.matches(":popover-open")) return;
    const before = animation ? rect(popup) : resting ?? rect(popup), wasOpening = phase === "opening";
    if (wasOpening) return;
    const radius = getComputedStyle(popup).borderRadius;
    cancel(); const next = target(); resting = next;
    if (reduced() || Math.abs(before.height - next.height) < 1 && Math.abs(before.width - next.width) < 1 && Math.abs(before.x - next.x) < 1 && Math.abs(before.y - next.y) < 1) return;
    tween(frame(before, radius, 1), frame(next, popup.style.borderRadius, 1), 180, () => { resting = rect(popup); });
  };
  const dimensions = () => {
    if (phase === "opening") {
      const before = rect(popup), radius = getComputedStyle(popup).borderRadius;
      cancel(); const next = target(); resting = next;
      if (reduced()) { present("open"); return; }
      tween(frame(before, radius, 1), frame(next, popup.style.borderRadius, 1), 180, () => { present("open"); reflow(); });
    } else if (phase === "closing") finishClose();
    else reflow();
  };
  const beforeToggle = (event: Event) => { if ((event as ToggleEvent).newState === "closed") { close(true); dismiss(); } };
  popup.addEventListener("beforetoggle", beforeToggle);
  window.addEventListener("resize", dimensions); window.visualViewport?.addEventListener("resize", dimensions); window.visualViewport?.addEventListener("scroll", dimensions);
  const motionChanged = () => { if (!reduced()) return; if (phase === "closing") finishClose(); else if (phase !== "closed") { cancel(); target(); present("open"); resting = rect(popup); } };
  media.addEventListener("change", motionChanged);
  const unsubscribe = useSettings.subscribe(state => state.motion.transitions, motionChanged);
  const header = document.querySelector('[data-header-layout]');
  const observer = new MutationObserver(() => {
    if (phase === "closing") finishClose();
    else if (phase !== "closed") dimensions();
  });
  if (header) observer.observe(header, { attributes: true, attributeFilter: ["data-header-layout", "data-command-visible"] });
  return {
    open: () => {
      const before = phase === "closing" ? rect(popup) : null;
      cancel(); popup.inert = false; popup.style.pointerEvents = "";
      const anchor = source(); cover(anchor);
      if (!popup.matches(":popover-open")) popup.showPopover();
      const next = target(); resting = next; present("open");
      if (reduced()) return;
      present("opening");
      const initial = before ?? (anchor ? rect(anchor) : { ...next, y: next.y - 8 });
      tween(frame(initial, anchor ? `${initial.height / 2}px` : popup.style.borderRadius, anchor || before ? 1 : 0), frame(next, popup.style.borderRadius, 1), 300, () => { present("open"); resting = next; reflow(); });
      const details = popup.querySelector<HTMLElement>('[data-command-content]');
      if (details) detailAnimation = details.animate([{ opacity: 0, translate: "0 -6px" }, { opacity: 1, translate: "0 0" }], { duration: 180, delay: 70, easing: "ease-out", fill: "backwards" });
    },
    close, reflow,
    dispose: () => {
      connected = false; cancel(); cover(null);
      popup.removeEventListener("beforetoggle", beforeToggle); observer.disconnect(); unsubscribe(); media.removeEventListener("change", motionChanged);
      window.removeEventListener("resize", dimensions); window.visualViewport?.removeEventListener("resize", dimensions); window.visualViewport?.removeEventListener("scroll", dimensions);
      if (popup.matches(":popover-open")) popup.hidePopover();
    },
  };
}
