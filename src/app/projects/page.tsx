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
        title="The Shape of Unseen Days."
        subtitle="A record less frequently updated."
      />
      <ProjectsTileGrid />
    </>
  );
}

export const revalidate = 24;
