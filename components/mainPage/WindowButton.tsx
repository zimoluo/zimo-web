"use client";

import WindowIcon from "../assets/entries/WindowIcon";
import { useSettings } from "../contexts/SettingsContext";
import { useWindow } from "../contexts/WindowContext";
import WindowPicker from "../window/WindowPicker";

const contextKey = "window-picker";

export default function WindowButton() {
  const { appendWindow, windows, setActiveWindowByContextKey } = useWindow();
  const { settings } = useSettings();

  const handleClick = () => {
    if (windows.some((window) => window.contextKey === contextKey)) {
      setActiveWindowByContextKey(contextKey);
      return;
    }

    appendWindow({
      content: <WindowPicker />,
      contextKey: contextKey,
      defaultHeight: 500,
      defaultWidth: 562,
      minWidth: 432,
      minHeight: 400,
      maxWidth: 688,
      maxHeight: 660,
      defaultCenterX: window.innerWidth / 2,
      defaultCenterY: window.innerHeight / 2,
    });
  };

  return (
    settings.windowLimit > 0 && (
      <button
        className="hidden md:block fixed z-10 bottom-8 right-8 w-16 h-16 aspect-square p-3.5 rounded-full border-none border-transparent shadow-lg backdrop-blur-2xl bg-widget-40"
        onClick={handleClick}
      >
        <WindowIcon className="w-full h-full transition-transform duration-150 ease-out hover:scale-110" />
      </button>
    )
  );
}
