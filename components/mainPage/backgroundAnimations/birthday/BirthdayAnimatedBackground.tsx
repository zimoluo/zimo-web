"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import BirthdayBalloon from "./BirthdayBalloon";
import Image from "next/image";
import birthdayStyle from "./birthday.module.css";

export default function BirthdayAnimatedBackground() {
  const { settings } = useSettings();

  return settings.backgroundRichness === "rich" ? (
    <>
      <BirthdayBalloon />
      <div className="object-contain object-center fixed -z-40 inset-0 flex items-center justify-center w-screen h-screen pointer-events-none select-none">
        <Image
          src="/theme/animated-background/birthday/eighteen.svg"
          height={300}
          width={300}
          alt="Eighteen"
          aria-hidden="true"
          className={`object-contain object-center -z-40 ${birthdayStyle.eighteen} pointer-events-none select-none`}
        />
      </div>
    </>
  ) : (
    <Image
      src="/theme/animated-background/birthday/static-balloon.svg"
      height={300}
      width={300}
      alt="Static balloon"
      aria-hidden="true"
      className="object-cover object-center -z-20 fixed inset-0 w-screen h-screen pointer-events-none select-none"
    />
  );
}
