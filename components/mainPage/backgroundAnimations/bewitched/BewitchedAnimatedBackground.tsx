"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import TheTwoMoons from "./TheTwoMoons";
import SpinningMoons from "./SpinningMoons";

export default function BewitchedAnimatedBackground() {
  const { settings } = useSettings();

  return settings.backgroundRichness === "rich" ? (
    <SpinningMoons />
  ) : (
    <TheTwoMoons />
  );
}
