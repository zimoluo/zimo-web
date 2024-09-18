"use client";

import { useWindow } from "../contexts/WindowContext";
import WindowInstance from "./WindowInstance";

export default function WindowManager() {
  const { windows } = useWindow();
  return (
    <div className="fixed inset-0 w-screen h-screen z-[11] pointer-events-none select-none">
      {windows.map((windowData) => {
        return <WindowInstance data={windowData} key={windowData.uniqueId} />;
      })}
    </div>
  );
}
