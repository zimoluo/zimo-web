"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { ReactNode, useState } from "react";
import DarkOverlay from "@/components/widgets/DarkOverlay";
import PopUpDisplay from "@/components/widgets/PopUpDisplay";
import Link from "next/link";
import tileStyle from "./projects-tile.module.css";

export default function ProjectsTileWrapper({
  slug,
  children,
  popUpWindow,
}: {
  slug: string;
  children?: ReactNode;
  popUpWindow?: ReactNode;
}) {
  const [showPopup, setShowPopup] = useState(false);

  const { settings } = useSettings();

  const openPopUp = () => {
    setShowPopup(true);
  };

  const closePopUp = () => {
    setShowPopup(false);
  };

  return (
    <>
      <Link href={`/projects/${slug}`}>
        <button
          className={`group flex items-center relative justify-center ${tileStyle.size} aspect-square w-auto rounded-xl backdrop-blur-lg shadow-lg px-6 py-6 bg-widget-20 overflow-hidden`}
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
          <PopUpDisplay
            linkToPage={`/projects/${slug}`}
            onClose={closePopUp}
            desktopOnly={true}
          >
            {popUpWindow}
          </PopUpDisplay>
        </>
      )}
    </>
  );
}
