"use client";

import { useMenuControl } from "../contexts/MenuControlContext";
import { useWindow } from "../contexts/WindowContext";
import WindowInstance from "./WindowInstance";
import windowStyle from "./window-instance.module.css";

export default function WindowManager() {
  const { windows, windowOrder, isWindowMinimized } = useWindow();
  const { isSideMenuExpanded } = useMenuControl();

  return (
    <div
      className={`fixed w-screen h-screen z-[11] pointer-events-none ${
        isWindowMinimized
          ? isSideMenuExpanded
            ? windowStyle.minimizedTranslateWhenMenuOpen
            : windowStyle.minimizedTranslate
          : "inset-0"
      } ${windowStyle.managerTransition}`}
    >
      <div
        className={`fixed w-full h-full pointer-events-none ${
          isWindowMinimized ? windowStyle.minimizedScale : ""
        } ${windowStyle.managerTransition}`}
      >
        {windows.map((windowData, index) => {
          return (
            <WindowInstance
              data={windowData}
              key={windowData.uniqueId}
              isActive={windowOrder[index] === windows.length - 1}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
}
