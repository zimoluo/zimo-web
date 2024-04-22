import { ReactNode } from "react";
import { allListedColorPalettes } from "./listedThemesMap";
import { getColorPaletteStyle } from "@/lib/dataLayer/server/colorPaletteFetcher";
import ThemeDataInitializer from "./ThemeDataInitializer";

interface Props {
  children?: ReactNode;
}

async function generateColorPaletteMap(palettes: string[]) {
  const map: ColorMap = {} as any;
  for (const palette of palettes) {
    map[palette as ThemePalette] = await getColorPaletteStyle(palette);
  }
  return map;
}

export default async function ColorPaletteInitializer({ children }: Props) {
  const fetchedColorMap = await generateColorPaletteMap(allListedColorPalettes);

  return (
    <ThemeDataInitializer fetchedColorMap={fetchedColorMap}>
      {children}
    </ThemeDataInitializer>
  );
}
