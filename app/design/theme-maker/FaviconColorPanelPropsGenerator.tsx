"use client";

import ColorEditorPanel from "./ColorEditorPanel";
import { isStringNumber, randomIntFromRange } from "@/lib/generalHelper";
import colorConvert from "color-convert";
import { useFaviconEditor } from "./FaviconEditorContext";
import FaviconGradientColorPicker from "./FaviconGradientColorPicker";

const { rgb, hex, hsv, cmyk } = colorConvert;

export default function FaviconColorPanelPropsGenerator() {
  const { modifyFaviconGradientStop, currentFaviconGradientStop } =
    useFaviconEditor();

  const sidebarConfig: EditorSelectorButtonMode[] = [
    "random",
    "rule",
    "selectorButtons",
  ];

  const createInputData = (
    title: string,
    fromHex: Function,
    toHex: Function,
    upperLimit: number,
    count: number = 3
  ): ColorCodeData => ({
    title,
    count: count,
    data: Array.from({ length: count }).map((_, index) => {
      const nativeColor = fromHex(currentFaviconGradientStop.color);
      const value = nativeColor[index];

      const setValue = (newValue: string | number) => {
        const newColors = structuredClone(nativeColor);
        newColors[index] = newValue as number;

        const formattedColors = `#${toHex(newColors)}`.toLowerCase();
        modifyFaviconGradientStop({
          color: formattedColors as HexColor,
        });
      };

      return {
        value,
        setValue,
        isValid: (input: string) => isStringNumber(input),
        formatValue: (input: string) => {
          const num = Math.round(Number(input));
          return (
            Math.min(
              index === 0 && ["HSV"].includes(title) ? 360 : upperLimit,
              Math.max(0, num)
            ) || 0
          );
        },
      };
    }),
  });

  return (
    <ColorEditorPanel
      sidebarConfig={sidebarConfig}
      palettePicker={<FaviconGradientColorPicker />}
      randomFunction={() => {
        modifyFaviconGradientStop({
          color: `#${rgb.hex(
            randomIntFromRange(0, 255),
            randomIntFromRange(0, 255),
            randomIntFromRange(0, 255)
          )}`,
        });
      }}
      shadePickerConfig={{
        colorValue: currentFaviconGradientStop.color.slice(0, 7) as HexColor,
        updateColor: (newColor: HexColor) =>
          modifyFaviconGradientStop({
            color: `${newColor}${currentFaviconGradientStop.color.slice(7)}`,
          }),
      }}
      hasAlpha={false}
      codeInputDataArray={[
        {
          count: 1,
          title: "Hex",
          data: [
            {
              value: `${currentFaviconGradientStop.color.slice(0, 7)}`,
              setValue: (newValue: string | number) => {
                const valueToSet = newValue as HexColor;
                modifyFaviconGradientStop({
                  color: valueToSet.toLowerCase() as HexColor,
                });
              },
              isValid: (rawString: string) =>
                /^(#?)[A-Fa-f0-9]{6}$/.test(rawString),
              formatValue: (rawString: string) => {
                let color = rawString.trim().toUpperCase();
                return color.startsWith("#") ? color : `#${color}`;
              },
            },
          ],
        },
        createInputData("RGB", hex.rgb, rgb.hex, 255),
        createInputData("CMYK", hex.cmyk, cmyk.hex, 100, 4),
        createInputData("HSV", hex.hsv, hsv.hex, 100),
      ]}
    />
  );
}
