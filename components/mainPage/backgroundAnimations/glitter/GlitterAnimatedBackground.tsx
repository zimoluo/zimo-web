"use client";

import glitterStyle from "./glitter.module.css";
import animatedStyle from "./glitter-animated.module.css";
import { useSettings } from "@/components/contexts/SettingsContext";
import ReadingBlur from "@/components/widgets/ReadingBlur";

export default function GlitterAnimatedBackground() {
  const { settings } = useSettings();
  return (
    <>
      <div
        className={`-z-20 w-screen h-screen inset-0 fixed pointer-events-none select-none ${
          glitterStyle.glitter
        } ${
          settings.backgroundRichness === "rich" ? animatedStyle.glitter : ""
        }`}
      />
      <ReadingBlur className="-z-20" />
    </>
  );
}
