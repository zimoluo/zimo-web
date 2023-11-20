"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import DarkOverlay from "@/components/widgets/DarkOverlay";
import PopUpDisplay from "@/components/widgets/PopUpDisplay";
import { computeRandomMultiplier } from "@/lib/photos/aspectRatioCalculator";
import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";

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

  const [showPopup, setShowPopup] = useState(false);

  const { settings } = useSettings();

  const openPopUp = () => {
    setShowPopup(true);
  };

  const closePopUp = () => {
    setShowPopup(false);
  };

  return (
    <div
      className="w-42 md:w-72 h-auto rounded-xl overflow-hidden mb-1.5 relative group"
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
      {showPopup && (
        <>
          <DarkOverlay />
          <PopUpDisplay onClose={closePopUp} linkToPage={`/photos/${slug}`}>
            {popUpWindow}
          </PopUpDisplay>
        </>
      )}
    </div>
  );
}
