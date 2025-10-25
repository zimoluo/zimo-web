"use client";

import WindowIcon from "../assets/entries/WindowIcon";
import { useSettings } from "../contexts/SettingsContext";
import { useWindow } from "../contexts/WindowContext";
import WindowPicker from "../window/WindowPicker";
import buttonStyle from "./window-button.module.css";

const contextKey = "window-picker";

export default function NavbarWindowButton() {
  const {
    appendWindow,
    windows,
    setActiveWindowByContextKey,
    setIsWindowMinimized,
    isWindowMinimized,
    clearWindow,
    initiateWindowCleanup,
  } = useWindow();
  const { settings } = useSettings();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.shiftKey && windows.length > 0) {
      event.preventDefault();
      setIsWindowMinimized((prev) => !prev);
      return;
    }

    if (isWindowMinimized) {
      setIsWindowMinimized(false);
      return;
    }

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
    <button
      className={`${
        buttonStyle.transition
      } h-13 w-13 flex items-center justify-center bg-light/65 backdrop-blur-sm rounded-full border-reflect-light ${
        isWindowMinimized ? buttonStyle.glow : "shadow-lg ease-out"
      }`}
      onClick={handleClick}
      onContextMenu={toggleMinimize}
    >
      <WindowIcon className="h-7 w-7" />
    </button>
  );
}
