"use client";

import Image from "next/image";
import KawarageAnimation from "./KawarageAnimation";
import { useSettings } from "@/components/contexts/SettingsContext";
import projectsStyle from "./projects.module.css";

export default function ProjectsAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center pointer-events-none -z-10 rotate-0 ${projectsStyle.spinRevolution} select-none`}
    >
      {settings.backgroundRichness === "rich" && (
        <>
          <div
            className={`absolute pointer-events-none ${projectsStyle.cogSize} ${projectsStyle.cogYangPos}`}
          >
            <Image
              src="/theme/animated-background/projects/cog-yang.svg"
              alt="Cog Yang"
              height={600}
              width={600}
              priority={true}
              className={`pointer-events-none opacity-90 ${projectsStyle.cogSize} rotate-0 ${projectsStyle.spinCog} -z-10`}
            />
          </div>
          <div
            className={`absolute pointer-events-none ${projectsStyle.cogSize} ${projectsStyle.cogYinPos}`}
          >
            <Image
              src="/theme/animated-background/projects/cog-yin.svg"
              alt="Cog Yin"
              height={600}
              width={600}
              priority={true}
              className={`pointer-events-none opacity-90 ${projectsStyle.cogSize} rotate-22.5 ${projectsStyle.spinCogReverse} -z-10`}
            />
          </div>
        </>
      )}
      <KawarageAnimation />
    </div>
  );
}
