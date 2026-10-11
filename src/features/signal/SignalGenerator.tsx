"use client";

import styles from "./signal.module.css";
import { useState } from "react";
import { notify, NotificationIconView, type NotificationInput, type NotificationIcon } from "../notifications";
import { useSettings } from "../settings";
import { useWindowInstance } from "../windows";

const icons: readonly NotificationIcon[] = [
  "generic", "cog", "window", "navigator", "signal", "notebook", "studio", "mark", "photo",
  "management", "calculator", "comment", "sharing", "link", "pin", "search", "trash", "blank",
];

export default function SignalGenerator(preset: Partial<NotificationInput>) {
  const [draft, setDraft] = useState<NotificationInput>({ title: "", icon: "generic", body: "", ...preset });
  const style = useSettings((state) => state.notifications.style);
  const { updateProps } = useWindowInstance();
  if (style === "off") return <p className="p-6">Enable notifications in Settings to use the signal generator.</p>;
  return <form className={styles.form} onSubmit={(event) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    notify(draft);
    updateProps({ ...draft });
  }}>
    <fieldset className={styles.icons}>
      <legend className="mb-2">Icon</legend>
      {icons.map((icon) => <button key={icon} type="button" aria-label={icon}
        aria-pressed={draft.icon === icon} className={styles.icon}
        onClick={() => setDraft({ ...draft, icon })}>
        <NotificationIconView icon={icon} className="size-6" />
      </button>)}
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
