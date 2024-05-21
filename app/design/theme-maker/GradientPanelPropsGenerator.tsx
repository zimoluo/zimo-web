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
import { rgb, hex, hsv, hsl } from "color-convert";
import { hexToOpacity, opacityToHex } from "@/lib/themeMaker/colorHelper";

export default function GradientPanelPropsGenerator() {
  const {
    selectedGradientCategory,
    modifyGradientStop,
    gradientStopIndex,
    formattedCurrentGradientStopData,
  } = useGradientData();
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
          ? formattedCurrentGradientStopData.color[3]
          : fromRgb(formattedCurrentGradientStopData.color.slice(0, 3))[index];

      const setValue = (newValue: string | number) => {
        const newColors = [
          ...fromRgb(formattedCurrentGradientStopData.color.slice(0, 3)),
          formattedCurrentGradientStopData.color[3],
        ] as ColorQuartet;
        newColors[index] = newValue as number;
        const formattedColors = [
          ...toRgb(...newColors.slice(0, 3)),
          newColors[3],
        ] as ColorQuartet;
        modifyGradientStop(gradientStopIndex, {
          ...formattedCurrentGradientStopData,
          color: formattedColors,
          isWidgetOpacity:
            index === 3
              ? false
              : formattedCurrentGradientStopData.isWidgetOpacity,
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
        modifyGradientStop(gradientStopIndex, {
          ...formattedCurrentGradientStopData,
          color: [
            randomIntFromRange(0, 255),
            randomIntFromRange(0, 255),
            randomIntFromRange(0, 255),
            formattedCurrentGradientStopData.isWidgetOpacity
              ? formattedCurrentGradientStopData.color[3]
              : randomUniform(0, 1),
          ],
          isWidgetOpacity: formattedCurrentGradientStopData.isWidgetOpacity,
        });
      }}
      shadePickerConfig={{
        colorValue: `#${rgb.hex(
          formattedCurrentGradientStopData.color.slice(0, 3) as ColorTriplet
        )}`,
        updateColor: (newColor: HexColor) => {
          const rgbNewColor = hex.rgb(newColor);
          modifyGradientStop(gradientStopIndex, {
            ...formattedCurrentGradientStopData,
            color: [...rgbNewColor, formattedCurrentGradientStopData.color[3]],
          });
        },
      }}
      hasAlpha={true}
      codeInputDataArray={[
        {
          count: 1,
          title: "Hex",
          data: [
            {
              value: `#${rgb.hex(
                formattedCurrentGradientStopData.color.slice(
                  0,
                  3
                ) as ColorTriplet
              )}${
                formattedCurrentGradientStopData.isWidgetOpacity
                  ? "ff"
                  : opacityToHex(formattedCurrentGradientStopData.color[3])
              }`,
              setValue: (newValue: string | number) => {
                const slicedColor = (newValue as string).slice(1);
                modifyGradientStop(gradientStopIndex, {
                  ...formattedCurrentGradientStopData,
                  color: [
                    ...hex.rgb(slicedColor.slice(0, 6)),
                    hexToOpacity(slicedColor.slice(6)),
                  ],
                  isWidgetOpacity: false,
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
