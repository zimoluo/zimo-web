"use client";

import AngleDataInput from "./AngleDataInput";
import { useGradientData } from "./GradientDataContext";
import LinearGradientKeywordPicker from "./LinearGradientKeywordPicker";
import LinearGradientKeywordToggle from "./LinearGradientKeywordToggle";

export default function LinearGradientDataEditor() {
  const { selectedLayer } = useGradientData();

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <div className="absolute top-3 right-3">
        <LinearGradientKeywordToggle />
      </div>
      {selectedLayer.linearGradientKeyword ? (
        <LinearGradientKeywordPicker />
      ) : (
        <AngleDataInput />
      )}
    </div>
  );
}
