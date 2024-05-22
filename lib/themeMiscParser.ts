import { defaultThemeMiscConfig } from "./constants/defaultThemeMiscConfig";

export function generateThemeMiscInlineStyle(
  miscData: ThemeMiscOptions
): Record<string, string> {
  const generatedStyles: Record<string, string> = {};
  const rawMiscData: ThemeMiscOptions = {
    ...defaultThemeMiscConfig,
    ...miscData,
  };

  generatedStyles["--reading-blur"] = `${rawMiscData.readingBlur}px`;

  return generatedStyles;
}
