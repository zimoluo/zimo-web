"use client";

import { SurfaceRim } from "../../ui/SurfaceRim";
import styles from "./signal.module.css";
import { useState } from "react";
import { notify, NotificationIconView, type NotificationInput, type NotificationIcon } from "../notifications";
import { useSettings } from "../settings";
import { openWindowDefinition, useWindowInstance } from "../windows";

const icons: readonly (readonly [NotificationIcon, string])[] = [
  ["generic", "General"], ["cog", "Settings"], ["window", "Windows"], ["navigator", "Navigator"],
  ["signal", "Signal"], ["notebook", "Notebook"], ["studio", "Theme Studio"], ["mark", "Favicon"],
  ["photo", "Photo"], ["management", "Management"], ["calculator", "Calculator"], ["comment", "Comment"],
  ["sharing", "Sharing"], ["link", "Link"], ["pin", "Pin"], ["search", "Search"], ["trash", "Delete"], ["blank", "Blank"],
];

export default function SignalGenerator(preset: Partial<NotificationInput>) {
  const [draft, setDraft] = useState<NotificationInput>(() => ({ title: "", body: "", ...preset, icon: icons.find(([icon]) => icon === preset.icon)?.[0] ?? "generic" }));
  const style = useSettings((state) => state.notifications.style);
  const { updateProps } = useWindowInstance();
  if (style === "off") return <div className={styles.disabled}>
    <p>Notifications are turned off.</p>
    <p className="text-sm text-text-muted">Enable them in Settings to send a signal.</p>
    <button type="button" className="surface-raised surface-edge min-h-11 rounded-full px-4 shadow-sm" onClick={() => openWindowDefinition("settings")}>Open Settings<SurfaceRim /></button>
  </div>;
  return <form className={styles.form} onSubmit={(event) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    notify(draft);
    updateProps({ ...draft });
  }}>
    <fieldset className={styles.iconSection}>
      <legend>Icon</legend>
      <div className={styles.icons} role="radiogroup" aria-label="Notification icon" onKeyDown={(event) => {
        const current = icons.findIndex(([icon]) => icon === (draft.icon ?? "generic"));
        let next: number;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % icons.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + icons.length) % icons.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = icons.length - 1;
        else return;
        event.preventDefault();
        setDraft({ ...draft, icon: icons[next]![0] });
        event.currentTarget.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
      }}>
        {icons.map(([icon, label]) => <button key={icon} type="button" role="radio" aria-label={label} title={label}
          aria-checked={(draft.icon ?? "generic") === icon} tabIndex={(draft.icon ?? "generic") === icon ? 0 : -1}
          className={`${styles.icon} ${(draft.icon ?? "generic") === icon ? "surface-raised surface-edge shadow-sm" : ""}`}
          onClick={() => setDraft({ ...draft, icon })}>
          <NotificationIconView icon={icon} className="size-6" /><SurfaceRim />
        </button>)}
      </div>
    </fieldset>
    <label className="flex flex-col gap-1">Title
      <span className="surface-nested surface-outline block rounded-lg shadow-sm"><input required maxLength={200} value={draft.title} className="min-h-11 rounded-lg bg-transparent p-3"
        onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></span>
    </label>
    <label className="flex grow flex-col gap-1">Content
      <span className="surface-nested surface-outline flex min-h-20 grow rounded-lg shadow-sm"><textarea maxLength={2000} value={draft.body ?? ""} className="min-h-20 grow resize-none rounded-lg bg-transparent p-3"
        onChange={(event) => setDraft({ ...draft, body: event.target.value })} /></span>
    </label>
    <button type="submit" disabled={!draft.title.trim()} className="surface-raised min-h-11 rounded-full px-4 disabled:opacity-50">Send notification</button>
  </form>;
}
