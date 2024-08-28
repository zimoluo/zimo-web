"use client";

import CogIcon from "@/components/assets/toast/CogIcon";
import { useGradientData } from "./GradientDataContext";

export default function LinearGradientKeywordToggle() {
  const { selectedLayer, updateGradientProperty } = useGradientData();
  const isKeyword = !!selectedLayer.linearGradientKeyword;

  const handleClick = () => {
    updateGradientProperty("linearGradientKeyword", !isKeyword);
  };

  return (
    <div className="h-10 w-10 p-2 shrink-0 rounded-lg bg-pastel bg-opacity-80 shadow-sm">
      <button className="w-full h-auto aspect-square" onClick={handleClick}>
        <CogIcon strokeWidth={90} />
      </button>
    </div>
  );
}
