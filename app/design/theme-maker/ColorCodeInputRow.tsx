"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import codeStyle from "./editor-code.module.css";
import ColorCodeInputParser from "./ColorCodeInputParser";
import { useAccentColor } from "./AccentColorContext";
import { hex, rgb, cmyk, hsv } from "color-convert";
import { isStringNumber } from "@/lib/generalHelper";

interface Props {
  type: ColorCodeType;
}

export default function ColorCodeInputRow({ type }: Props) {
  const { settings, updateAccentColor, updateSiteThemeColor } = useSettings();
  const { selectedAccent } = useAccentColor();

  const currentAccentColor: HexColor | ColorTriplet =
    selectedAccent === "site"
      ? settings.customThemeData[settings.customThemeIndex].siteThemeColor
      : settings.customThemeData[settings.customThemeIndex].palette[
          selectedAccent
        ];

  const colorCodeFormatMap: Record<
    ColorCodeType,
    {
      count: number;
      title: string;
      data: ColorCodeInputData<string | number>[];
    }
  > = {
    hex: {
      title: "Hex",
      count: 1,
      data: [
        {
          value:
            selectedAccent === "site"
              ? (currentAccentColor as HexColor)
              : `#${rgb.hex(currentAccentColor as ColorTriplet)}`,
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
    rgb: {
      title: "RGB",
      count: 3,
      data: Array.from({ length: 3 }).map((_, index) => ({
        value: ((index: number) =>
          selectedAccent === "site"
            ? `${hex.rgb(currentAccentColor as HexColor)[index]}`
            : `${(currentAccentColor as ColorTriplet)[index]}`)(index),
        setValue: ((index: number) =>
          selectedAccent === "site"
            ? (newValue: string | number) => {
                const siteThemeRgb: ColorTriplet = hex.rgb(
                  currentAccentColor as HexColor
                );
                siteThemeRgb[index] = newValue as number;
                updateSiteThemeColor(`#${rgb.hex(siteThemeRgb)}`);
              }
            : (newValue: string | number) => {
                const newColors: ColorTriplet = [
                  ...(currentAccentColor as ColorTriplet),
                ];
                newColors[index] = newValue as number;
                updateAccentColor(selectedAccent, newColors);
              })(index),
        isValid: (rawInput: string) => {
          return isStringNumber(rawInput);
        },
        formatValue: (rawInput: string) => {
          const num = Math.round(Number(rawInput));
          return Math.min(255, Math.max(0, num));
        },
      })),
    },
    cmyk: {
      title: "CMYK",
      count: 4,
      data: Array.from({ length: 4 }).map((_, index) => ({
        value: ((index: number) =>
          selectedAccent === "site"
            ? `${hex.cmyk(currentAccentColor as HexColor)[index]}`
            : `${rgb.cmyk(currentAccentColor as ColorTriplet)[index]}`)(index),
        setValue: ((index: number) =>
          selectedAccent === "site"
            ? (newValue: string | number) => {
                const siteThemeRgb = hex.cmyk(currentAccentColor as HexColor);
                siteThemeRgb[index] = newValue as number;
                updateSiteThemeColor(`#${cmyk.hex(siteThemeRgb)}`);
              }
            : (newValue: string | number) => {
                const newColors = rgb.cmyk([
                  ...(currentAccentColor as ColorTriplet),
                ]);
                newColors[index] = newValue as number;
                updateAccentColor(selectedAccent, cmyk.rgb(newColors));
              })(index),
        isValid: (rawInput: string) => {
          return isStringNumber(rawInput);
        },
        formatValue: (rawInput: string) => {
          const num = Math.round(Number(rawInput));
          return Math.min(100, Math.max(0, num));
        },
      })),
    },
    hsv: {
      title: "HSV",
      count: 3,
      data: Array.from({ length: 3 }).map((_, index) => ({
        value: ((index: number) =>
          selectedAccent === "site"
            ? `${hex.hsv(currentAccentColor as HexColor)[index]}`
            : `${rgb.hsv(currentAccentColor as ColorTriplet)[index]}`)(index),
        setValue: ((index: number) =>
          selectedAccent === "site"
            ? (newValue: string | number) => {
                const siteThemeRgb = hex.hsv(currentAccentColor as HexColor);
                siteThemeRgb[index] = newValue as number;
                updateSiteThemeColor(`#${hsv.hex(siteThemeRgb)}`);
              }
            : (newValue: string | number) => {
                const newColors = rgb.hsv([
                  ...(currentAccentColor as ColorTriplet),
                ]);
                newColors[index] = newValue as number;
                updateAccentColor(selectedAccent, hsv.rgb(newColors));
              })(index),
        isValid: (rawInput: string) => {
          return isStringNumber(rawInput);
        },
        formatValue: (rawInput: string) => {
          const num = Math.round(Number(rawInput));
          return Math.min(index === 0 ? 360 : 100, Math.max(0, num));
        },
      })),
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
