"use client";

import CommandKeyIcon from "@/components/assets/entries/CommandKeyIcon";
import { usePopUp } from "@/components/contexts/PopUpContext";
import PresetConfigMenu from "./PresetConfigMenu";

const contextKey = "theme-maker-preset-config";

export default function PresetConfigButton() {
  const { appendPopUp } = usePopUp();

  const openMenu = () => {
    appendPopUp({
      content: <PresetConfigMenu />,
      contextKey,
      darkOpacity: 0.25,
    });
  };

  return (
    <button
      className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square shrink-0"
      onClick={openMenu}
    >
      <CommandKeyIcon className="w-full h-auto aspect-square" />
    </button>
  );
}
