"use client";

import type { SceneComponentProps } from "../../contract";

import Image from "next/image";
import BlogPainting from "./BlogPainting";
import blogStyle from "./blog.module.css";
const eunoeTextSrc = { src: "/theme/animated-background/blog/eunoe-text.svg", width: 1920, height: 1920 };
const baseGlowSrc = { src: "/theme/animated-background/blog/base-glow.svg", width: 1920, height: 1920 };
const baseOrbSrc = { src: "/theme/animated-background/blog/base-orb.svg", width: 1920, height: 1920 };

export default function BlogAnimatedBackground({ params, quality }: SceneComponentProps) {

  return (
    <>
      <div className="fixed inset-0  flex items-center justify-center h-screen pointer-events-none opacity-40 select-none">
        <Image
          src={eunoeTextSrc}
          alt="Eunoe Text"
          className="object-cover w-full h-full"
          priority={true}
        />
      </div>

      {quality === "rich" && (
        <div className="fixed inset-0 flex justify-center items-center pointer-events-none  select-none">
          <Image
            src={baseGlowSrc}
            alt="Blog Painting"
            className={`absolute pointer-events-none ${blogStyle.size}  ${blogStyle.glow}`}
            priority={true}
          />
          <Image
            src={baseOrbSrc}
            alt="Blog Painting"
            className={`absolute pointer-events-none ${blogStyle.size}`}
            priority={true}
          />
          {params.painting !== false && <BlogPainting />}
        </div>
      )}
    </>
  );
}
