import { Metadata } from "next";
import PaletteMain from "./PaletteMain";
import PaletteOther from "./PaletteOther";

export const metadata: Metadata = {
  title: "Palette - Zimo Web",
  description: "Test the color palette of Zimo Web's themes.",
  keywords:
    "Zimo Web, Zimo Luo, Color, Personal Website, Color Palette, Palette",
};

export default function PalettePage() {
  return (
    <div className="h-screen flex flex-col">
      <PaletteMain />
      <PaletteOther />
    </div>
  );
}
