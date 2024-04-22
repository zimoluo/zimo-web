import { getColorPaletteStyle } from "@/lib/dataLayer/server/themeServerManager";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export default async function ColorMapFetcher({ children }: Props) {
  return <div style={await getColorPaletteStyle("cake")}>{children}</div>;
}
