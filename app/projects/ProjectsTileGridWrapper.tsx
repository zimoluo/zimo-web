"use client";

import { usePopUp } from "@/components/contexts/PopUpContext";
import { ReactNode, useMemo } from "react";
import tileGridStyle from "./projects-tile.module.css";

interface Props {
  children?: ReactNode;
}

export default function ProjectsTileGridWrapper({ children }: Props) {
  const { popUps } = usePopUp();
  const hasProjectsPopUp = useMemo(
    () => popUps.some((popUp) => (popUp?.tags ?? []).includes("projectsEntry")),
    [popUps],
  );

  return (
    <div
      className={`flex justify-center items-center ${tileGridStyle.padding} mb-24 md:mb-28 ${
        hasProjectsPopUp ? "invisible" : ""
      }`}
    >
      {children}
    </div>
  );
}
