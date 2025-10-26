"use client";

import DeleteCommentIcon from "../assets/comment/DeleteCommentIcon";
import BroomIcon from "../assets/entries/BroomIcon";
import MagnetIcon from "../assets/entries/MagnetIcon";
import WindowIcon from "../assets/entries/WindowIcon";
import { useMenuControl } from "../contexts/MenuControlContext";
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
  const { sideMenuExpandedTrigger } = useMenuControl();

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

  const handleBroom = () => {
    if (windows.length === 0 || isWindowMinimized) {
      return;
    }
    initiateWindowCleanup();
  };

  const clearAllWindows = () => {
    clearWindow();
    setIsWindowMinimized(false);
  };

  return (
    <div
      className={`w-13 h-13 rounded-t-full transition-[filter] duration-75 ease-out ${
        sideMenuExpandedTrigger ? "blur-[6px]" : ""
      }`}
    >
      <div className={`relative w-13 rounded-t-full ${buttonStyle.container}`}>
        <button
          className={`${
            buttonStyle.transition
          } relative h-13 w-13 flex items-center justify-center bg-light/65 backdrop-blur-sm rounded-full border-reflect-light ${
            isWindowMinimized ? buttonStyle.glow : "shadow-lg ease-out"
          }`}
          onClick={handleClick}
          onContextMenu={toggleMinimize}
        >
          <WindowIcon className="h-7 w-7" />
        </button>
        <div
          className={`absolute top-13 left-1/2 -translate-x-1/2 w-16 px-1.5 pt-4 pb-1.5 rounded-b-full ${
            buttonStyle.extraButtonContainer
          } ${
            windows.length > 0 ? buttonStyle.extraButtonContainerActive : ""
          }`}
        >
          <div
            className={`${buttonStyle.extraButton} ${
              windows.length > 0 ? buttonStyle.extraButtonActive : ""
            } w-13 h-[140px] bg-light/65 backdrop-blur-sm rounded-full border-reflect-light shadow-lg flex items-center flex-col`}
          >
            <button
              className="w-13 h-12 pt-3 pb-2 flex items-center justify-center"
              onClick={toggleMinimize}
              disabled={windows.length === 0}
            >
              <MagnetIcon className="w-7 h-7 rotate-[135deg] pointer-events-none" />
            </button>
            <button
              className="w-13 h-11 py-2 flex items-center justify-center"
              onClick={handleBroom}
              disabled={windows.length === 0}
            >
              <BroomIcon
                className="w-7 h-7 pointer-events-none scale-110"
                strokeWidth={45.45}
              />
            </button>
            <button
              className="w-13 h-12 pt-2 pb-3 flex items-center justify-center"
              onClick={clearAllWindows}
              disabled={windows.length === 0}
            >
              <DeleteCommentIcon
                className="w-7 h-7 pointer-events-none scale-90"
                strokeWidth={1.67}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
