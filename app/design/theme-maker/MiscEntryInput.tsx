"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { isStringNumber } from "@/lib/generalHelper";
import { useInputParser } from "@/lib/helperHooks";

interface Props {
  entry: keyof ThemeMiscOptions;
}

const entryDataMap: Record<
  keyof ThemeMiscOptions,
  { name: string; defaultValue: number }
> = {
  readingBlur: {
    name: "Reading blur",
    defaultValue: 8,
  },
};

export default function MiscEntryInput({ entry }: Props) {
  const { currentCustomThemeConfig, updateThemeMisc } = useSettings();

  const { defaultValue } = entryDataMap[entry];

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
      Math.round(Math.max(0, parseFloat(rawString))),
  });

  return (
    <div className="w-full flex items-center justify-center gap-3">
      <p>{entryDataMap[entry].name}</p>
      <input
        className="rounded-md bg-pastel bg-opacity-80 py-1 px-1.5 w-full text-center"
        value={storedValue}
        onChange={handleChange}
      />
    </div>
  );
}
