"use client";

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
  return <form className="flex h-full flex-col gap-3 overflow-auto p-5" onSubmit={(event) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    notify(draft);
    updateProps({ ...draft });
  }}>
    <fieldset className="grid grid-cols-6 gap-1">
      <legend className="mb-2">Icon</legend>
      {icons.map((icon) => <button key={icon} type="button" aria-label={icon}
        aria-pressed={draft.icon === icon} className="grid size-11 place-items-center rounded-lg hover:bg-fill"
        onClick={() => setDraft({ ...draft, icon })}>
        <NotificationIconView icon={icon} className="size-6" />
      </button>)}
    </fieldset>
    <label className="flex flex-col gap-1">Title
      <input required maxLength={200} value={draft.title} className="surface-sunken rounded-xl p-3"
        onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
    </label>
    <label className="flex grow flex-col gap-1">Content
      <textarea maxLength={2000} value={draft.body ?? ""} className="surface-sunken min-h-20 grow rounded-xl p-3"
        onChange={(event) => setDraft({ ...draft, body: event.target.value })} />
    </label>
    <button type="submit" disabled={!draft.title.trim()} className="surface-raised min-h-11 rounded-xl px-4 disabled:opacity-50">Send notification</button>
  </form>;
}
