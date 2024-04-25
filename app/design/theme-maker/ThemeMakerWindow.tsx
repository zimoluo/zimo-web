import Image from "next/image";
import ColorPreviewGrid from "./ColorPreviewGrid";
import ColorPreviewWrapper from "./ColorPreviewWrapper";
import windowStyle from "./window.module.css";
import deletemeImage from "@/public/deleteme.png";

export default function ThemeMakerWindow() {
  return (
    <div className="w-screen flex justify-center">
      <div
        className={`mt-16 md:my-18 ${windowStyle.sizing} bg-widget-80 md:rounded-3xl md:shadow-xl md:backdrop-blur md:overflow-hidden`}
      >
        <div className="w-full md:h-full md:flex md:flex-row-reverse">
          <ColorPreviewWrapper>
            <ColorPreviewGrid />
          </ColorPreviewWrapper>
          <div className="md:flex-grow md:overflow-y-auto">
            where the main editing will take place. yea
            <Image src={deletemeImage} alt="nothing" style={{ width: "90%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
