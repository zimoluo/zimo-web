"use client";

import { useState, useEffect } from "react";
import CrossIcon from "@/components/assets/CrossIcon";
import Link from "next/link";
import EnterFullPageIcon from "../assets/entries/EnterFullPageIcon";
import { PopUp } from "@/lib/popUpUtil";
import { usePopUp } from "../contexts/PopUpContext";
import DarkOverlay from "./DarkOverlay";

type Props = PopUp & {
  index: number;
  independent?: boolean;
};

export default function PopUpDisplay({
  content,
  onClose = () => {},
  linkToPage = "",
  index,
  independent = false,
}: Props) {
  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: 0,
    transform: "scale(1.25)",
  });

  const { removeLastPopUp, popUps, clearPopUp } = usePopUp();

  const closeThisPopUp = () => {
    if (!independent && !(index === popUps.length - 1)) {
      return;
    }

    onClose();

    if (!independent) {
      removeLastPopUp();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (!independent) {
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape, {
      passive: true,
    });

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [independent, onClose]);

  useEffect(() => {
    setStyle({
      opacity: 1,
      transform: "scale(1)",
      transition: "opacity 200ms ease-out, transform 200ms ease-out",
    });
  }, []);

  return (
    <>
      <DarkOverlay />
      <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-50 px-12 py-12">
        <div style={style}>{content}</div>
        <div className="absolute top-4 right-4 z-70 flex items-center justify-center">
          {linkToPage && (
            <Link href={linkToPage} onClick={clearPopUp}>
              <EnterFullPageIcon
                color="#efefef"
                className="h-5 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110"
              />
            </Link>
          )}
          <button className="ml-5" onClick={closeThisPopUp}>
            <CrossIcon
              color="#efefef"
              className="h-5 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110"
            />
          </button>
        </div>
      </div>
    </>
  );
}
