"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import GalleryModeIcon from "@/components/images/entries/GalleryModeIcon";
import PhotosStackIcon from "@/components/images/entries/PhotosStackIcon";
import modeSwitchStyle from "./mode-switch.module.css";

export default function PhotosModeSwitch() {
  const { settings, updateSettings } = useSettings();

  return (
    <section className="inline-flex items-center rounded-full px-4 py-1 md:px-4 md:py-2 bg-light bg-opacity-60 backdrop-blur-lg relative overflow-hidden border-0.8 border-soft">
      <div
        className={`absolute top-1/2 bg-saturated w-12 md:w-14 rounded-full h-auto aspect-square transition-transform duration-300 ${
          settings.enableGallery
            ? modeSwitchStyle.off
            : "-translate-x-4 md:-translate-x-5"
        }`}
      />
      <button
        className="ml-1 my-0.5 mr-3 md:mr-4 relative group"
        onClick={() => {
          if (settings.enableGallery) {
            updateSettings({ enableGallery: false });
          }
        }}
      >
        <PhotosStackIcon
          isLight={true}
          className="w-7 h-auto aspect-square transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
        <PhotosStackIcon
          isLight={false}
          className={`w-7 h-auto aspect-square absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out group-hover:scale-110 ${
            settings.enableGallery ? "opacity-100" : "opacity-0"
          }`}
        />
      </button>
      <button
        className="relative group mx-1 my-0.5"
        onClick={() => {
          if (!settings.enableGallery) {
            updateSettings({ enableGallery: true });
          }
        }}
      >
        <GalleryModeIcon
          isLight={false}
          className="w-7 h-auto aspect-square transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
        <GalleryModeIcon
          isLight={true}
          className={`w-7 h-auto aspect-square absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out group-hover:scale-110 ${
            settings.enableGallery ? "opacity-100" : "opacity-0"
          }`}
        />
      </button>
    </section>
  );
}
