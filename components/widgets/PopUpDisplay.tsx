"use client";

import { useState, useEffect } from "react";
import CrossIcon from "@/components/assets/CrossIcon";
import Link from "next/link";
import EnterFullPageIcon from "../assets/entries/EnterFullPageIcon";
import { usePopUp } from "../contexts/PopUpContext";
import DarkOverlay from "./DarkOverlay";
import { PopUpActionProvider } from "../contexts/PopUpActionContext";

type Props = PopUp & {
  index: number;
};

export default function PopUpDisplay({
  content,
  onClose = () => {},
  linkToPage = "",
  index,
  hasDarkOverlay = true,
  hasUtilityButton = true,
  darkOpacity,
  uniqueId,
}: Props) {
  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: 0,
    transform: "scale(1.25)",
  });

  const { removeLastPopUp, removePopUpByUniqueId, popUps, clearPopUp } =
    usePopUp();

  const closeThisPopUpIfLast = () => {
    if (!(index === popUps.length - 1)) {
      return;
    }

    onClose();
    removeLastPopUp();
  };

  const closeThisPopUp = () => {
    onClose();
    removePopUpByUniqueId(uniqueId);
  };

  useEffect(() => {
    setStyle({
      opacity: 1,
      transform: "scale(1)",
      transition: "opacity 200ms ease-out, transform 200ms ease-out",
    });
  }, []);

  return (
    <>
      {hasDarkOverlay && <DarkOverlay opacity={darkOpacity} />}
      <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-50 px-12 py-12">
        <div style={style}>
          <PopUpActionProvider closePopUp={closeThisPopUp}>
            {content}
          </PopUpActionProvider>
        </div>
        {hasUtilityButton && (
          <div className="absolute top-4 right-4 z-70 flex items-center justify-center">
            {linkToPage && (
              <Link href={linkToPage} onClick={clearPopUp}>
                <EnterFullPageIcon
                  color="#efefef"
                  className="h-5 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110"
                />
              </Link>
            )}
            <button className="ml-5" onClick={closeThisPopUpIfLast}>
              <CrossIcon
                color="#efefef"
                className="h-5 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110"
              />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
