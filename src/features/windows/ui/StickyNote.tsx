"use client";

import { useWindowInstance } from "../window-identity";

export default function StickyNote() {
  const { instance, updateProps } = useWindowInstance();
  const text = typeof instance?.props.text === "string" ? instance.props.text : "";
  return <textarea aria-label="Sticky note" value={text} onChange={(event) => updateProps({ text: event.target.value })} placeholder="Notes..." className="size-full resize-none bg-panel/90 p-4 text-text" />;
}
