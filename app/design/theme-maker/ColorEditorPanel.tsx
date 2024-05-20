"use client";

import AccentColorPicker from "./AccentColorPicker";
import ColorEditorModeSelector from "./ColorEditorModeSelector";
import AccentPalettePicker from "./AccentPalettePicker";
import ColorShadePicker from "./ColorShadePicker";
import ColorCodePicker from "./ColorCodePicker";
import editorStyle from "./color-editor.module.css";

export default function ColorEditorPanel() {
  return (
    <div className={`w-auto h-auto ${editorStyle.panel}`}>
      <div
        className={`${editorStyle.picker} theme-editor-color-picker rounded-xl shadow-lg`}
      >
        <AccentColorPicker
          palette={<AccentPalettePicker />}
          shade={<ColorShadePicker />}
          code={<ColorCodePicker />}
        />
      </div>
      <ColorEditorModeSelector />
    </div>
  );
}
