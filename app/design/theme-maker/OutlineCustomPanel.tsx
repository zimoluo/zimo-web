"use client";

import { isStringNumber, randomIntFromRange } from "@/lib/generalHelper";
import ColorEditorPanel from "./ColorEditorPanel";
import { useFaviconEditor } from "./FaviconEditorContext";
import colorConvert from "color-convert";
import { useSettings } from "@/components/contexts/SettingsContext";
import OutlineColorPicker from "./OutlineColorPicker";

const { rgb, hex, cmyk, hsv } = colorConvert;

export default function OutlineCustomPanel() {
  const { faviconConfig } = useFaviconEditor();
  const { updateFaviconConfig } = useSettings();
  const isEnabled = (faviconConfig.outline ?? "primary").startsWith("#");

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
      const nativeColor = fromHex(faviconConfig.outline);
      const value = nativeColor[index];

      const setValue = (newValue: string | number) => {
        const newColors = structuredClone(nativeColor);
        newColors[index] = newValue as number;

        const formattedColors = `#${toHex(newColors)}`.toLowerCase();
        updateFaviconConfig({
          outline: formattedColors as HexColor,
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
    isEnabled && (
      <div className="mt-4 grid h-52">
        <ColorEditorPanel
          sidebarConfig={["random", "rule", "selectorButtons"]}
          palettePicker={<OutlineColorPicker />}
          randomFunction={() => {
            updateFaviconConfig({
              outline: `#${rgb.hex(
                randomIntFromRange(0, 255),
                randomIntFromRange(0, 255),
                randomIntFromRange(0, 255)
              )}`,
            });
          }}
          shadePickerConfig={{
            colorValue: (faviconConfig.outline ?? "#ffffff").slice(
              0,
              7
            ) as HexColor,
            updateColor: (newColor: HexColor) =>
              updateFaviconConfig({
                outline: newColor.toLowerCase() as HexColor,
              }),
          }}
          hasAlpha={false}
          codeInputDataArray={[
            {
              count: 1,
              title: "Hex",
              data: [
                {
                  value: `${(faviconConfig.outline ?? "#ffffff").slice(0, 7)}`,
                  setValue: (newValue: string | number) => {
                    const valueToSet = newValue as HexColor;
                    updateFaviconConfig({
                      outline: valueToSet.toLowerCase() as HexColor,
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
      </div>
    )
  );
}
