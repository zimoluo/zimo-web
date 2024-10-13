"use client";

import WindowIcon from "../assets/entries/WindowIcon";
import { useSettings } from "../contexts/SettingsContext";
import { useWindow } from "../contexts/WindowContext";
import WindowPicker from "../window/WindowPicker";
import buttonStyle from "./window-button.module.css";

const contextKey = "window-picker";

export default function WindowButton() {
  const {
    appendWindow,
    windows,
    setActiveWindowByContextKey,
    setIsWindowMinimized,
    isWindowMinimized,
  } = useWindow();
  const { settings } = useSettings();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.shiftKey && windows.length > 0) {
      event.preventDefault();
      setIsWindowMinimized((prev) => !prev);
      return;
    }

    setIsWindowMinimized(false);

    if (windows.some((window) => window.contextKey === contextKey)) {
      setActiveWindowByContextKey(contextKey);
      return;
    }

    appendWindow({
      content: <WindowPicker />,
      contextKey: contextKey,
      defaultHeight: 480,
      defaultWidth: 562,
      minWidth: 432,
      minHeight: 400,
      maxWidth: 688,
      maxHeight: 660,
      defaultCenterX: window.innerWidth / 2,
      defaultCenterY: window.innerHeight / 2,
    });
  };

  const toggleMinimize = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (windows.length === 0) {
      return;
    }

    event.preventDefault();

    setIsWindowMinimized((prev) => !prev);
  };

  return (
    !settings.disableWindows && (
      <button
        className={`hidden md:block fixed z-[15] bottom-8 right-8 w-16 h-16 aspect-square p-3.5 rounded-full border-none border-transparent ${
          buttonStyle.transition
        } ${
          isWindowMinimized ? buttonStyle.glow : "shadow-lg ease-out"
        } backdrop-blur-2xl bg-widget-40`}
        onClick={handleClick}
        onContextMenu={toggleMinimize}
      >
        <WindowIcon className="relative w-full h-full transition-transform duration-300 ease-out hover:scale-110" />
      </button>
    )
  );
}
