import { AboutContent } from "@/src/features/about";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Zimo Web",
  description: "Information regarding Zimo Web.",
};

export default function AboutPage() { return <AboutContent />; }
export const revalidate = 30;
