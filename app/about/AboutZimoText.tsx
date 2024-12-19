"use client";

import zimoVerticalSrc from "@/public/page/about/zimo-vertical.svg";
import zimoVerticalMobileSrc from "@/public/page/about/zimo-vertical-mobile.svg";
import zimoTextStyle from "./zimo-text.module.css";
import Image from "next/image";
import { useTheme } from "@/components/contexts/ThemeContext";
import { useSettings } from "@/components/contexts/SettingsContext";

export default function AboutZimoText() {
  const { themeKey } = useTheme();
  const { settings } = useSettings();

  return (
    settings.backgroundRichness !== "minimal" &&
    themeKey === "about" && (
      <>
        <div
          className="absolute left-4 top-4 -z-20 pointer-events-none select-none hidden md:block"
          aria-hidden="true"
        >
          <Image
            src={zimoVerticalSrc}
            alt="Zimo Vertical Text"
            className={`object-cover ${zimoTextStyle.size} opacity-80`}
          />
        </div>
        <div
          className="absolute left-4 top-4 -z-20 pointer-events-none select-none md:hidden"
          aria-hidden="true"
        >
          <Image
            src={zimoVerticalMobileSrc}
            alt="Zimo Vertical"
            className={`object-cover ${zimoTextStyle.mobile} opacity-60`}
            priority={true}
            aria-hidden="true"
          />
        </div>
      </>
    )
  );
}
