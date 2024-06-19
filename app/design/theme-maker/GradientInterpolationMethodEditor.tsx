"use client";

import UpDownSwitchIcon from "@/components/assets/entries/UpDownSwitchIcon";
import { useGradientData } from "./GradientDataContext";
import { ChangeEvent } from "react";
import { polarColorSpaces } from "@/lib/colorPaletteParser";

const SelectInput = ({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  disabled: boolean;
}) => (
  <div
    className={`flex items-center gap-2 ${
      disabled ? "opacity-50 pointer-events-none select-none" : "opacity-100"
    } transition-opacity duration-150 ease-out`}
  >
    <p>{label}</p>
    <div className="h-7 flex-grow relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-disabled={disabled}
        className="bg-none border-none appearance-none border-0 bg-pastel bg-opacity-80 shadow-sm flex-grow w-full h-full rounded-md pl-1 pr-4 py-0.5 text-start text-sm relative"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div
        className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-auto aspect-square pointer-events-none select-none"
        aria-hidden="true"
      >
        <UpDownSwitchIcon className="rotate-180" />
      </div>
    </div>
  </div>
);

export default function GradientInterpolationMethodEditor() {
  const { selectedLayer, updateColorInterpolationData } = useGradientData();

  const changeColorSpace = (event: ChangeEvent<HTMLSelectElement>) => {
    const newKeyword = event.target.value as GradientColorSpace;
    if (newKeyword === selectedLayer.colorInterpolation?.colorSpace) {
      return;
    }

    updateColorInterpolationData("colorSpace", newKeyword);
  };

  const changeHueInterpolation = (event: ChangeEvent<HTMLSelectElement>) => {
    const newKeyword = event.target.value as HueInterpolationMethod;
    if (
      newKeyword === selectedLayer.colorInterpolation?.hueInterpolationMethod
    ) {
      return;
    }

    updateColorInterpolationData("hueInterpolationMethod", newKeyword);
  };

  const colorSpace: GradientColorSpace | "default" =
    selectedLayer.colorInterpolation?.colorSpace ?? "default";

  const isPolarSpace = polarColorSpaces.includes(colorSpace as any);

  return (
    <div className="rounded-xl bg-light bg-opacity-80 shadow-lg p-4 flex flex-col justify-center gap-2 h-full text-sm">
      <SelectInput
        label="Color space"
        value={colorSpace}
        onChange={changeColorSpace}
        options={[
          { value: "default", label: "Default" },
          { value: "srgb", label: "SRGB" },
          { value: "display-p3", label: "Display P3" },
          { value: "oklab", label: "OKLAB" },
          { value: "lch", label: "LCH" },
        ]}
        disabled={false}
      />
      <SelectInput
        label="Hue interpolation"
        value={
          selectedLayer.colorInterpolation?.hueInterpolationMethod ?? "shorter"
        }
        onChange={changeHueInterpolation}
        options={[
          { value: "shorter", label: "Shorter hue" },
          { value: "longer", label: "Longer hue" },
          { value: "increasing", label: "Increasing hue" },
          { value: "decreasing", label: "Decreasing hue" },
        ]}
        disabled={!isPolarSpace}
      />
    </div>
  );
}
