const fullMoon = { src: "/theme/animated-background/bewitched/full.svg", width: 640, height: 640 };
const crescentMoon = { src: "/theme/animated-background/bewitched/crescent.svg", width: 640, height: 640 };
import PaletteImage from "../../host/PaletteImage";
import twoMoonsStyle from "./two-moons.module.css";

export default function TheTwoMoons() {
  return (
    <>
      <PaletteImage
        src={fullMoon}
        alt="Full moon"
        aria-hidden="true"
        className={`fixed  pointer-events-none select-none aspect-square ${twoMoonsStyle.moon} top-1/2 -translate-y-1/2 translate-x-1/2 ${twoMoonsStyle.full}`}
      />
      <PaletteImage
        src={crescentMoon}
        alt="Crescent moon"
        aria-hidden="true"
        className={`fixed  pointer-events-none select-none aspect-square ${twoMoonsStyle.moon} top-1/2 -translate-y-1/2 -translate-x-1/2 ${twoMoonsStyle.crescent}`}
      />
    </>
  );
}
