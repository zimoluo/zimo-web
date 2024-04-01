import { Metadata } from "next";
import PaletteMain from "./PaletteMain";
import PaletteOther from "./PaletteOther";
import paletteStyle from "./palette.module.css";
import HeaderText from "@/components/mainPage/HeaderText";

export const metadata: Metadata = {
  title: "Palette - Zimo Web",
  description: "Test the color palette of Zimo Web's themes.",
  keywords:
    "Zimo Web, Zimo Luo, Color, Personal Website, Color Palette, Palette, Theme",
};

export default function PalettePage() {
  return (
    <>
      <HeaderText
        title="Articulated Flow."
        subtitle="The playground of a thousand colors."
      />
      <div className={`${paletteStyle.page} flex flex-col`}>
        <PaletteMain />
        <PaletteOther />
      </div>
    </>
  );
}
