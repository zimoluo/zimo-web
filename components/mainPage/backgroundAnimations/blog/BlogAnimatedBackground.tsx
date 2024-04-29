"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import Image from "next/image";
import BlogPainting from "./BlogPainting";
import blogStyle from "./blog.module.css";

export default function BlogAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <>
      <div className="fixed inset-0 -z-20 flex items-center justify-center h-screen pointer-events-none opacity-40 select-none">
        <Image
          src="/theme/animated-background/blog/eunoe-text.svg"
          alt="Eunoe Text"
          height={1000}
          width={1000}
          className="object-cover w-full h-full"
          priority={true}
        />
      </div>

      {settings.backgroundRichness === "rich" && (
        <div className="fixed inset-0 flex justify-center items-center pointer-events-none -z-10 select-none">
          <Image
            src="/theme/animated-background/blog/base-glow.svg"
            alt="Blog Painting"
            height="0"
            width="0"
            className={`absolute pointer-events-none ${blogStyle.size} ${blogStyle.glow}`}
            priority={true}
          />
          <Image
            src="/theme/animated-background/blog/base-orb.svg"
            alt="Blog Painting"
            height="0"
            width="0"
            className={`absolute pointer-events-none ${blogStyle.size}`}
            priority={true}
          />
          {!settings.disableCenterPainting && <BlogPainting />}
        </div>
      )}
    </>
  );
}
