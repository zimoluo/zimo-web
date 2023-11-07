import { useSettings } from "@/components/contexts/SettingsContext";
import Image from "next/image";
import homeStyle from "./home.module.css";

export default function HomeAnimatedBackground() {
  const { settings } = useSettings();

  return (
    settings.backgroundRichness === "rich" && (
      <>
        <div
          className={`fixed inset-0 -z-20 flex items-center justify-center pointer-events-none select-none ${homeStyle["move-1"]}`}
        >
          <Image
            src="/theme/animated-background/home/moving-1.svg"
            height="0"
            width="0"
            className="object-cover w-full h-full"
            alt="Background moving image 1"
            placeholder="empty"
            priority={true}
          />
        </div>

        <div
          className={`fixed inset-0 -z-20 flex items-center justify-center pointer-events-none select-none ${homeStyle["move-3"]}`}
        >
          <Image
            src="/theme/animated-background/home/moving-3.svg"
            height="0"
            width="0"
            className="object-cover w-full h-full"
            alt="Background moving image 3"
            placeholder="empty"
            priority={true}
          />
        </div>
        <div
          className={`fixed inset-0 -z-10 flex items-center justify-center pointer-events-none select-none ${homeStyle["move-2"]}`}
        >
          <Image
            src="/theme/animated-background/home/moving-2.svg"
            height="0"
            width="0"
            className="object-cover w-full h-full"
            alt="Background moving image 2"
            placeholder="empty"
            priority={true}
          />
        </div>
      </>
    )
  );
}
