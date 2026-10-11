"use client";

import type { SceneComponentProps } from "../../contract";

import galleryStyle from "./gallery.module.css";

export default function GalleryAnimatedBackground({ quality }: SceneComponentProps) {

  return (
    <div
      className={`fixed inset-0 w-screen h-screen  pointer-events-none select-none ${
        quality === "rich" ? galleryStyle.hueShift : ""
      }`}
      style={{
        backgroundImage: "var(--zw-artwork-gallery-favicons-svg, url(/theme/animated-background/gallery/favicons.svg))",
        backgroundSize: "44rem",
        backgroundRepeat: "repeat",
        backgroundPosition: "calc(50% + 0.9rem) 0%",
      }}
    />
  );
}
