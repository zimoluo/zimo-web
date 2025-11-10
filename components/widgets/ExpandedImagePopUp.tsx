"use client";

import { shimmerDataURL } from "@/lib/imageUtil";
import imageViewerStyle from "./image-viewer.module.css";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import ColoredArrowIcon from "../assets/entries/imageViewer/ColoredArrowIcon";
import { usePopUpAction } from "../contexts/PopUpActionContext";
import { useEffect, useState, useCallback } from "react";

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

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex < url.length - 1 ? prevIndex + 1 : prevIndex
    );
  }, [url.length]);

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < url.length - 1;

  useEffect(() => {
    if (!isActivePopUp) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        canGoPrevious && goToPrevious();
      } else if (event.key === "ArrowRight") {
        canGoNext && goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActivePopUp, goToPrevious, goToNext, canGoPrevious, canGoNext]);

  return (
    <>
      <Head>
        {url.map((src, index) => (
          <link
            key={`preload-img-${index}`}
            rel="preload"
            as="image"
            href={src}
          />
        ))}
      </Head>

      <div className="relative h-full w-full">
        <div className="flex h-full w-full items-center justify-center">
          <Link href={currentUrl} target="_blank" className="shrink-0">
            <Image
              src={currentUrl}
              alt={`${currentAlt || "Zoomed-In Image"}`}
              className={`${imageViewerStyle.popupSize} object-contain cursor-zoom-in`}
              height={4000}
              width={4000}
              quality={100}
              unoptimized={true}
              placeholder={`data:image/svg+xml;base64,${shimmerDataURL(
                100,
                100
              )}`}
            />
          </Link>
        </div>

        <button
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition-all duration-200 ease-out hover:scale-105 md:left-4 ${
            canGoPrevious
              ? "opacity-80 hover:opacity-100"
              : "invisible opacity-0"
          }`}
          onClick={goToPrevious}
          disabled={!canGoPrevious}
          aria-label="Previous image"
        >
          <ColoredArrowIcon color="#efefef" className="h-8 w-8" />
        </button>

        <button
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition-all duration-200 ease-out hover:scale-105 md:right-4 ${
            canGoNext ? "opacity-80 hover:opacity-100" : "invisible opacity-0"
          }`}
          onClick={goToNext}
          disabled={!canGoNext}
          aria-label="Next image"
        >
          <ColoredArrowIcon color="#efefef" className="h-8 w-8 rotate-180" />
        </button>
      </div>
    </>
  );
}
