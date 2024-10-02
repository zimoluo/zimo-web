"use client";

import { useWindow } from "../contexts/WindowContext";
import WindowInstance from "./WindowInstance";

export default function WindowManager() {
  const { windows, windowOrder } = useWindow();

  return (
    <div className="fixed inset-0 w-screen h-screen z-[11] pointer-events-none">
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
  );
}
