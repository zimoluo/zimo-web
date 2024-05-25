"use client";

import { Fragment, ReactNode } from "react";
import ColorPickerSelectorButtons from "./ColorPickerSelectorButtons";
import MagicWandButton from "./MagicWandButton";
import RandomizeColorButton from "./RandomizeColorButton";
import selectorStyle from "./editor-mode-selector.module.css";
import { useColorPanel } from "./ColorPanelContext";
import WidgetOpacityButton from "./WidgetOpacityButton";

const modeComponentMap: Record<EditorSelectorButtonMode, ReactNode> = {
  magic: <MagicWandButton />,
  selectorButtons: <ColorPickerSelectorButtons />,
  random: <RandomizeColorButton />,
  rule: (
    <hr
      className={`${selectorStyle.rule} border-saturated border-opacity-80`}
    />
  ),
  widgetOpacity: <WidgetOpacityButton />,
};

export default function ColorEditorModeSelector() {
  const { sidebarConfig } = useColorPanel();

  return (
    <div
      className={`${selectorStyle.selector} rounded-xl bg-light bg-opacity-80 shadow-lg flex items-center gap-3`}
    >
      {sidebarConfig.map((mode, index) => {
        return <Fragment key={index}>{modeComponentMap[mode]}</Fragment>;
      })}
    </div>
  );
}
