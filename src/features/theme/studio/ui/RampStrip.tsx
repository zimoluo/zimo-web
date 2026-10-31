"use client";
import { useEffect, useRef } from "react";
import { useStudioDrag } from "./use-studio-drag";
import { formatOklch } from "../../color";
import { resolve, selectRoles } from "../../model/resolve";
import { previewScheme } from "../../runtime/active-source";
import { ROLE_NAMES, type RoleName, type RoleValue } from "../../model/types";
import { studioSourceController, useStudio, insertRampStop, type StudioState } from "../store";
import styles from "./studio.module.css";
import { roleLabels } from "./Workbench";
import { useStudioRange } from "./use-studio-range";
import { useStudioGesture } from "./use-studio-gesture";
function roleAt(state: StudioState, role: RoleName): number | null {
  const scheme = previewScheme(state.draft, state.selection.scheme);
  const value = selectRoles(state.draft, scheme)[role];
  if (typeof value === "number") return value;
  if (value.kind === "tone") return value.at;
  if (value.kind !== "channel") return null;
  const channel = state.draft.channels?.[value.channel], paint = channel?.appearance?.[scheme] ?? channel?.source;
  if (paint?.kind !== "tone") return null;
  const at = value.at ?? paint.at;
  return paint.reverse === true ? 1 - at : at;
}
function setAt(role: RoleName, at: number) {
  const state = useStudio.getState(), scheme = previewScheme(state.draft, state.selection.scheme);
  const previous = selectRoles(state.draft, scheme)[role];
  useStudio.getState().edit((draft) => {
    let map: Record<RoleName, RoleValue> | Partial<Record<RoleName, RoleValue>>;
    if (draft.schemes.kind === "single") map = draft.schemes.roles;
    else if (useStudio.getState().selection.scheme === "light") map = draft.schemes.light;
    else { draft.schemes.dark ??= {}; map = draft.schemes.dark; draft.schemes.darkReviewed = false; }
    if (typeof previous === "object" && previous.kind === "channel") {
      const channel = draft.channels?.[previous.channel], paint = channel?.appearance?.[scheme] ?? channel?.source;
      map[role] = paint?.kind === "tone" ? { ...previous, at: paint.reverse === true ? 1 - at : at } : at;
    } else map[role] = typeof previous === "object" && previous.kind === "tone" ? { ...previous, at } : at;
  });
}
const toneKeys = new Set(["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"]);
function RoleMarker({ role }: { readonly role: RoleName }) {
  const at = useStudio((state) => roleAt(state, role)), gesture = useStudioGesture();
  const keys = useStudioRange(gesture);
  const drag = useStudioDrag({
    onStart: (pointer, element) => {
      const rect = element.getBoundingClientRect();
      element.querySelector<HTMLButtonElement>("[role=slider]")?.focus({ preventScroll: true });
      gesture.begin();
      setAt(role, Math.max(0, Math.min(1, (pointer.clientX - rect.left) / rect.width)));
      return rect;
    },
    onMove: (pointer, rect) => setAt(role, Math.max(0, Math.min(1, (pointer.clientX - rect.left) / rect.width))),
    onEnd: () => gesture.end(),
    onCancel: () => gesture.end(), axis: "x",
  }, gesture.owner);
  if (at === null) return <div className={styles.rolePosition}><span>{roleLabels[role]} · Custom</span><button className={styles.useTone} type="button" onClick={() => setAt(role, .5)}>Use ramp</button></div>;
  return <div className={styles.rolePosition}><span className={styles.toneHeading}>{roleLabels[role]}<span>{Math.round(at * 100)}%</span></span><span className={styles.roleTrack} style={drag.style} onPointerDown={drag.onPointerDown}><button type="button" role="slider" data-role-tone={role} aria-label={`${roleLabels[role]} tone`} aria-orientation="horizontal" aria-valuemin={0} aria-valuemax={1} aria-valuenow={at} onBlur={keys.onBlur} onKeyUp={keys.onKeyUp} onKeyDown={(event) => {
    if (!toneKeys.has(event.key)) return;
    keys.onKeyDown(event); if (event.defaultPrevented) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "PageUp" ? 1 : -1;
    const step = event.shiftKey || event.key.startsWith("Page") ? .1 : .01;
    setAt(role, event.key === "Home" ? 0 : event.key === "End" ? 1 : Math.max(0, Math.min(1, Number((at + direction * step).toFixed(4)))));
  }} style={{ left: `${at * 100}%` }} aria-valuetext={`${Math.round(at * 100)}%`} /></span></div>;
}
export function RampStrip() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const paint = () => { const state = useStudio.getState(); const theme = resolve(state.draft, previewScheme(state.draft, state.selection.scheme)); const tones = Array.from({ length: 41 }, (_, index) => formatOklch(theme.tone(index / 40))); ref.current?.querySelectorAll<HTMLElement>("[data-ramp-tone]").forEach((element, index) => { element.style.background = tones[index] ?? ""; }); ref.current?.closest("section")?.style.setProperty("--studio-ramp-image", `linear-gradient(to right, ${tones.join(",")})`); };
    paint(); return studioSourceController.subscribe(paint);
  }, []);
  return <div ref={ref}><div className={styles.rampStrip} role="img" aria-label="Drag a role along the ramp; right click to add a stop" onContextMenu={(event) => { event.preventDefault(); const rect = event.currentTarget.getBoundingClientRect(); const at = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)); const state = useStudio.getState(); const color = resolve(state.draft, previewScheme(state.draft, state.selection.scheme)).tone(at); insertRampStop(at, color.l); }}>{Array.from({ length: 41 }, (_, index) => <span key={index} data-ramp-tone={index / 40} />)}</div></div>;
}

export function RolePositions() { return <details className={`${styles.advanced} zw-disclosure`}><summary>Tone positions</summary><div className={styles.rolePositions}>{ROLE_NAMES.map((role) => <RoleMarker key={role} role={role} />)}</div></details>; }
