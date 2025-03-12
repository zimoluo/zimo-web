"use client";

import Image from "next/image";
import KawarageAnimation from "./KawarageAnimation";
import { useSettings } from "@/components/contexts/SettingsContext";
import projectsStyle from "./projects.module.css";
import cogYangSrc from "@/public/theme/animated-background/projects/cog-yang.svg";
import cogYinSrc from "@/public/theme/animated-background/projects/cog-yin.svg";

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
              src={cogYangSrc}
              alt="Cog Yang"
              priority={true}
              className={`pointer-events-none opacity-90 ${projectsStyle.cogSize} rotate-0 ${projectsStyle.spinCog} -z-10`}
            />
          </div>
          <div
            className={`absolute pointer-events-none ${projectsStyle.cogSize} ${projectsStyle.cogYinPos}`}
          >
            <Image
              src={cogYinSrc}
              alt="Cog Yin"
              priority={true}
              className={`pointer-events-none opacity-90 ${projectsStyle.cogSize} rotate-[22.5deg] ${projectsStyle.spinCogReverse} -z-10`}
            />
          </div>
        </>
      )}
      <KawarageAnimation />
    </div>
  );
}
