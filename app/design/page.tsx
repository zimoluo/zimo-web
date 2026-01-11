import { Metadata } from "next";
import PaletteMain from "./PaletteMain";
import PaletteOther from "./PaletteOther";
import paletteStyle from "./palette.module.css";
import HeaderText from "@/components/mainPage/HeaderText";
import SettingsThemePicker from "@/components/mainPage/menu/settings/SettingsThemePicker";
import TextBoxMainPageLocator from "@/components/mainPage/textBox/TextBoxMainPageLocator";
import TextBox from "@/components/mainPage/textBox/TextBox";
import SectionTextTitle from "@/components/mainPage/textBox/SectionTextTitle";
import DesignWidgetPreview from "./DesignWidgetPreview";
import DesignBackdropCurtain from "./DesignBackdropCurtain";
import Link from "next/link";
import FaviconsGallery from "./FaviconsGallery";
import ThemeProfileSelector from "./theme-maker/ThemeProfileSelector";

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
          <SectionTextTitle>Themes</SectionTextTitle>
          Zimo Web stands out for its freedom in defining the website{"\u2019"}s
          appearance. Each element, from the color of a simple widget to the
          backdrop, exudes its own personality. Throughout its development, Zimo
          Web has showcased a variety of themes, which can be directly
          appreciated or used as inspiration for creating your own look.
          Additionally, explore the specific design philosophies employed by
          Zimo Web to gain a deeper understanding of its theming.
          <div className="px-1 py-2.5 md:py-4 mt-4">
            <SettingsThemePicker />
          </div>
        </TextBox>
        <TextBox className="mt-12">
          <SectionTextTitle>Theme Maker</SectionTextTitle>
          Zimo Web{"\u2019"}s true power of design lies in your hands. Shape the
          site{"\u2019"}s appearance with the{" "}
          <Link
            href="/design/theme-maker"
            className="underline underline-offset-2"
          >
            Theme Maker
          </Link>{" "}
          and craft your unique virtual experience. Your custom designs are
          saved as profiles, with finely curated templates available to spark
          your creativity.
          <div className="px-2.5 py-2.5 md:py-4 mt-4">
            <ThemeProfileSelector applyThemeDataConfig={true} />
          </div>
        </TextBox>
        <TextBox className="mt-12">
          <SectionTextTitle>Use of Colors</SectionTextTitle>
          Zimo Web utilizes a meticulously selected palette of colors to enrich
          its content and overall design. It restricts its color selection to
          four primary accent hues and two special gradients. The theme engine
          then calculates brighter tones of these accents to create vivid
          specular highlights that preserve their original hue. This palette
          forms the foundation of Zimo Web{"\u2019"}s thematic color
          combinations.
        </TextBox>
      </TextBoxMainPageLocator>
      <section className={`${paletteStyle.page} flex flex-col mb-24`}>
        <PaletteMain />
        <PaletteOther />
      </section>
      <TextBoxMainPageLocator>
        <TextBox>
          <SectionTextTitle>Translucency</SectionTextTitle>
          Zimo Web{"\u2019"}s design philosophy is built upon concentricity,
          translucency, and specular highlighting. Moving beyond simple
          transparency, the interface employs a vivid, glass-like aesthetic.
          Rounded corners are carefully refined to be concentric, creating a
          harmonious and joyful visual rhythm throughout the site.
          <SectionTextTitle className="mt-6">Text Box</SectionTextTitle>
          Text elements on Zimo Web are often encased in translucent containers
          that utilize the signature blur effect to stand out against the
          background. To distinguish these larger elements without impacting
          performance, subtle outlines are used instead of heavy highlights.
          These containers serve as the primary means to hold text,
          differentiating it from the contrasting and rich background while
          maintaining a cohesive, elegant look.
          <SectionTextTitle className="mt-6">
            Widgets and Windows
          </SectionTextTitle>
          The same design philosophy extends to the widgets and windows
          framework. Smaller elements, such as buttons feature specular
          highlights created with gradients and masking to add depth and
          vibrancy. Although layouts vary, all widgets and windows align
          visually to achieve a coherent palette.
          <div
            className="pointer-events-none select-none h-8"
            aria-hidden="true"
          />
          <DesignWidgetPreview />
        </TextBox>
        <TextBox className="mt-12">
          <SectionTextTitle>Favicon</SectionTextTitle>
          Zimo Web maintains a consistent identity, particularly reflected in
          its design of favicons. The favicon of Zimo Web features a simple
          circular pattern, but each theme gives it a unique coloring and feel.
          In addition to the signature favicon, which showcases three distinct
          color schemes, there are many others, each with its own distinct
          personality.
          <FaviconsGallery className="mt-6 mb-4" />
        </TextBox>
        <TextBox className="mt-12">
          <SectionTextTitle>Backdrop</SectionTextTitle>
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
          <SectionTextTitle>Explore Further</SectionTextTitle>
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
