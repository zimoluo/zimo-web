"use client";

import zimoTextStyle from "./zimo-text.module.css";
import Image from "next/image";
import { useTheme } from "../../theme";
import { useSettings } from "../../settings";

export default function AboutZimoText() {
  const themeKey = useTheme((state) => state.active.kind === "builtIn" ? state.active.id : "profile");
  const motion = useSettings((state) => state.motion.backdrop);

  return (
    motion !== "off" &&
    themeKey === "about" &&
    (
      <>
        <div
          className="absolute left-4 top-4 -z-20 pointer-events-none select-none hidden md:block"
          aria-hidden="true"
        >
          <Image
            src="/page/about/zimo-vertical.svg" width={212} height={150}
            alt="Zimo Vertical Text"
            className={`object-cover ${zimoTextStyle.size} opacity-80`}
          />
        </div>
        <div
          className="absolute left-4 top-4 -z-20 pointer-events-none select-none md:hidden"
          aria-hidden="true"
        >
          <Image
            src="/page/about/zimo-vertical-mobile.svg" width={134} height={160}
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
