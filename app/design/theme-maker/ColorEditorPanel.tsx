"use client";

import AccentColorPicker from "./AccentColorPicker";
import ColorEditorModeSelector from "./ColorEditorModeSelector";
import ColorShadePicker from "./ColorShadePicker";
import ColorCodePicker from "./ColorCodePicker";
import "./colorful-style.css";
import panelStyle from "./color-panel.module.css";
import { ColorPanelProvider } from "./ColorPanelContext";
import { ReactNode } from "react";

interface Props {
  sidebarConfig?: EditorSelectorButtonMode[];
  randomFunction?: () => void;
  palettePicker?: ReactNode;
  shadePickerConfig?: ShadePickerConfig;
  hasAlpha?: boolean;
  codeInputDataArray?: ColorCodeData[];
}

export default function ColorEditorPanel({
  sidebarConfig = [],
  randomFunction = () => {},
  palettePicker = null,
  shadePickerConfig = {
    colorValue: "#ffffff",
    updateColor: (newColor: HexColor) => {},
  },
  hasAlpha = false,
  codeInputDataArray = [],
}: Props) {
  return (
    <ColorPanelProvider
      sidebarConfig={sidebarConfig}
      randomFunction={randomFunction}
      palettePicker={palettePicker}
      shadePickerConfig={shadePickerConfig}
      codeInputDataArray={codeInputDataArray}
    >
      <div className={`w-auto h-auto ${panelStyle.panel}`}>
        <div
          className={`${panelStyle.picker} theme-editor-color-picker${
            hasAlpha ? "-alpha" : ""
          } rounded-xl shadow-lg`}
        >
          <AccentColorPicker
            palette={palettePicker}
            shade={<ColorShadePicker />}
            code={<ColorCodePicker />}
          />
        </div>
        <ColorEditorModeSelector />
      </div>
    </ColorPanelProvider>
  );
}
