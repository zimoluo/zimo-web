"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import CircularSlider from "./CircularSlider";
import { useFaviconEditor } from "./FaviconEditorContext";
import { isStringNumber, modInRange } from "@/lib/generalHelper";
import { useInputParser } from "@/lib/helperHooks";

export default function FaviconAngleEditor() {
  const {
    selectedAngle,
    faviconGradient,
    faviconGradientStopsIdentifierIndex,
  } = useFaviconEditor();
  const { updateFaviconConfig } = useSettings();

  const angle = selectedAngle;
  const setAngle = (newAngle: number) => {
    const safeAngle = Math.round(modInRange(newAngle || 0, 360));
    const newGradientConfig = structuredClone(faviconGradient);
    newGradientConfig[faviconGradientStopsIdentifierIndex].angle = safeAngle;
    updateFaviconConfig({ gradient: newGradientConfig }, false);
  };

  const [storedValue, handleChange] = useInputParser<number>({
    value: angle,
    setValue: setAngle,
    isValid: isStringNumber,
    formatValue: (rawInput: string) => modInRange(parseFloat(rawInput), 360),
  });

  return (
    <div className="rounded-xl bg-light bg-opacity-80 shadow-lg h-[7.5rem] p-4 flex items-center justify-center">
      <div className="w-auto aspect-square h-full relative flex">
        <CircularSlider
          startPosition={90}
          value={angle}
          onChange={setAngle}
          dimension="100%"
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: "40%" }}
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
