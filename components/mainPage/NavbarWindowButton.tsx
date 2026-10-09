"use client";

import DeleteCommentIcon from "@/src/ui/icons/comment/DeleteCommentIcon";
import BroomIcon from "@/src/ui/icons/entries/BroomIcon";
import MagnetIcon from "@/src/ui/icons/entries/MagnetIcon";
import WindowIcon from "@/src/ui/icons/entries/WindowIcon";
import { useWindows, openWindowDefinition, solveTidy, insetsFrom, viewportOf } from "@/src/features/windows";
import type { MouseEvent } from "react";
import buttonStyle from "./window-button.module.css";

export default function NavbarWindowButton() {
  const count = useWindows((state) => state.order.length);
  const isWindowMinimized = useWindows((state) => state.minimized);
  const toggleMinimize = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const state = useWindows.getState();
    if (state.order.length > 0) state.minimize(!state.minimized);
  };
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.shiftKey && count > 0) { toggleMinimize(event); return; }
    if (isWindowMinimized) { useWindows.getState().minimize(false); return; }
    openWindowDefinition("window-picker");
  };
  const handleBroom = () => {
    const state = useWindows.getState();
    const rects = state.order.flatMap((id) => state.instances[id] === undefined ? [] : [{id,rect:state.instances[id].rect}]);
    const targets = solveTidy({rects,viewport:viewportOf({width:window.innerWidth,height:window.innerHeight},insetsFrom(document.documentElement)),gap:12});
    for (const id of state.order) {
      const instance = state.instances[id]; const target = targets[id];
      if (instance !== undefined && target !== undefined) state.commitRect(id,{...instance.rect,...target});
    }
  };
  const clearAllWindows = () => { useWindows.getState().closeEverything(); useWindows.getState().minimize(false); };

  return (
    <div className="w-13 h-13 rounded-t-full">
      <div className={`relative w-13 rounded-t-full ${buttonStyle.container}`}>
        <button
          className={`${
            buttonStyle.transition
          } relative h-13 w-13 flex items-center justify-center bg-panel/65 backdrop-blur-xs rounded-full surface-edge ${
            isWindowMinimized ? buttonStyle.glow : "shadow-lg ease-out"
          }`}
          aria-label="Open window picker; Shift click minimizes windows"
          onClick={handleClick}
          onContextMenu={toggleMinimize}
        >
          <WindowIcon className="h-7 w-7" />
        </button>
        <div
          className={`absolute top-13 left-1/2 -translate-x-1/2 w-16 px-1.5 pt-4 pb-1.5 rounded-b-full ${
            buttonStyle.extraButtonContainer
          }  ${
            count > 0 ? buttonStyle.extraButtonContainerActive : ""
          }`}
        >
          <div
            className={`${buttonStyle.extraButton}  ${
              count > 0 ? buttonStyle.extraButtonActive : ""
            } w-13 h-[140px] bg-panel/65 backdrop-blur-xs rounded-full surface-edge shadow-lg flex items-center flex-col`}
          >
            <button
              className="w-13 h-12 pt-3 pb-2 flex items-center justify-center"
              aria-label={isWindowMinimized ? "Restore windows" : "Minimize windows"}
              onClick={toggleMinimize}
              disabled={count === 0}
            >
              <MagnetIcon className="w-7 h-7 rotate-[135deg] pointer-events-none" />
            </button>
            <button
              className="w-13 h-11 py-2 flex items-center justify-center"
              aria-label="Tidy windows"
              onClick={handleBroom}
              disabled={count === 0}
            >
              <BroomIcon
                className="w-7 h-7 pointer-events-none scale-110"
                strokeWidth={45.45}
              />
            </button>
            <button
              className="w-13 h-12 pt-2 pb-3 flex items-center justify-center"
              aria-label="Close all windows"
              onClick={clearAllWindows}
              disabled={count === 0}
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
