"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import BouncingCircle from "./BouncingCircle";
import ClickingCircle from "./ClickingCircle";

export default function MidnightAnimatedBackground() {
  const { settings } = useSettings();
  return settings.backgroundRichness === "rich" ? (
    <BouncingCircle />
  ) : (
    <ClickingCircle />
  );
}
