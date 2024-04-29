import Image from "next/image";
import eyeStyle from "./eye-of-the-storm.module.css";
import eye1Image from "@/public/theme/animated-background/storm/eye-1.svg";
import eye2Image from "@/public/theme/animated-background/storm/eye-2.svg";
import eye3Image from "@/public/theme/animated-background/storm/eye-3.svg";

export default function EyeOfTheStorm() {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center pointer-events-none -z-30 select-none"
      aria-hidden="true"
    >
      <Image
        src={eye1Image}
        alt="Eye of the storm."
        className={`${eyeStyle.position} ${eyeStyle.spinOne}`}
      />
      <Image
        src={eye2Image}
        alt="Eye of the storm."
        className={`${eyeStyle.position} ${eyeStyle.spinTwo}`}
      />
      <Image
        src={eye3Image}
        alt="Eye of the storm."
        className={`${eyeStyle.position} ${eyeStyle.spinThree}`}
      />
    </div>
  );
}
