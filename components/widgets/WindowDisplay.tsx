import { ReactNode } from "react";
import ImageViewer from "./ImageViewer";

interface Props {
  imageData: ImagesData;
  display: ReactNode;
}

export default function WindowDisplay({ imageData, display }: Props) {
  const [widthRatio, heightRatio] = imageData.aspectRatio
    .split(":")
    .map(Number);

  return (
    <div className="h-full w-full flex rounded-xl overflow-hidden bg-widget-100 backdrop-blur-2xl shadow-xl">
      <div
        className="flex-grow-0 flex-shrink-0"
        style={{
          height: "100%",
          aspectRatio: `${widthRatio}/${heightRatio}`,
        }}
      >
        <ImageViewer
          {...imageData}
          defaultDimension={false}
          className="h-full"
        />
      </div>
      <div className="mx-1 flex-grow overflow-y-auto relative">{display}</div>
    </div>
  );
}
