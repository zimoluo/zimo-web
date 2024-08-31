"use client";

import CommandKeyIcon from "@/components/assets/entries/CommandKeyIcon";
import { useState } from "react";

export default function PresetConfigButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative w-7 h-7 aspect-square">
      <button
        className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square shrink-0"
        onClick={toggleMenu}
      >
        <CommandKeyIcon className="w-full h-auto aspect-square" />
      </button>
      <div
        className={`absolute z-5 w-48 h-48 transition-opacity ease-out ${
          menuOpen
            ? "opacity-100 duration-150"
            : "pointer-events-none select-none opacity-0 duration-300"
        } top-0 md:top-1/2 -translate-y-52 md:-translate-y-1/2 left-1/2 md:left-0 -translate-x-1/2 md:-translate-x-52`}
      >
        <div className="w-full h-full bg-slate-400">hihi</div>
      </div>
    </div>
  );
}
