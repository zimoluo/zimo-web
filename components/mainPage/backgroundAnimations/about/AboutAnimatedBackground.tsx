"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import aboutStyle from "./about.module.css";
import zimoVertical from "@/public/theme/animated-background/about/zimo-vertical.svg";
import zimoVerticalMobile from "@/public/theme/animated-background/about/zimo-vertical-mobile.svg";

export default function AboutAnimatedBackground() {
  const pathname = usePathname();

  return (
    pathname === "/about" && (
      <>
        <div
          className="absolute left-0 top-0 -z-20 pointer-events-none select-none hidden md:block"
          aria-hidden="true"
        >
          <Image
            src={zimoVertical}
            alt="Zimo Vertical"
            className={`object-cover ${aboutStyle.size} opacity-80`}
            priority={true}
            aria-hidden="true"
          />
        </div>
        <div
          className="absolute left-0 top-0 -z-20 pointer-events-none select-none md:hidden"
          aria-hidden="true"
        >
          <Image
            src={zimoVerticalMobile}
            alt="Zimo Vertical"
            className={`object-cover ${aboutStyle.mobile} opacity-60`}
            priority={true}
            aria-hidden="true"
          />
        </div>
      </>
    )
  );
}
