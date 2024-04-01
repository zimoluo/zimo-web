import { Metadata } from "next";
import PaletteMain from "./PaletteMain";
import PaletteOther from "./PaletteOther";
import paletteStyle from "./palette.module.css";
import HeaderText from "@/components/mainPage/HeaderText";
import SettingsThemePicker from "@/components/mainPage/menu/settings/SettingsThemePicker";

export const metadata: Metadata = {
  title: "Design - Zimo Web",
  description: "Experience the color and design of Zimo Web's themes.",
  keywords:
    "Zimo Web, Zimo Luo, Color, Personal Website, Color Palette, Palette, Theme, Design",
};

export default function DesignPage() {
  return (
    <>
      <HeaderText
        title="Articulated Flow."
        subtitle="The playground of a thousand colors."
      />
      <div className="w-full px-6 md:px-14 mb-24 flex justify-center items-center">
        <div style={{ maxWidth: "50rem" }}>
          <article className="shadow-lg rounded-xl bg-widget-70 backdrop-blur-lg px-6 py-4">
            <h3 className="text-xl font-bold mb-2">Colors and Themes</h3>
            Zimo Web utilizes a meticulously selected palette of colors to
            enrich its content and overall design. Embracing a minimalist design
            philosophy, it restricts its color selection to a handful of
            choices: six primary accent hues and two special applications. This
            palette forms the foundation of Zimo Web{"\u2019"}s thematic color
            combinations. In addition to the color schemes, each theme features
            a distinct favicon variant and a beautifully crafted or animated
            background.
            <div className="px-1 py-2.5 md:py-4 mt-4">
              <SettingsThemePicker isExternal={true} />
            </div>
          </article>
        </div>
      </div>
      <div className={`${paletteStyle.page} flex flex-col mb-24`}>
        <PaletteMain />
        <PaletteOther />
      </div>
    </>
  );
}
