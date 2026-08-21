import type { ImagesData } from "../../src/features/entries/model/entry";
import { ReactNode } from "react";
import ImageViewer from "./ImageViewer";

interface Props {
  imageData: ImagesData;
  display: ReactNode;
  className?: string;
}

export default function WindowDisplay({
  imageData,
  display,
  className = "",
}: Props) {
  const [widthRatio, heightRatio] = imageData.aspectRatio
    .split(":")
    .map(Number);

  return (
    <div
      className={`h-full w-full flex rounded-[2rem] overflow-hidden backdrop-blur-reading shadow-xl outline-1 outline-edge/15 ${className}`}
    >
      <div className="grow-0 shrink-0 h-full p-2 pr-0">
        <div
          style={{
            height: "100%",
            aspectRatio: `${widthRatio}/${heightRatio}`,
          }}
          className="rounded-3xl overflow-hidden shadow-sm"
        >
          <ImageViewer
            {...imageData}
            defaultDimension={false}
            className="h-full"
          />
        </div>
      </div>
      <div className="grow overflow-y-auto relative">{display}</div>
    </div>
  );
}
