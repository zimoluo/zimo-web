"use client";

import { useWindow } from "../contexts/WindowContext";
import WindowInstance from "./WindowInstance";
import windowStyle from "./window-instance.module.css";

export default function WindowManager() {
  const { windows, windowOrder, isWindowMinimized } = useWindow();

  // add a saveWindows function. you see i have a WindowSaveData defined. the data is just windows[index] but without the uniqueId field. now there's order which is windowOrder[index]. x and y are from windowRefs's bounding rect top and left. width and height are from windowref as well. 

  return (
    <div
      className={`fixed inset-0 w-screen h-screen z-[11] pointer-events-none ${
        isWindowMinimized ? windowStyle.minimizedTranslate : ""
      } transition-transform duration-500 ${windowStyle.managerTransition}`}
    >
      <div
        className={`fixed w-full h-full pointer-events-none ${
          isWindowMinimized ? windowStyle.minimizedScale : ""
        } transition-transform duration-500 ${windowStyle.managerTransition}`}
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
