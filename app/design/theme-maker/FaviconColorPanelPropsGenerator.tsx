"use client";

import ColorEditorPanel from "./ColorEditorPanel";
import { isStringNumber, randomIntFromRange } from "@/lib/generalHelper";
import { rgb, hex, hsv, hsl } from "color-convert";
import { useFaviconEditor } from "./FaviconEditorContext";
import FaviconGradientColorPicker from "./FaviconGradientColorPicker";

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
    upperLimit: number
  ): ColorCodeData => ({
    title,
    count: 3,
    data: Array.from({ length: 4 }).map((_, index) => {
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
          const num =
            index === 3
              ? Math.round(Number(input) * 100) / 100
              : Math.round(Number(input));
          return (
            Math.min(
              index === 0 && ["HSV", "HSL"].includes(title)
                ? 360
                : index === 3
                ? 1
                : upperLimit,
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
        createInputData("HSV", hex.hsv, hsv.hex, 100),
        createInputData("HSL", hex.hsl, hsl.hex, 100),
      ]}
    />
  );
}
