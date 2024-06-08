import fullMoon from "@/public/theme/animated-background/bewitched/full.svg";
import crescentMoon from "@/public/theme/animated-background/bewitched/crescent.svg";
import Image from "next/image";
import twoMoonsStyle from "./two-moons.module.css";

export default function TheTwoMoons() {
  return (
    <>
      <Image
        src={fullMoon}
        alt="Full moon"
        aria-hidden="true"
        className={`fixed -z-30 pointer-events-none select-none aspect-square ${twoMoonsStyle.moon} top-1/2 -translate-y-1/2 translate-x-1/2 ${twoMoonsStyle.full}`}
      />
      <Image
        src={crescentMoon}
        alt="Crescent moon"
        aria-hidden="true"
        className={`fixed -z-20 pointer-events-none select-none aspect-square ${twoMoonsStyle.moon} top-1/2 -translate-y-1/2 -translate-x-1/2 ${twoMoonsStyle.crescent}`}
      />
    </>
  );
}
