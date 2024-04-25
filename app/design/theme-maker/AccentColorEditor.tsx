"use client";

import { RgbColorPicker } from "react-colorful";
import AccentColorSelectorPill from "./AccentColorSelectorPill";

export default function AccentColorEditor() {
  return (
    <div className="bg-widget-40 backdrop-blur rounded-xl shadow-lg p-4 flex">
      <div className="space-y-8 w-60">
        <AccentColorSelectorPill accentType="primary" />
        <AccentColorSelectorPill accentType="saturated" />
        <AccentColorSelectorPill accentType="middle" />
        <AccentColorSelectorPill accentType="soft" />
      </div>
      <div className="ml-20">
        <RgbColorPicker />
      </div>
    </div>
  );
}
