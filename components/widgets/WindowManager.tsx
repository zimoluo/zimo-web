"use client";

import { useWindow } from "../contexts/WindowContext";
import WindowInstance from "./WindowInstance";
import { useState, useEffect } from "react";

export default function WindowManager() {
  const { windows, clearWindow } = useWindow();
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768 && windows.length > 0) {
        clearWindow();
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowWidth < 768 ? null : (
    <div className="fixed inset-0 w-screen h-screen z-[11] pointer-events-none select-none">
      {windows.map((windowData) => {
        return <WindowInstance data={windowData} key={windowData.uniqueId} />;
      })}
    </div>
  );
}
