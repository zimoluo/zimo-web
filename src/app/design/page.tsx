import type { Metadata } from "next";
import Link from "next/link";
import { HeaderText, TextBoxMainPageLocator, TextBox, SectionTextTitle } from "@/src/features/shell";
import { DesignThemes } from "./DesignThemes";
import Palette from "./Palette";
import DesignWidgetPreview from "./DesignWidgetPreview";
import DesignBackdropCurtain from "./DesignBackdropCurtain";

export const metadata: Metadata = { title: "Design - Zimo Web", description: "Experience the color and design of Zimo Web's themes." };

export default function DesignPage() {
  return <>
    <HeaderText title="Articulated Flow." subtitle="The playground of a thousand colors." />
    <TextBoxMainPageLocator>
      <TextBox>
        <SectionTextTitle>Themes</SectionTextTitle>
        Each theme gives the site its own colors, light, and motion. Explore the collection, or make one your own.
        <DesignThemes />
      </TextBox>
      <TextBox className="mt-12">
        <SectionTextTitle>Theme Studio</SectionTextTitle>
        Shape your palette, translucent surfaces, identity mark, and animated backdrop in <Link href="/design/theme-maker" className="underline underline-offset-2">Theme Studio</Link>. Your profiles stay on this device and can sync with your account.
      </TextBox>
    </TextBoxMainPageLocator>
    <Palette />
    <TextBoxMainPageLocator>
      <TextBox>
        <SectionTextTitle>Use of Colors</SectionTextTitle>
        A palette carries through the interface and its surroundings. Named color channels connect text, controls, materials, and artwork. Each can use a shade from a ramp or a deliberate fixed color. Light and dark treatments belong to that palette; some themes keep one authored appearance.
      </TextBox>
      <TextBox className="mt-12">
        <SectionTextTitle>Principles</SectionTextTitle>
        Concentric corners, translucency, and specular highlights give the interface its rhythm. Rounded corners follow the space between layers, so a container and the elements inside it feel like parts of the same shape.
        <SectionTextTitle className="mt-6">Text Box</SectionTextTitle>
        Reading surfaces soften the backdrop with translucency and blur. A quiet outline defines their edge, leaving the text and the surrounding artwork room to breathe.
        <SectionTextTitle className="mt-6">Widgets and Windows</SectionTextTitle>
        Smaller controls catch light through gradient highlights and carefully masked borders. Shadows use the theme’s colors, while nested surfaces follow the same material and corner geometry.
        <div className="mt-8"><DesignWidgetPreview /></div>
      </TextBox>
      <TextBox className="mt-12">
        <SectionTextTitle>Backdrop</SectionTextTitle>
        Each scene develops its own motif through color and motion. Motion preferences can reduce or pause the animation. Explore the space <Link href="#backdrop-view" className="underline underline-offset-2">below</Link>.
      </TextBox>
    </TextBoxMainPageLocator>
    <DesignBackdropCurtain />
    <TextBoxMainPageLocator className="mt-24">
      <TextBox>
        <SectionTextTitle>Explore Further</SectionTextTitle>
        Follow the site’s development in the <Link href="/blog/tags/Zimo%20Web" className="underline underline-offset-2">blog</Link>, or explore other work on the <Link href="/projects" className="underline underline-offset-2">projects</Link> page.
      </TextBox>
    </TextBoxMainPageLocator>
  </>;
}
