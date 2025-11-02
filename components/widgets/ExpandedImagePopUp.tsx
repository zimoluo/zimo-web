"use client";

import { shimmerDataURL } from "@/lib/imageUtil";
import imageViewerStyle from "./image-viewer.module.css";
import Link from "next/link";
import Image from "next/image";
import ColoredArrowIcon from "../assets/entries/imageViewer/ColoredArrowIcon";
import { usePopUpAction } from "../contexts/PopUpActionContext";
import { useEffect, useState } from "react";

interface Props {
  url: string[];
  alt: string[];
  initialIndex?: number;
}

export default function ExpandedImagePopUp({
  url,
  alt,
  initialIndex = 0,
}: Props) {
  const { isActivePopUp } = usePopUpAction();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentUrl = url[currentIndex];
  const currentAlt = alt[currentIndex];

  const goToPrevious =
    currentIndex > 0
      ? () => {
          setCurrentIndex(currentIndex - 1);
        }
      : undefined;

  const goToNext =
    currentIndex < url.length - 1
      ? () => {
          setCurrentIndex(currentIndex + 1);
        }
      : undefined;

  useEffect(() => {
    if (!isActivePopUp) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPrevious && goToPrevious();
      } else if (event.key === "ArrowRight") {
        goToNext && goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActivePopUp, goToPrevious, goToNext]);

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        className={`w-8 h-8 shrink-0 ${goToPrevious ? "" : "invisible"}`}
        onClick={goToPrevious}
      >
        <ColoredArrowIcon
          color="#efefef"
          className="w-8 h-8 opacity-80 transition-transform ease-out duration-300 hover:scale-105"
        />
      </button>
      <Link href={currentUrl} target="_blank" className="shrink-0">
        <Image
          src={currentUrl}
          alt={`${currentAlt || "Zoomed-In Image"}`}
          className={`${imageViewerStyle.popupSize} object-contain cursor-zoom-in`}
          height={4000}
          width={4000}
          quality={100}
          unoptimized={true}
          placeholder={`data:image/svg+xml;base64,${shimmerDataURL(100, 100)}`}
        />
      </Link>
      <button
        className={`w-8 h-8 shrink-0 ${goToNext ? "" : "invisible"}`}
        onClick={goToNext}
      >
        <ColoredArrowIcon
          color="#efefef"
          className="w-8 h-8 rotate-180 opacity-80 transition-transform ease-out duration-300 hover:scale-105"
        />
      </button>
    </div>
  );
}
