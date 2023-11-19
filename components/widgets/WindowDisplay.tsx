import { ReactNode } from "react";
import DefaultGridViewApplier from "./DefaultGridViewApplier";

interface Props {
  imageData: ImagesData;
  display: ReactNode;
}

export default function WindowDisplay({ imageData, display }: Props) {
  const [widthRatio, heightRatio] = imageData.aspectRatio
    .split(":")
    .map(Number);

  return (
    <div className="h-full w-full flex rounded-xl overflow-hidden bg-widget-100">
      <div
        className="flex-grow-0 flex-shrink-0"
        style={{
          height: "100%",
          aspectRatio: `${widthRatio}/${heightRatio}`,
        }}
      >
        <DefaultGridViewApplier {...imageData} useHFull={true} />
      </div>
      <div className="px-6 py-4 flex-grow overflow-y-auto">{display}</div>
    </div>
  );
}
