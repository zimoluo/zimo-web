"use client";

import { useWindow } from "../contexts/WindowContext";
import WindowInstance from "./WindowInstance";

export default function WindowManager() {
  const { windows } = useWindow();
  return windows.map((windowData, index) => {
    return <WindowInstance data={windowData} key={index} />;
  });
}
