"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import galleryStyle from "./gallery.module.css";

export default function GalleryAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <div
      className={`fixed inset-0 w-screen h-screen -z-20 pointer-events-none select-none ${
        settings.backgroundRichness === "rich" ? galleryStyle.hueShift : ""
      }`}
      style={{
        backgroundImage: "url(/theme/animated-background/gallery/favicons.svg)",
        backgroundSize: "44rem",
        backgroundRepeat: "repeat",
        backgroundPosition: "calc(50% + 0.9rem) 0%",
      }}
    />
  );
}
