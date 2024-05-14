"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { useInputParser } from "@/lib/helperHooks";
import { useGradientData } from "./GradientDataContext";
import { isStringNumber } from "@/lib/generalHelper";
import CircularSlider from "./CircularSlider";

function angleToNumber(degString: string): number {
  const regex = /^(-?\d*\.?\d+)(deg)?$/;
  const match = degString.match(regex);

  if (match) {
    return parseFloat(match[1]);
  } else {
    return 0;
  }
}

function modInRange(a: number, b: number): number {
  const quotient = Math.floor(a / b);
  const result = a - quotient * b;
  return result < 0 ? result + b : result;
}

export default function AngleDataInput() {
  const { updateGradientData } = useSettings();
  const {
    selectedLayer,
    currentLayerIndex,
    selectedGradientCategory,
    thisLayerGradient,
  } = useGradientData();
  const currentGradient = thisLayerGradient;

  const angle: number = angleToNumber(currentGradient.angle ?? "0deg");
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
    formatValue: (rawInput: string) => modInRange(parseFloat(rawInput), 360),
  });

  return (
    <div>
      <p className="text-center mb-1">Angle</p>
      <div className="relative">
        <div className="relative flex items-center justify-center">
          <CircularSlider
            dimension="45%"
            startPosition={90}
            value={angle}
            onChange={(newAngle: number) => {
              setAngle(Math.round(newAngle));
            }}
          />
        </div>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: "16%" }}
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
