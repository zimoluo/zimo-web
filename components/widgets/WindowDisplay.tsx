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
      className={`h-full w-full flex rounded-[2rem] overflow-hidden backdrop-blur-reading shadow-xl ${className}`}
    >
      <div className="flex-grow-0 flex-shrink-0 h-full p-2 pr-0">
        <div
          style={{
            height: "100%",
            aspectRatio: `${widthRatio}/${heightRatio}`,
          }}
          className="rounded-3xl overflow-hidden"
        >
          <ImageViewer
            {...imageData}
            defaultDimension={false}
            className="h-full"
          />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto relative">{display}</div>
    </div>
  );
}
