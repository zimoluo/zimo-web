import { Metadata } from "next";
import PaletteMain from "./PaletteMain";
import PaletteOther from "./PaletteOther";
import paletteStyle from "./palette.module.css";
import HeaderText from "@/components/mainPage/HeaderText";
import SettingsThemePicker from "@/components/mainPage/menu/settings/SettingsThemePicker";
import TextBoxMainPageLocator from "@/components/mainPage/textBox/TextBoxMainPageLocator";
import TextBox from "@/components/mainPage/textBox/TextBox";
import TextBoxTitle from "@/components/mainPage/textBox/TextBoxTitle";
import DesignWidgetPreview from "./DesignWidgetPreview";
import DesignBackdropCurtain from "./DesignBackdropCurtain";
import Link from "next/link";
import FaviconsGallery from "./FaviconsGallery";

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
            <SettingsThemePicker />
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
          <TextBoxTitle className="mt-6">Transparency</TextBoxTitle>
          Most of Zimo Web{"\u2019"}s themes employ transparency to achieve a
          modern, simplistic, and layered design philosophy. Despite general
          conventions, some themes that embrace flat design choose to forego
          transparency and use opaque layers for text boxes instead. However,
          the translucent art style remains Zimo Web{"\u2019"}s primary design
          style for the original and most other themes.
          <TextBoxTitle className="mt-6">Widgets</TextBoxTitle>
          Aside from text boxes, the same design philosophy is utilized in most
          widgets that Zimo Web employs for its functionalities. While varying
          slightly, almost all of them appear consistent with text boxes, thus
          achieving a coherent design palette across the site.
          <div
            className="pointer-events-none select-none h-8"
            aria-hidden="true"
          />
          <DesignWidgetPreview />
        </TextBox>
        <TextBox className="mt-12">
          <TextBoxTitle>Favicon</TextBoxTitle>
          Zimo Web maintains a consistent identity, particularly reflected in
          its design of favicons. The favicon of Zimo Web features a simple
          circular pattern, but each theme gives it a unique coloring and feel.
          In addition to the signature favicon, which showcases three distinct
          color schemes, there are many others, each with its own distinct
          personality.
          <FaviconsGallery className="mt-6 mb-4" />
        </TextBox>
        <TextBox className="mt-12">
          <TextBoxTitle>Backdrop</TextBoxTitle>
          Zimo Web employs diverse backgrounds to enhance the browsing
          experience. They often adopt a specific color or object as a theme and
          expand on it with a range of vector graphics, complementing the theme
          {"\u2019"}s color palette. Many themes feature animated backgrounds;
          the masterfully designed animations add to the satisfaction of the
          reading experience. Feel the vast yet enriched backdrop space{" "}
          <Link href="#backdrop-view" className="underline underline-offset-2">
            below
          </Link>
          .
        </TextBox>
      </TextBoxMainPageLocator>
      <DesignBackdropCurtain />
      <TextBoxMainPageLocator className="mt-24">
        <TextBox>
          <TextBoxTitle>Explore Further</TextBoxTitle>
          This page provides a brief overview of Zimo Web{"\u2019"}s design
          philosophy and its elements. For more information on Zimo Web
          {"\u2019"}s design, check out the{" "}
          <Link
            href="/blog/tags/Zimo%20Web"
            className="underline underline-offset-2"
          >
            blog topic
          </Link>{" "}
          about its development. Visit the{" "}
          <Link href="/projects" className="underline underline-offset-2">
            projects
          </Link>{" "}
          page to explore other projects from the author.
        </TextBox>
      </TextBoxMainPageLocator>
    </>
  );
}
