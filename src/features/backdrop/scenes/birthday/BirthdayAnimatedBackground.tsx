"use client";

import type { SceneComponentProps } from "../../contract";

import BirthdayBalloon from "./BirthdayBalloon";
import Image from "../../host/PaletteImage";
import birthdayStyle from "./birthday.module.css";
const eighteenSrc = { src: "/theme/animated-background/birthday/eighteen.svg", width: 1024, height: 1024 };
const staticBalloonSrc = { src: "/theme/animated-background/birthday/static-balloon.svg", width: 1024, height: 1024 };

export default function BirthdayAnimatedBackground({ quality }: SceneComponentProps) {

  return quality === "rich" ? (
    <>
      <BirthdayBalloon />
      <div className="object-contain object-center fixed  inset-0 flex items-center justify-center w-screen h-screen pointer-events-none select-none">
        <Image
          src={eighteenSrc}
          alt="Eighteen"
          aria-hidden="true"
          className={`object-contain object-center  ${birthdayStyle.eighteen} pointer-events-none select-none`}
        />
      </div>
    </>
  ) : (
    <>
      <Image
        src={staticBalloonSrc}
        alt="Static balloon"
        aria-hidden="true"
        className="object-cover object-center  fixed inset-0 w-screen h-screen pointer-events-none select-none"
      />
      <div className="object-contain object-center fixed  inset-0 flex items-center justify-center w-screen h-screen pointer-events-none select-none">
        <Image
          src={eighteenSrc}
          alt="Eighteen"
          aria-hidden="true"
          className={`object-contain object-center  ${birthdayStyle.eighteen} pointer-events-none select-none`}
        />
      </div>
    </>
  );
}
