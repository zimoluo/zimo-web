"use client";

import { useMemo } from "react";
import ColorEditorPanel from "./ColorEditorPanel";
import { useGradientData } from "./GradientDataContext";
import GradientPalettePicker from "./GradientPalettePicker";
import {
  isStringNumber,
  randomIntFromRange,
  randomUniform,
} from "@/lib/generalHelper";
import colorConvert from "color-convert";
import { hexToOpacity, opacityToHex } from "@/lib/themeMaker/colorHelper";

const { rgb, hex, hsv, hsl } = colorConvert;

export default function GradientPanelPropsGenerator() {
  const { selectedGradientCategory, modifyGradientStop, currentGradientStop } =
    useGradientData();
  const isWidget = selectedGradientCategory === "widget";

  const sidebarConfig: EditorSelectorButtonMode[] = useMemo(() => {
    const config: EditorSelectorButtonMode[] = [
      "random",
      "rule",
      "selectorButtons",
    ];
    if (isWidget) {
      config.push("rule", "widgetOpacity");
    }

    return config;
  }, [isWidget]);

  const createInputData = (
    title: string,
    fromRgb: Function,
    toRgb: Function,
    upperLimit: number
  ): ColorCodeData => ({
    title,
    count: 4,
    data: Array.from({ length: 4 }).map((_, index) => {
      const value =
        index === 3
          ? currentGradientStop.opacity
          : fromRgb(currentGradientStop.color)[index];

      const setValue = (newValue: string | number) => {
        const newColors = [
          ...fromRgb(currentGradientStop.color),
        ] as ColorTriplet;
        let opacity = currentGradientStop.opacity;
        if (index === 3) {
          opacity = newValue as number;
        } else {
          newColors[index] = newValue as number;
        }

        const formattedColors = [...toRgb(newColors)] as ColorTriplet;
        modifyGradientStop({
          color: formattedColors,
          opacity,
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
      palettePicker={<GradientPalettePicker />}
      randomFunction={() => {
        modifyGradientStop({
          color: [
            randomIntFromRange(0, 255),
            randomIntFromRange(0, 255),
            randomIntFromRange(0, 255),
          ],
          opacity: randomUniform(0, 1),
        });
      }}
      shadePickerConfig={{
        colorValue: `#${rgb.hex(currentGradientStop.color)}`,
        updateColor: (newColor: HexColor) =>
          modifyGradientStop({
            color: hex.rgb(newColor),
          }),
      }}
      hasAlpha={true}
      codeInputDataArray={[
        {
          count: 1,
          title: "Hex",
          data: [
            {
              value: `#${rgb.hex(currentGradientStop.color)}${opacityToHex(
                currentGradientStop.opacity
              )}`,
              setValue: (newValue: string | number) => {
                const slicedColor = (newValue as string).slice(1);
                modifyGradientStop({
                  color: [...hex.rgb(slicedColor.slice(0, 6))],
                  opacity: hexToOpacity(slicedColor.slice(6)),
                });
              },
              isValid: (rawString: string) =>
                /^(#?)[A-Fa-f0-9]{8}$/.test(rawString),
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
