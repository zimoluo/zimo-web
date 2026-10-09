import spinningMoonsStyle from "./spinning-moons.module.css";
const fullMoon = { src: "/theme/animated-background/bewitched/full.svg", width: 640, height: 640 };
const crescentMoon = { src: "/theme/animated-background/bewitched/crescent.svg", width: 640, height: 640 };
import PaletteImage from "../../host/PaletteImage";
import { Fragment } from "react";

export default function SpinningMoons() {
  return (
    <>
      <div
        className={`fixed  pointer-events-none select-none w-0 h-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ${spinningMoonsStyle.crescent}  ${spinningMoonsStyle.parent}`}
      >
        {Array.from({ length: 1 }).map((_, index) => {
          return (
            <Fragment key={index}>
              <div className={`${spinningMoonsStyle.child}`}>
                <PaletteImage
                  src={fullMoon}
                  alt="Full moon"
                  aria-hidden="true"
                  className="w-full h-full aspect-square"
                />
              </div>
              <div className={`${spinningMoonsStyle.child}`}>
                <PaletteImage
                  src={crescentMoon}
                  alt="Crescent moon"
                  aria-hidden="true"
                  className="w-full h-full aspect-square -rotate-90"
                />
              </div>
            </Fragment>
          );
        })}
      </div>
      <div
        className={`fixed  pointer-events-none select-none w-0 h-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ${spinningMoonsStyle.full}  ${spinningMoonsStyle.parent}`}
      >
        {Array.from({ length: 1 }).map((_, index) => {
          return (
            <Fragment key={index}>
              <div className={`${spinningMoonsStyle.child}`}>
                <PaletteImage
                  src={fullMoon}
                  alt="Full moon"
                  aria-hidden="true"
                  className="w-full h-full aspect-square"
                />
              </div>
              <div className={`${spinningMoonsStyle.child}`}>
                <PaletteImage
                  src={crescentMoon}
                  alt="Crescent moon"
                  aria-hidden="true"
                  className="w-full h-full aspect-square -rotate-90"
                />
              </div>
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
