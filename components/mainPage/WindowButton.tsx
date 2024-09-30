"use client";

import WindowIcon from "../assets/entries/WindowIcon";
import { useWindow } from "../contexts/WindowContext";
import WindowPicker from "../window/WindowPicker";

export default function WindowButton() {
  const { appendWindow } = useWindow();
  return (
    <button
      className="fixed z-10 bottom-8 right-8 w-16 h-auto aspect-square p-3.5 rounded-full border-none border-transparent shadow-md backdrop-blur-lg bg-widget-40"
      onClick={() => {
        appendWindow({
          content: <WindowPicker />,
          contextKey: "window-picker",
          defaultHeight: 500,
          defaultWidth: 562,
          minWidth: 432,
          minHeight: 400,
          maxWidth: 688,
          maxHeight: 660,
          defaultCenterX: window.innerWidth / 2,
          defaultCenterY: window.innerHeight / 2,
        });
      }}
    >
      <WindowIcon className="w-full h-full transition-transform duration-150 ease-out hover:scale-110" />
    </button>
  );
}
