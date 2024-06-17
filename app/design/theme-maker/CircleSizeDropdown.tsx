"use client";

import { ChangeEvent } from "react";
import { useGradientData } from "./GradientDataContext";
import editorStyle from "./mode-data-editor.module.css";
import UpDownSwitchIcon from "@/components/assets/entries/UpDownSwitchIcon";

export default function CircleSizeDropdown() {
  const { selectedLayer, updateGradientProperty } = useGradientData();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newKeyword = event.target.value as RadialGradientSizeKeyword;
    if (newKeyword === selectedLayer.sizeKeyword) {
      return;
    }

    updateGradientProperty("sizeKeyword", newKeyword);
  };

  return (
    <div className="w-full col-span-2 relative">
      <select
        value={selectedLayer.sizeKeyword ?? "farthest-side"}
        onChange={handleChange}
        className={`bg-none border-none appearance-none border-0 bg-pastel bg-opacity-80 shadow-sm flex-grow w-full h-full rounded-md pl-1 pr-4 py-0.5 text-start ${editorStyle.input} relative`}
      >
        <option value="farthest-corner">Farthest corner</option>
        <option value="farthest-side">Farthest side</option>
        <option value="closest-corner">Closest corner</option>
        <option value="closest-side">Closest side</option>
      </select>
      <div
        className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-auto aspect-square pointer-events-none select-none"
        aria-hidden="true"
      >
        <UpDownSwitchIcon className="rotate-180" />
      </div>
    </div>
  );
}
