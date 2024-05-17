export function generateThemeMiscInlineStyle(
  miscData: ThemeMiscOptions
): Record<string, string> {
  const generatedStyles: Record<string, string> = {};

  if (miscData.readingBlur !== undefined) {
    generatedStyles["--reading-blur"] = `${miscData.readingBlur}px`;
  }

  return generatedStyles;
}
