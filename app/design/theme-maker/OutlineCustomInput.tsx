"use client";

import { useInputParser } from "@/lib/helperHooks";
import { useFaviconEditor } from "./FaviconEditorContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import colorConvert from "color-convert";
import selectorStyle from "./outline-selector.module.css";

const { rgb } = colorConvert;

export default function OutlineCustomInput() {
  const { faviconConfig } = useFaviconEditor();
  const { updateFaviconConfig, currentCustomThemeConfig } = useSettings();
  const isDisabled = !(faviconConfig.outline ?? "primary").startsWith("#");

  const value = isDisabled
    ? faviconConfig.outline === "site"
      ? currentCustomThemeConfig.siteThemeColor
      : `#${rgb.hex(
          currentCustomThemeConfig.palette[
            (faviconConfig.outline ?? "primary") as Exclude<
              AccentColors,
              "site"
            >
          ]
        )}`
    : faviconConfig.outline ?? "";
  const setValue = (newValue: string) => {
    updateFaviconConfig({
      outline: (newValue.trim().startsWith("#") ? newValue : `#${newValue}`)
        .trim()
        .toLowerCase() as HexColor,
    });
  };

  const [storedValue, handleChange] = useInputParser<string>({
    value,
    setValue,
    isValid: (rawString: string) => /^(#?)[A-Fa-f0-9]{6}$/.test(rawString),
    formatValue: (rawString: string) => rawString.trim().toUpperCase(),
  });

  return (
    <div
      className={`bg-light bg-opacity-80 rounded-xl shadow-lg w-full ${
        selectorStyle.input
      } items-center justify-center gap-3 px-4 h-13 ${
        isDisabled ? "select-none pointer-events-none" : ""
      }`}
      aria-disabled={isDisabled}
    >
      <p
        className={`transition-opacity duration-300 ease-out ${
          isDisabled ? "opacity-50" : "opacity-100"
        }`}
      >
        Hex
      </p>
      <div className="flex-grow">
        <input
          className={`bg-none bg-pastel bg-opacity-80 shadow-sm w-full h-auto rounded-md px-1 py-0.5 text-center transition-opacity duration-300 ease-out ${
            isDisabled ? "opacity-50" : "opacity-100"
          }`}
          disabled={isDisabled}
          value={storedValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
