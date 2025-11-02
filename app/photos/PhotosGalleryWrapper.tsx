"use client";

import { usePopUp } from "@/components/contexts/PopUpContext";
import ExpandedImagePopUp from "@/components/widgets/ExpandedImagePopUp";

interface Props {
  children: React.ReactNode;
  url: string[];
  alt: string[];
  index?: number;
}

export default function PhotosGalleryWrapper({
  children,
  url,
  alt,
  index = 0,
}: Props) {
  const { appendPopUp } = usePopUp();

  const openPopUp = () => {
    appendPopUp({
      content: <ExpandedImagePopUp url={url} alt={alt} initialIndex={index} />,
    });
  };

  return (
    <div className="w-full h-full relative" onDoubleClick={openPopUp}>
      {children}
    </div>
  );
}
