"use client";

import type { ThemeMiscOptions } from "@/src/features/theme/model/v10-types";
import { useSettings } from "@/components/contexts/SettingsContext";
import { defaultThemeMiscConfig } from "@/lib/constants/defaultThemeMiscConfig";
import { isStringNumber } from "@/lib/generalHelper";
import { useInputParser } from "@/lib/helperHooks";

interface Props {
  entry: keyof ThemeMiscOptions;
}

const entryNameMap: Record<keyof ThemeMiscOptions, string> = {
  readingBlur: "Article blur",
};

export default function MiscEntryInput({ entry }: Props) {
  const { currentCustomThemeConfig, updateThemeMisc } = useSettings();

  const defaultValue = defaultThemeMiscConfig[entry];

  const value = currentCustomThemeConfig.misc
    ? currentCustomThemeConfig.misc.readingBlur ?? defaultValue
    : defaultValue;

  const setValue = (newValue: number) => {
    updateThemeMisc({ [entry]: newValue });
  };

  const [storedValue, handleChange] = useInputParser<number>({
    value,
    setValue,
    isValid: isStringNumber,
    formatValue: (rawString: string) =>
      Math.round(Math.max(0, parseFloat(rawString))) || 0,
  });

  return (
    <div className="w-full flex items-center justify-center gap-3">
      <p>{entryNameMap[entry]}</p>
      <input
        className="rounded-md bg-fill/80 shadow-xs py-1 px-1.5 w-full text-center"
        value={storedValue}
        onChange={handleChange}
      />
    </div>
  );
}
