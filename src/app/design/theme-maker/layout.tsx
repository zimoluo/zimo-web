import ReadingBlur from "@/components/widgets/ReadingBlur";
import ThemeMakerWindow from "./ThemeMakerWindow";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Theme Maker - Zimo Web",
  description:
    "Customize the appearance and the aesthetics of Zimo Web using theme profiles.",
  keywords:
    "Zimo Web, Zimo Luo, Color, Personal Website, Color Palette, Palette, Theme, Design, Editor, Web app, Theme Editor, Theme Maker, Interactive, Responsive, Online editor",
};

export default function ThemeMakerLayout() {
  return (
    <>
      <ReadingBlur className="md:hidden" />
      <ThemeMakerWindow />
    </>
  );
}
