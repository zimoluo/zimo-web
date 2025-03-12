"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { useAccentColor } from "./AccentColorContext";
import ColorEditorPanel from "./ColorEditorPanel";
import { generateRandomColor } from "@/lib/themeMaker/colorHelper";
import colorConvert from "color-convert";
import AccentPalettePicker from "./AccentPalettePicker";
import { isStringNumber } from "@/lib/generalHelper";

const { rgb, hex, cmyk, hsv } = colorConvert;

export default function AccentColorPanelPropsGenerator() {
  const { selectedAccent } = useAccentColor();
  const { updateSiteThemeColor, updateAccentColor, currentCustomThemeConfig } =
    useSettings();

  const isSiteAccent = selectedAccent === "site";
  const currentAccentColor: HexColor | ColorTriplet = isSiteAccent
    ? currentCustomThemeConfig.siteThemeColor
    : currentCustomThemeConfig.palette[selectedAccent];

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
            index === 0 && title === "HSV" ? 360 : upperLimit,
            Math.max(0, num)
          );
        },
      };
    }),
  });

  const codeInputData: ColorCodeData[] = [
    {
      title: "Hex",
      count: 1,
      data: [
        {
          value: isSiteAccent
            ? (currentAccentColor as HexColor)
            : `#${rgb.hex(currentAccentColor as ColorTriplet)}`,
          setValue: isSiteAccent
            ? (newValue: string | number) =>
                updateSiteThemeColor(
                  (newValue as string).toLowerCase() as HexColor
                )
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
    createInputData(
      3,
      "RGB",
      hex.rgb,
      (a: any) => a,
      rgb.hex,
      (a: any) => a,
      255
    ),
    createInputData(4, "CMYK", hex.cmyk, rgb.cmyk, cmyk.hex, cmyk.rgb, 100),
    createInputData(3, "HSV", hex.hsv, rgb.hsv, hsv.hex, hsv.rgb, 100),
  ];

  return (
    <ColorEditorPanel
      sidebarConfig={["magic", "random", "rule", "selectorButtons"]}
      randomFunction={() => {
        if (selectedAccent === "site") {
          updateSiteThemeColor(`#${rgb.hex(generateRandomColor())}`);
        } else {
          updateAccentColor(selectedAccent, generateRandomColor());
        }
      }}
      palettePicker={<AccentPalettePicker />}
      shadePickerConfig={{
        colorValue:
          selectedAccent === "site"
            ? currentCustomThemeConfig.siteThemeColor
            : (rgb.hex(
                currentCustomThemeConfig.palette[selectedAccent]
              ) as HexColor),
        updateColor: (hexColor: HexColor) => {
          if (selectedAccent === "site") {
            updateSiteThemeColor(hexColor);
          } else {
            updateAccentColor(selectedAccent, hex.rgb(hexColor));
          }
        },
      }}
      codeInputDataArray={codeInputData}
    />
  );
}
