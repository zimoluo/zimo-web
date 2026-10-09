import PaletteImage from "../../host/PaletteImage";
import eyeStyle from "./eye-of-the-storm.module.css";
const eye1Image = { src: "/theme/animated-background/storm/eye-1.svg", width: 1024, height: 1024 };
const eye2Image = { src: "/theme/animated-background/storm/eye-2.svg", width: 1024, height: 1024 };
const eye3Image = { src: "/theme/animated-background/storm/eye-3.svg", width: 1024, height: 1024 };

export default function EyeOfTheStorm() {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center pointer-events-none  select-none"
      aria-hidden="true"
    >
      <PaletteImage
        src={eye1Image}
        alt="Eye of the storm."
        className={`${eyeStyle.position}  ${eyeStyle.spinOne}`}
      />
      <PaletteImage
        src={eye2Image}
        alt="Eye of the storm."
        className={`${eyeStyle.position}  ${eyeStyle.spinTwo}`}
      />
      <PaletteImage
        src={eye3Image}
        alt="Eye of the storm."
        className={`${eyeStyle.position}  ${eyeStyle.spinThree}`}
      />
    </div>
  );
}
