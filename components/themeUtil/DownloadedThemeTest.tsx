import { getColorPaletteStyle } from "@/lib/dataLayer/server/themeFetcher";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export default async function DownloadedThemeTest({ children }: Props) {
  return <div style={await getColorPaletteStyle("cake")}>{children}</div>;
}
