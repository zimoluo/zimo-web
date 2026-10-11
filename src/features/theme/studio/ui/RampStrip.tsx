"use client";
import { useEffect, useRef } from "react";
import { useDragGesture } from "../../../../lib/gesture/use-drag-gesture";
import { formatOklch } from "../../color";
import { resolve } from "../../model/resolve";
import { previewScheme } from "../../runtime/active-source";
import { ROLE_NAMES, type RoleName, type RoleValue } from "../../model/types";
import { studioSourceController, useStudio, insertRampStop, type StudioState } from "../store";
import styles from "./studio.module.css";
import { roleLabels } from "./Workbench";
function roleAt(state: StudioState, role: RoleName): number | null {
  const schemes = state.draft.schemes;
  const value = schemes.kind === "single" ? schemes.roles[role] : state.selection.scheme === "light" ? schemes.light[role] : schemes.dark?.[role] ?? schemes.light[role];
  const at = typeof value === "number" ? value : value.kind === "tone" ? value.at : null;
  if (at === null) return null;
  return schemes.kind === "dual" && state.selection.scheme === "dark" && schemes.dark?.[role] === undefined && schemes.mirrorDark !== false ? 1 - at : at;
}
function setAt(role: RoleName, at: number) {
  useStudio.getState().edit((draft) => {
    let map: Record<RoleName, RoleValue> | Partial<Record<RoleName, RoleValue>>;
    if (draft.schemes.kind === "single") map = draft.schemes.roles;
    else if (useStudio.getState().selection.scheme === "light") map = draft.schemes.light;
    else { draft.schemes.dark ??= {}; map = draft.schemes.dark; draft.schemes.darkReviewed = false; }
    const previous = map[role]; map[role] = typeof previous === "object" && previous.kind === "tone" ? { ...previous, at } : at;
  });
}
function RoleMarker({ role }: { readonly role: RoleName }) {
  const at = useStudio((state) => roleAt(state, role));
  const drag = useDragGesture({ onStart: (pointer, element) => { const rect = element.parentElement?.getBoundingClientRect(); if (!rect) return null; useStudio.getState().beginGesture(); setAt(role, Math.max(0, Math.min(1, (pointer.clientX - rect.left) / rect.width))); return rect; }, onMove: (pointer, rect) => setAt(role, Math.max(0, Math.min(1, (pointer.clientX - rect.left) / rect.width))), onEnd: () => useStudio.getState().endGesture(), axis: "x" });
  if (at === null) return <div className={styles.rolePosition}><span>{roleLabels[role]} · Custom</span><button className={styles.useTone} type="button" onClick={() => setAt(role, .5)}>Use ramp</button></div>;
  return <div className={styles.rolePosition}><span>{roleLabels[role]}</span><span className={styles.roleTrack}><button type="button" role="slider" aria-label={`${role} tone`} aria-valuemin={0} aria-valuemax={1} aria-valuenow={at} onPointerDown={drag.onPointerDown} onKeyDown={(event) => { if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; event.preventDefault(); setAt(role, Math.max(0, Math.min(1, at + (event.key === "ArrowRight" ? 1 : -1) * (event.shiftKey ? .1 : .01)))); }}  style={{ ...drag.style, left: `${at * 100}%`,  }} aria-valuetext={`${Math.round(at * 100)}%`}></button></span></div>;
}
export function RampStrip() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const paint = () => { const state = useStudio.getState(); const theme = resolve(state.draft, previewScheme(state.draft, state.selection.scheme)); ref.current?.querySelectorAll<HTMLElement>("[data-ramp-tone]").forEach((element) => { element.style.background = formatOklch(theme.tone(Number(element.dataset.rampTone))); }); };
    paint(); return studioSourceController.subscribe(paint);
  }, []);
  return <div ref={ref}><div className={styles.rampStrip} role="img" aria-label="Drag a role along the ramp; right click to add a stop" onContextMenu={(event) => { event.preventDefault(); const rect = event.currentTarget.getBoundingClientRect(); const at = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)); const state = useStudio.getState(); const color = resolve(state.draft, previewScheme(state.draft, state.selection.scheme)).tone(at); insertRampStop(at, color.l); }}>{Array.from({ length: 41 }, (_, index) => <span key={index} data-ramp-tone={index / 40} />)}</div></div>;
}

export function RolePositions() { return <details className={`${styles.advanced} zw-disclosure`}><summary>Tone positions</summary><div className={styles.rolePositions}>{ROLE_NAMES.map((role) => <RoleMarker key={role} role={role} />)}</div></details>; }
