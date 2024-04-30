"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import codeStyle from "./editor-code.module.css";
import ColorCodeInputParser from "./ColorCodeInputParser";
import { useAccentColor } from "./AccentColorContext";
import { hex, rgb } from "color-convert";

interface Props {
  type: ColorCodeType;
}

export default function ColorCodeInputRow({ type }: Props) {
  const { settings, updateAccentColor, updateSiteThemeColor } = useSettings();
  const { selectedAccent } = useAccentColor();

  const colorCodeFormatMap: Record<
    ColorCodeType,
    {
      count: number;
      title: string;
      data: {
        value: string | number;
        setValue: (newValue: string | number) => void;
        isValid: (rawInput: string) => boolean;
        formatValue: (rawInput: string) => string | number;
      }[];
    }
  > = {
    hex: {
      title: "Hex",
      count: 1,
      data: [
        {
          value:
            selectedAccent === "site"
              ? settings.customThemeData[settings.customThemeIndex]
                  .siteThemeColor
              : `#${rgb.hex(
                  settings.customThemeData[settings.customThemeIndex].palette[
                    selectedAccent
                  ]
                )}`,
          setValue:
            selectedAccent === "site"
              ? (newValue) => {
                  updateSiteThemeColor(newValue as HexColor);
                }
              : (newValue) => {
                  updateAccentColor(
                    selectedAccent,
                    hex.rgb(newValue as HexColor)
                  );
                },
          isValid: (rawString: string) => {
            {
              const regex = /^(#?)[A-Fa-f0-9]{6}$/;
              return regex.test(rawString);
            }
          },
          formatValue: (rawString: string) => {
            let color = rawString.trim().toUpperCase();

            if (!color.startsWith("#")) {
              color = "#" + color;
            }

            return color;
          },
        },
      ],
    },
  };

  return (
    <div className={`${codeStyle.inputBoxContainer}`}>
      <p className="whitespace-nowrap shrink-0">
        {colorCodeFormatMap[type].title}
      </p>
      <div className={`w-full flex ${codeStyle.inputBoxGrid}`}>
        {Array.from({ length: colorCodeFormatMap[type].count }, (_, index) => (
          <ColorCodeInputParser
            key={index}
            {...colorCodeFormatMap[type].data[index]}
          />
        ))}
      </div>
    </div>
  );
}
