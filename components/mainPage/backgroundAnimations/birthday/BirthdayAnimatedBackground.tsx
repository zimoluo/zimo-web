"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import BirthdayBalloon from "./BirthdayBalloon";
import Image from "next/image";
import birthdayStyle from "./birthday.module.css";
import eighteenSrc from "@/public/theme/animated-background/birthday/eighteen.svg";
import staticBalloonSrc from "@/public/theme/animated-background/birthday/static-balloon.svg";

export default function BirthdayAnimatedBackground() {
  const { settings } = useSettings();

  return settings.backgroundRichness === "rich" ? (
    <>
      <BirthdayBalloon />
      <div className="object-contain object-center fixed -z-40 inset-0 flex items-center justify-center w-screen h-screen pointer-events-none select-none">
        <Image
          src={eighteenSrc}
          alt="Eighteen"
          aria-hidden="true"
          className={`object-contain object-center -z-40 ${birthdayStyle.eighteen} pointer-events-none select-none`}
        />
      </div>
    </>
  ) : (
    <>
      <Image
        src={staticBalloonSrc}
        alt="Static balloon"
        aria-hidden="true"
        className="object-cover object-center -z-30 fixed inset-0 w-screen h-screen pointer-events-none select-none"
      />
      <div className="object-contain object-center fixed -z-20 inset-0 flex items-center justify-center w-screen h-screen pointer-events-none select-none">
        <Image
          src={eighteenSrc}
          alt="Eighteen"
          aria-hidden="true"
          className={`object-contain object-center -z-20 ${birthdayStyle.eighteen} pointer-events-none select-none`}
        />
      </div>
    </>
  );
}
