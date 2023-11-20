import HeaderText from "@/components/mainPage/HeaderText";
import ProjectsTileGrid from "./ProjectsTileGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Zimo Web",
  description: "The personal display of projects of Zimo.",
};

export default async function ProjectsPage() {
  return (
    <>
      <HeaderText
        title="Machina et Artes, Manus Dei Hominum."
        subtitle="Light emits from the power of creation."
      />
      <ProjectsTileGrid />
    </>
  );
}

export const revalidate = 24;
