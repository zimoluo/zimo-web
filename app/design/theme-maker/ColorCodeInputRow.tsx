"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import codeStyle from "./editor-code.module.css";
import ColorCodeInputParser from "./ColorCodeInputParser";
import { useAccentColor } from "./AccentColorContext";

interface Props {
  type: ColorCodeType;
}

export default function ColorCodeInputRow({ type }: Props) {
  const { settings } = useSettings();
  const { selectedAccent } = useAccentColor();

  const colorCodeFormatMap: Record<
    ColorCodeType,
    {
      count: number;
      title: string;
      value: (string | number)[];
      setValue: ((newValue: string | number) => void)[];
      isValid: ((rawInput: string) => boolean)[];
      formatValue: ((rawInput: string) => string | number)[];
    }
  > = {
    hex: {
      title: "Hex",
      count: 1,
      value: [settings.customThemeData[settings.customThemeIndex].palette],
    },
  };

  return (
    <div className={`${codeStyle.inputBoxContainer}`}>
      <p className="whitespace-nowrap shrink-0">
        {colorCodeFormatMap[type].title}
      </p>
      <div className={`w-full flex ${codeStyle.inputBoxGrid}`}>
        {Array.from({ length: colorCodeFormatMap[type].count }, (_, index) => (
          <ColorCodeInputParser key={index} />
        ))}
      </div>
    </div>
  );
}
