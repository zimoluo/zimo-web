"use client";

import { useInputParser } from "@/lib/helperHooks";
import { useGradientData } from "./GradientDataContext";
import { isStringNumber, modInRange } from "@/lib/generalHelper";
import CircularSlider from "./CircularSlider";

interface Props {
  className?: string;
  dimensionConfig?: string;
  heightBased?: boolean;
  title?: string;
}

export default function AngleDataInput({
  className = "",
  dimensionConfig = "45%",
  heightBased = false,
  title = "Angle",
}: Props) {
  const { updateGradientProperty, selectedLayer } = useGradientData();

  const angle = selectedLayer.angle || 0; // use || instead of ?? to prevent NaN

  const setAngle = (newAngle: number) =>
    updateGradientProperty("angle", newAngle, false);

  const [storedValue, handleChange] = useInputParser<number>({
    value: angle,
    setValue: setAngle,
    isValid: isStringNumber,
    formatValue: (rawInput: string) => modInRange(parseFloat(rawInput), 360),
  });

  return (
    <div className={`${className}`}>
      <p className="text-center mb-1">{title}</p>
      <div className="relative">
        <div className="relative flex items-center justify-center">
          <CircularSlider
            dimension={dimensionConfig}
            heightBased={heightBased}
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
