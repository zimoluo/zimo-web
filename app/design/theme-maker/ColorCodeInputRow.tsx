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

  const isSiteAccent = selectedAccent === "site";

  const currentAccentColor: HexColor | ColorTriplet = isSiteAccent
    ? settings.customThemeData[settings.customThemeIndex].siteThemeColor
    : settings.customThemeData[settings.customThemeIndex].palette[
        selectedAccent
      ];

  const createInputData = (
    count: number,
    title: string,
    fromHex: Function,
    fromRgb: Function,
    toHex: Function,
    toRgb: Function,
    upperLimit: number
  ) => ({
    title,
    count,
    data: Array.from({ length: count }).map((_, index) => {
      const value = isSiteAccent
        ? `${fromHex(currentAccentColor)[index]}`
        : `${fromRgb(currentAccentColor)[index]}`;
      const setValue = isSiteAccent
        ? (newValue: string | number) => {
            const newColors = fromHex(currentAccentColor);
            newColors[index] = newValue as number;
            updateSiteThemeColor(`#${toHex(newColors)}`);
          }
        : (newValue: string | number) => {
            const newColors = [...fromRgb(currentAccentColor)];
            newColors[index] = newValue as number;
            updateAccentColor(selectedAccent, toRgb(newColors));
          };

      return {
        value,
        setValue,
        isValid: (input: string) => isStringNumber(input),
        formatValue: (input: string) => {
          const num = Math.round(Number(input));
          return Math.min(
            index === 0 && type === "hsv" ? 360 : upperLimit,
            Math.max(0, num)
          );
        },
      };
    }),
  });

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
          value: isSiteAccent
            ? (currentAccentColor as HexColor)
            : `#${rgb.hex(currentAccentColor as ColorTriplet)}`,
          setValue: isSiteAccent
            ? (newValue: string | number) =>
                updateSiteThemeColor(newValue as HexColor)
            : (newValue: string | number) =>
                updateAccentColor(
                  selectedAccent,
                  hex.rgb(newValue as HexColor)
                ),
          isValid: (rawString: string) =>
            /^(#?)[A-Fa-f0-9]{6}$/.test(rawString),
          formatValue: (rawString: string) => {
            let color = rawString.trim().toUpperCase();
            return color.startsWith("#") ? color : `#${color}`;
          },
        },
      ],
    },
    rgb: createInputData(
      3,
      "RGB",
      hex.rgb,
      (a: any) => a,
      rgb.hex,
      (a: any) => a,
      255
    ),
    cmyk: createInputData(
      4,
      "CMYK",
      hex.cmyk,
      rgb.cmyk,
      cmyk.hex,
      cmyk.rgb,
      100
    ),
    hsv: createInputData(3, "HSV", hex.hsv, rgb.hsv, hsv.hex, hsv.rgb, 100),
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
