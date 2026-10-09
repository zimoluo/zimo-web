import type { Metadata } from "next";
import Link from "next/link";
import HeaderText from "@/components/mainPage/HeaderText";
import TextBoxMainPageLocator from "@/components/mainPage/textBox/TextBoxMainPageLocator";
import TextBox from "@/components/mainPage/textBox/TextBox";
import SectionTextTitle from "@/components/mainPage/textBox/SectionTextTitle";
import { DesignThemes } from "./DesignThemes";
import DesignWidgetPreview from "./DesignWidgetPreview";
import DesignBackdropCurtain from "./DesignBackdropCurtain";
export const metadata: Metadata = { title: "Design - Zimo Web", description: "Experience the color and design of Zimo Web's themes." };
export default function DesignPage() { return <><HeaderText title="Articulated Flow." subtitle="The playground of a thousand colors." /><TextBoxMainPageLocator><TextBox><SectionTextTitle>Themes</SectionTextTitle>Every theme gives the site its own colors, light, and motion. Explore the collection, or make one your own.<DesignThemes /></TextBox><TextBox className="mt-12"><SectionTextTitle>Theme Studio</SectionTextTitle>Shape your palette, translucent surfaces, identity mark, and animated backdrop in <Link href="/design/theme-maker" className="underline">Theme Studio</Link>. Your profiles stay on this device and can sync with your account.</TextBox><TextBox className="mt-12"><SectionTextTitle>Principles</SectionTextTitle>Concentric corners, translucent surfaces, and specular highlights give the interface its rhythm. A shared palette carries through text, windows, and the backdrop.<div className="mt-8"><DesignWidgetPreview /></div></TextBox><TextBox className="mt-12"><SectionTextTitle>Backdrop</SectionTextTitle>Each scene develops its own motif through color and motion. Motion preferences can reduce or pause the animation.</TextBox></TextBoxMainPageLocator><DesignBackdropCurtain /></>; }
