"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { useInputParser } from "@/lib/helperHooks";
import CircularSlider from "@fseehawer/react-circular-slider";
import { rgb } from "color-convert";
import { useGradientData } from "./GradientCategoryContext";
import { isStringNumber } from "@/lib/generalHelper";

function angleToNumber(degString: string): number {
  const regex = /^(-?\d*\.?\d+)(deg)?$/;
  const match = degString.match(regex);

  if (match) {
    return Math.round(parseFloat(match[1]));
  } else {
    return 0;
  }
}

function modInRange(a: number, b: number): number {
  const result = a % b;
  return result < 0 ? result + b : result;
}

export default function AngleDataInput() {
  const { currentCustomThemeConfig, updateGradientData } = useSettings();
  const { selectedLayer, currentLayerIndex, selectedGradientCategory } =
    useGradientData();
  const currentGradient = selectedLayer[currentLayerIndex];

  const angle = angleToNumber(currentGradient.angle ?? "0deg");
  const setAngle = (newAngle: number) => {
    const newLayer = structuredClone(selectedLayer);
    const newGradient = structuredClone(currentGradient);
    newGradient.angle = `${modInRange(newAngle || 0, 360)}deg`;
    newLayer[currentLayerIndex] = newGradient;

    updateGradientData(selectedGradientCategory, newLayer);
  };

  const [storedValue, handleChange] = useInputParser<number>({
    value: angle,
    setValue: setAngle,
    isValid: isStringNumber,
    formatValue: (rawInput: string) =>
      Math.round(modInRange(parseFloat(rawInput), 360)),
  });

  return (
    <div>
      <p className="text-center mb-4 text-lg">Angle</p>
      <div className="relative">
        <CircularSlider
          width={100}
          hideLabelValue={true}
          trackDraggable={true}
          knobPosition="bottom"
          knobColor={`#${rgb.hex(currentCustomThemeConfig.palette.saturated)}`}
          trackColor={`#${rgb.hex(currentCustomThemeConfig.palette.pastel)}`}
          progressColorFrom={`#${rgb.hex(
            currentCustomThemeConfig.palette.middle
          )}`}
          progressColorTo={`#${rgb.hex(
            currentCustomThemeConfig.palette.saturated
          )}`}
          initialValue={angle}
          onChange={(newAngle: number) => {
            setAngle(newAngle);
          }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-5"
          style={{ top: "calc(50% - 3.25px)" }}
        >
          <input
            value={storedValue}
            onChange={handleChange}
            className="w-full text-center bg-transparent bg-none border-transparent text-lg"
          />
        </div>
      </div>
    </div>
  );
}
