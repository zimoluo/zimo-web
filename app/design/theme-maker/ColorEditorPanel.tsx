"use client";

import AccentColorPicker from "./AccentColorPicker";
import ColorEditorModeSelector from "./ColorEditorModeSelector";
import AccentPalettePicker from "./AccentPalettePicker";
import ColorShadePicker from "./ColorShadePicker";
import ColorCodePicker from "./ColorCodePicker";
import "./colorful-style.css";
import panelStyle from "./color-panel.module.css";
import { ColorPickerModeProvider } from "./ColorPickerModeContext";

export default function ColorEditorPanel() {
  return (
    <ColorPickerModeProvider>
      <div className={`w-auto h-auto ${panelStyle.panel}`}>
        <div
          className={`${panelStyle.picker} theme-editor-color-picker rounded-xl shadow-lg`}
        >
          <AccentColorPicker
            palette={<AccentPalettePicker />}
            shade={<ColorShadePicker />}
            code={<ColorCodePicker />}
          />
        </div>
        <ColorEditorModeSelector />
      </div>
    </ColorPickerModeProvider>
  );
}
