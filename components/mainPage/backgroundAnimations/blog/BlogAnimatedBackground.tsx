"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import Image from "next/image";
import BlogPainting from "./BlogPainting";
import blogStyle from "./blog.module.css";
import eunoeTextSrc from "@/public/theme/animated-background/blog/eunoe-text.svg";
import baseGlowSrc from "@/public/theme/animated-background/blog/base-glow.svg";
import baseOrbSrc from "@/public/theme/animated-background/blog/base-orb.svg";

export default function BlogAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <>
      <div className="fixed inset-0 -z-20 flex items-center justify-center h-screen pointer-events-none opacity-40 select-none">
        <Image
          src={eunoeTextSrc}
          alt="Eunoe Text"
          className="object-cover w-full h-full"
          priority={true}
        />
      </div>

      {settings.backgroundRichness === "rich" && (
        <div className="fixed inset-0 flex justify-center items-center pointer-events-none -z-10 select-none">
          <Image
            src={baseGlowSrc}
            alt="Blog Painting"
            className={`absolute pointer-events-none ${blogStyle.size} ${blogStyle.glow}`}
            priority={true}
          />
          <Image
            src={baseOrbSrc}
            alt="Blog Painting"
            className={`absolute pointer-events-none ${blogStyle.size}`}
            priority={true}
          />
          {!settings.disableCenterPainting && <BlogPainting />}
        </div>
      )}
    </>
  );
}
