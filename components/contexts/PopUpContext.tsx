"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { PopUp } from "@/lib/popUpUtil";
import _ from "lodash";

interface Props {
  children?: ReactNode;
}

const PopUpContext = createContext<
  | {
      popUps: PopUp[];
      appendPopUp: (popUp: PopUp) => void;
      clearPopUp: () => void;
      removeLastPopUp: () => void;
      removeAllPopUpsFrom: (index: number) => void;
      removePopUpByUniqueKey: (uniqueKey: string) => void;
    }
  | undefined
>(undefined);

export function PopUpProvider({ children }: Props) {
  const [popUps, setPopUps] = useState<PopUp[]>([]);

  const appendPopUp = (newPopUp: PopUp) => {
    if (
      newPopUp.uniqueKey &&
      popUps.some((popUp) => popUp.uniqueKey === newPopUp.uniqueKey)
    ) {
      return;
    }

    const formattedNewPopUp = { ...newPopUp, id: _.uniqueId("toast_") };
    setPopUps([...popUps, formattedNewPopUp]);
  };

  const clearPopUp = () => {
    setPopUps([]);
  };

  const removeLastPopUp = () => {
    if (popUps.length === 1) {
      clearPopUp();
      return;
    }

    if (popUps.length > 0) {
      setPopUps(popUps.slice(0, popUps.length - 1));
    }
  };

  const removeAllPopUpsFrom = (index: number) => {
    if (index < 0 || index >= popUps.length || popUps.length === 0) {
      return;
    }

    if (index === 0) {
      clearPopUp();
      return;
    }

    setPopUps(popUps.slice(0, index));
  };

  const removePopUpByUniqueKey = (uniqueKey: string) => {
    setPopUps((prevPopUps) =>
      prevPopUps.filter((popUp) => popUp.uniqueKey !== uniqueKey)
    );
  };

  return (
    <PopUpContext.Provider
      value={{
        popUps,
        appendPopUp,
        clearPopUp,
        removeLastPopUp,
        removeAllPopUpsFrom,
        removePopUpByUniqueKey,
      }}
    >
      {children}
    </PopUpContext.Provider>
  );
}

export const usePopUp = () => {
  const context = useContext(PopUpContext);
  if (context === undefined) {
    throw new Error("usePopUp must be used within a PopUpProvider");
  }
  return context;
};
