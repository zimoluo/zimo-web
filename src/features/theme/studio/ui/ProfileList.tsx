"use client";

import { useLayoutEffect, useRef } from "react";
import CrossIcon from "../../../../ui/icons/CrossIcon";
import DuplicateIcon from "../../../../ui/icons/entries/DuplicateIcon";
import UpDownSwitchIcon from "../../../../ui/icons/entries/UpDownSwitchIcon";
import { useTheme } from "../../store";
import { newTheme, useStudio } from "../store";
import { ThemeThumbnail } from "./Workbench";
import styles from "./studio.module.css";

export function ProfileList() {
  const profiles = useTheme((state) => state.profiles);
  const selected = useStudio((state) => state.profileIndex);
  const root = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<{ index: number; action: string } | null>(null);
  useLayoutEffect(() => {
    const pending = pendingFocus.current;
    if (!pending) return;
    pendingFocus.current = null;
    const row = root.current?.querySelector<HTMLElement>(`[data-profile-index="${pending.index}"]`);
    const action = row?.querySelector<HTMLButtonElement>(`[data-profile-action="${pending.action}"]:not(:disabled)`);
    (action ?? row?.querySelector<HTMLButtonElement>("[data-profile-action=edit]") ?? root.current?.querySelector<HTMLButtonElement>("[data-new-profile]"))?.focus();
  }, [profiles]);
  const move = (index: number, offset: number, action: string) => {
    const target = Math.max(0, Math.min(profiles.length - 1, index + offset));
    if (target === index) return;
    useStudio.getState().endGesture();
    pendingFocus.current = { index: target, action };
    useTheme.getState().moveProfile(index, offset);
  };
  return <div ref={root}>
    <button type="button" data-new-profile="" onClick={() => useStudio.getState().load(newTheme())}>New theme</button>
    <div className={styles.profileList} role={profiles.length ? "list" : undefined} aria-label={profiles.length ? "Your profiles" : undefined}>
      {profiles.map((profile, index) => <div key={`${profile.id}-${index}`} role="listitem" data-profile-index={index} data-selected={selected === index || undefined} className={styles.profileRow}>
        <div className={styles.profileIdentity}><ThemeThumbnail source={profile} /><button type="button" data-profile-action="edit" aria-label={`Edit ${profile.name}`} aria-pressed={selected === index} title={profile.name} onClick={() => useStudio.getState().load(profile, index)} onKeyDown={event => { if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); move(index, event.key === "ArrowUp" ? -1 : 1, "edit"); } }}>{profile.name}</button></div>
        <div className={styles.profileActions}>
          <button type="button" data-profile-action="up" disabled={index === 0} aria-label={`Move ${profile.name} up`} title="Move up" onClick={() => move(index, -1, "up")}><UpDownSwitchIcon size={16} /></button>
          <button type="button" data-profile-action="down" disabled={index === profiles.length - 1} aria-label={`Move ${profile.name} down`} title="Move down" onClick={() => move(index, 1, "down")}><UpDownSwitchIcon size={16} className={styles.downArrow ?? ""} /></button>
          <button type="button" aria-label={`Duplicate ${profile.name}`} title="Duplicate" onClick={() => {
            useStudio.getState().endGesture();
            const current = useTheme.getState().profiles[index];
            if (!current) return;
            const copy = { ...current, id: crypto.randomUUID(), name: `${current.name} copy` }, target = useTheme.getState().profiles.length;
            pendingFocus.current = { index: target, action: "edit" };
            const result = useTheme.getState().addProfile(copy);
            if (result.ok) useStudio.getState().load(useTheme.getState().profiles[target] ?? copy, target);
            else pendingFocus.current = null;
          }}><DuplicateIcon size={18} /></button>
          <button type="button" aria-label={`Delete ${profile.name}`} title="Delete" onClick={() => {
            useStudio.getState().endGesture();
            pendingFocus.current = { index: Math.min(index, profiles.length - 2), action: "edit" };
            useTheme.getState().removeProfile(index);
          }}><CrossIcon size={16} /></button>
        </div>
      </div>)}
      {profiles.length === 0 && <p className={styles.hint}>Save a theme to keep it here.</p>}
    </div>
  </div>;
}
