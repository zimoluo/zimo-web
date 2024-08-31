"use client";

import { useEffect } from "react";
import { usePopUp } from "../contexts/PopUpContext";
import PopUpDisplay from "./PopUpDisplay";

export default function PopUpManager() {
  const { popUps, removeLastPopUp, removeAllPopUpsFrom } = usePopUp();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (popUps.length === 0) {
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        popUps[popUps.length - 1].onClose?.();
        removeLastPopUp();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [popUps, removeLastPopUp]);

  useEffect(() => {
    const handleResize = () => {
      if (popUps.length === 0) {
        return;
      }

      if (window.innerWidth < 768) {
        const desktopOnlyIndex = popUps.findIndex((popup) => popup.desktopOnly);

        if (desktopOnlyIndex === -1) {
          return;
        }

        const popupsToClose = popUps.slice(desktopOnlyIndex).reverse();

        popupsToClose.forEach((popup) => {
          popup.onClose?.();
        });

        removeAllPopUpsFrom(desktopOnlyIndex);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [popUps, removeAllPopUpsFrom]);

  return popUps.map((popUp, index) => (
    <PopUpDisplay {...popUp} index={index} key={`popUp-${popUp.id || index}`} />
  ));
}
