"use client";

import ringsStyle from "./rings.module.css";

export default function PenumbraAnimatedBackground() {
  return (
    <div className="fixed pointer-events-none select-none -z-20 w-screen h-screen flex items-center justify-center">
      <div
        className={`absolute ${ringsStyle.position} bg-cover bg-center ${ringsStyle.rings}`}
      />
    </div>
  );
}
