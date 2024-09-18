"use client";

import { usePopUp } from "@/components/contexts/PopUpContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import { computeRandomMultiplier } from "@/lib/photos/aspectRatioCalculator";
import Link from "next/link";
import { ReactNode, useMemo } from "react";

interface Props {
  children?: ReactNode;
  url: string;
  aspectRatio: string;
  slug: string;
  popUpWindow: ReactNode;
}

export default function PhotosTileWrapper({
  children,
  aspectRatio,
  url,
  slug,
  popUpWindow,
}: Props) {
  const randomMultiplier = useMemo(() => {
    return computeRandomMultiplier(url);
  }, [url]);

  const [widthRatio, heightRatio] = aspectRatio.split(":").map(Number);
  const computedAspectRatio = useMemo(() => {
    if (widthRatio / heightRatio === 1) {
      return 1;
    }
    return parseFloat(
      ((widthRatio / heightRatio) * randomMultiplier).toFixed(3)
    );
  }, [widthRatio, heightRatio, randomMultiplier]);

  const { settings } = useSettings();

  const { appendPopUp } = usePopUp();

  const openPopUp = () => {
    appendPopUp({
      content: popUpWindow,
      linkToPage: `/photos/${slug}`,
      desktopOnly: true,
      contextKey: `photos-${slug}`,
    });
  };

  return (
    <div
      className="w-42 md:w-72 h-auto rounded-xl overflow-hidden relative"
      style={{ aspectRatio: `${computedAspectRatio}` }}
    >
      <Link href={`/photos/${slug}`}>
        <button
          className="w-42 md:w-72 h-auto rounded-xl overflow-hidden relative group"
          style={{ aspectRatio: `${computedAspectRatio}` }}
          onClick={(e) => {
            if (window.innerWidth >= 768 && !settings.disableEntryPopUp) {
              e.preventDefault();
              openPopUp();
            }
          }}
        >
          {children}
        </button>
      </Link>
    </div>
  );
}
