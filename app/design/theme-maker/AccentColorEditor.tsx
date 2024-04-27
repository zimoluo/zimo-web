"use client";

import AccentColorSelectorPill from "./AccentColorSelectorPill";
import { AccentColorProvider } from "./AccentColorContext";
import AccentColorPicker from "./AccentColorPicker";

export default function AccentColorEditor() {
  return (
    <AccentColorProvider>
      <div className="bg-pastel bg-opacity-40 backdrop-blur rounded-xl shadow-lg p-4 flex">
        <div className="grid grid-rows-6 gap-2 w-48 shrink-0">
          <AccentColorSelectorPill accentType="primary" />
          <AccentColorSelectorPill accentType="saturated" />
          <AccentColorSelectorPill accentType="middle" />
          <AccentColorSelectorPill accentType="soft" />
          <AccentColorSelectorPill accentType="pastel" />
          <AccentColorSelectorPill accentType="light" />
          <AccentColorSelectorPill accentType="site" />
        </div>
        <div className="ml-4">
          NOT FINAL
          <AccentColorPicker />
        </div>
        <div className="ml-4 w-8 shrink-0 rounded-xl bg-light bg-opacity-80 shadow-lg" />
      </div>
    </AccentColorProvider>
  );
}
