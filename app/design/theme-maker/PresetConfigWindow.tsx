"use client";

import { useWindowAction } from "@/components/contexts/WindowActionContext";
import PresetConfigLayout from "./PresetConfigLayout";

export default function PresetConfigWindow() {
  const { closeWindow } = useWindowAction();

  return <PresetConfigLayout close={closeWindow} className="w-full h-full" />;
}
