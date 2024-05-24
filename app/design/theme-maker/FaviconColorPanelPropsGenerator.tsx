"use client";

import ColorEditorPanel from "./ColorEditorPanel";
import {
  isStringNumber,
  randomIntFromRange,
  randomUniform,
} from "@/lib/generalHelper";
import { rgb, hsv, hsl } from "color-convert";
import { hexToRgba, rgbaToHex } from "@/lib/themeMaker/colorHelper";
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
    fromRgb: Function,
    toRgb: Function,
    upperLimit: number
  ): ColorCodeData => ({
    title,
    count: 4,
    data: Array.from({ length: 4 }).map((_, index) => {
      const { r, g, b, a } = hexToRgba(currentFaviconGradientStop.color);
      const [colorA, colorB, colorC] = fromRgb([r, g, b]);
      const value = [colorA, colorB, colorC, a][index];

      const setValue = (newValue: string | number) => {
        const newColors = [colorA, colorB, colorC] as ColorTriplet;
        let opacity = a;
        if (index === 3) {
          opacity = newValue as number;
        } else {
          newColors[index] = newValue as number;
        }

        const formattedColors = [...toRgb(newColors)] as ColorTriplet;
        const hexColor = rgbaToHex({
          r: formattedColors[0],
          g: formattedColors[1],
          b: formattedColors[2],
          a: opacity,
        });
        modifyFaviconGradientStop({
          color: hexColor,
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
              index === 0 && ["HSVA", "HSLA"].includes(title)
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
          color: rgbaToHex({
            r: randomIntFromRange(0, 255),
            g: randomIntFromRange(0, 255),
            b: randomIntFromRange(0, 255),
            a: randomUniform(0, 1),
          }),
        });
      }}
      shadePickerConfig={{
        colorValue: currentFaviconGradientStop.color.slice(0, 7) as HexColor,
        updateColor: (newColor: HexColor) =>
          modifyFaviconGradientStop({
            color: `${newColor}${currentFaviconGradientStop.color.slice(7)}`,
          }),
      }}
      hasAlpha={true}
      codeInputDataArray={[
        {
          count: 1,
          title: "Hex",
          data: [
            {
              value: `${currentFaviconGradientStop.color.slice(0, 7)}${
                currentFaviconGradientStop.color.slice(7, 9) || "FF"
              }`,
              setValue: (newValue: string | number) => {
                const valueToSet =
                  (newValue as HexColor).length === 7
                    ? `${newValue}ff`
                    : (newValue as string);
                modifyFaviconGradientStop({
                  color: valueToSet.toLowerCase() as HexColor,
                });
              },
              isValid: (rawString: string) =>
                /^(#?)[A-Fa-f0-9]{6}([0-9A-Fa-f]{2})?$/.test(rawString),
              formatValue: (rawString: string) => {
                let color = rawString.trim().toUpperCase();
                return color.startsWith("#") ? color : `#${color}`;
              },
            },
          ],
        },
        createInputData(
          "RGBA",
          (a: any) => a,
          (a: any) => a,
          255
        ),
        createInputData("HSVA", rgb.hsv, hsv.rgb, 100),
        createInputData("HSLA", rgb.hsl, hsl.rgb, 100),
      ]}
    />
  );
}
