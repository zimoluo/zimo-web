import Image from "next/image";
import crimsonStyle from "./crimson.module.css";
import towerSprite from "@/public/theme/animated-background/crimson/tower.svg";
import fanSprite from "@/public/theme/animated-background/crimson/fan.svg";

export default function CrimsonAnimatedBackground() {
  return (
    <>
      <Image
        src={towerSprite}
        aria-hidden="true"
        alt="Tower"
        className={`fixed select-none pointer-events-none left-1/2 bottom-0 -translate-x-1/2 -z-20 w-auto ${crimsonStyle.tower}`}
      />
      <Image
        src={fanSprite}
        aria-hidden="true"
        alt="Fan"
        className={`fixed select-none pointer-events-none left-1/2 -translate-x-1/2 -z-30 w-auto ${crimsonStyle.fan}`}
      />
    </>
  );
}
