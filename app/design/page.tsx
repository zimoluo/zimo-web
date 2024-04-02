import { Metadata } from "next";
import PaletteMain from "./PaletteMain";
import PaletteOther from "./PaletteOther";
import paletteStyle from "./palette.module.css";
import HeaderText from "@/components/mainPage/HeaderText";
import SettingsThemePicker from "@/components/mainPage/menu/settings/SettingsThemePicker";
import TextBoxMainPageLocator from "@/components/mainPage/textBox/TextBoxMainPageLocator";
import TextBox from "@/components/mainPage/textBox/TextBox";
import TextBoxTitle from "@/components/mainPage/textBox/TextBoxTitle";

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
      <TextBoxMainPageLocator>
        <TextBox>
          <TextBoxTitle>Colors and Themes</TextBoxTitle>
          Zimo Web utilizes a meticulously selected palette of colors to enrich
          its content and overall design. Embracing a minimalist design
          philosophy, it restricts its color selection to a handful of choices:
          six primary accent hues and two special applications. This palette
          forms the foundation of Zimo Web{"\u2019"}s thematic color
          combinations. In addition to the color schemes, each theme features a
          distinct favicon variant and a beautifully crafted or animated
          background.
          <div className="px-1 py-2.5 md:py-4 mt-4">
            <SettingsThemePicker isExternal={true} />
          </div>
        </TextBox>
      </TextBoxMainPageLocator>
      <section className={`${paletteStyle.page} flex flex-col mb-24`}>
        <PaletteMain />
        <PaletteOther />
      </section>
      <TextBoxMainPageLocator>
        <TextBox>
          <TextBoxTitle>Text Box</TextBoxTitle>
          While most text elements on Zimo Web are displayed in the six primary
          tones, these texts are often encased in translucent, rounded-corner
          containers with a blur effect to stand out against the background.
          These containers use the widget special color for their backdrop,
          serving as the primary means to hold text and differentiate it from
          the contrasting and rich background. This design feature is a
          ubiquitous element throughout the site, providing a consistent and
          distinctive visual theme.
        </TextBox>
      </TextBoxMainPageLocator>
    </>
  );
}
