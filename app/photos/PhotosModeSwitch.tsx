"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import GalleryModeIcon from "@/components/assets/entries/GalleryModeIcon";
import PhotosStackIcon from "@/components/assets/entries/PhotosStackIcon";
import modeSwitchStyle from "./mode-switch.module.css";

export default function PhotosModeSwitch() {
  const { settings, updateSettings } = useSettings();

  return (
    <section className="rounded-full w-28 h-12 bg-light bg-opacity-65 backdrop-blur-sm relative overflow-hidden border-reflect-light">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-16 p-1 pointer-events-none select-none">
        <div
          className={`transition-transform duration-300 bg-saturated rounded-full w-full h-full ${
            settings.enableGallery ? modeSwitchStyle.on : modeSwitchStyle.off
          }`}
        />
      </div>
      <div className="relative w-full h-full flex items-center justify-center gap-5">
        <button
          className="relative group flex items-center justify-center w-7"
          onClick={() => {
            if (settings.enableGallery) {
              updateSettings({ enableGallery: false });
            }
          }}
        >
          <PhotosStackIcon
            isLight={true}
            className="w-7 h-7 aspect-square transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <PhotosStackIcon
            isLight={false}
            className={`w-7 h-7 aspect-square absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out group-hover:scale-105 ${
              settings.enableGallery ? "opacity-100" : "opacity-0"
            }`}
          />
        </button>
        <button
          className="relative group flex items-center justify-center w-7"
          onClick={() => {
            if (!settings.enableGallery) {
              updateSettings({ enableGallery: true });
            }
          }}
        >
          <GalleryModeIcon
            isLight={false}
            className="w-7 h-7 aspect-square transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <GalleryModeIcon
            isLight={true}
            className={`w-7 h-7 aspect-square absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out group-hover:scale-105 ${
              settings.enableGallery ? "opacity-100" : "opacity-0"
            }`}
          />
        </button>
      </div>
    </section>
  );
}
