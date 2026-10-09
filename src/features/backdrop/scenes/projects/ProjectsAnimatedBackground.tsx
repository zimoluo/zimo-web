"use client";

import type { SceneComponentProps } from "../../contract";

import Image from "next/image";
import KawarageAnimation from "./KawarageAnimation";
import projectsStyle from "./projects.module.css";
const cogYangSrc = { src: "/theme/animated-background/projects/cog-yang.svg", width: 1024, height: 1024 };
const cogYinSrc = { src: "/theme/animated-background/projects/cog-yin.svg", width: 1024, height: 1024 };

export default function ProjectsAnimatedBackground({ quality, params }: SceneComponentProps) {

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center pointer-events-none  rotate-0 ${projectsStyle.spinRevolution} select-none`}
    >
      {quality === "rich" && (
        <>
          <div
            className={`absolute pointer-events-none ${projectsStyle.cogSize}  ${projectsStyle.cogYangPos}`}
          >
            <Image
              src={cogYangSrc}
              alt="Cog Yang"
              priority={true}
              className={`pointer-events-none opacity-90 ${projectsStyle.cogSize} rotate-0 ${projectsStyle.spinCog} `}
            />
          </div>
          <div
            className={`absolute pointer-events-none ${projectsStyle.cogSize}  ${projectsStyle.cogYinPos}`}
          >
            <Image
              src={cogYinSrc}
              alt="Cog Yin"
              priority={true}
              className={`pointer-events-none opacity-90 ${projectsStyle.cogSize} rotate-[22.5deg] ${projectsStyle.spinCogReverse} `}
            />
          </div>
        </>
      )}
      <KawarageAnimation quality={quality} params={params} palette={ {} } />
    </div>
  );
}
