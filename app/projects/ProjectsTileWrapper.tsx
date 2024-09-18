"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { ReactNode } from "react";
import Link from "next/link";
import tileStyle from "./projects-tile.module.css";
import { usePopUp } from "@/components/contexts/PopUpContext";

export default function ProjectsTileWrapper({
  slug,
  children,
  popUpWindow,
}: {
  slug: string;
  children?: ReactNode;
  popUpWindow?: ReactNode;
}) {
  const { settings } = useSettings();
  const { appendPopUp } = usePopUp();

  const openPopUp = () => {
    appendPopUp({
      content: popUpWindow,
      linkToPage: `/projects/${slug}`,
      desktopOnly: true,
      contextKey: `projects-${slug}`,
    });
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
    </>
  );
}
