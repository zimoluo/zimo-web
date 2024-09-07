"use client";

import { createContext, useState, useContext, ReactNode } from "react";
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
    setPopUps((prevPopUps) => {
      if (
        newPopUp.uniqueKey &&
        prevPopUps.some((popUp) => popUp.uniqueKey === newPopUp.uniqueKey)
      ) {
        return prevPopUps;
      }

      const formattedNewPopUp = { ...newPopUp, id: _.uniqueId("toast_") };
      return [...prevPopUps, formattedNewPopUp];
    });
  };

  const clearPopUp = () => {
    setPopUps([]);
  };

  const removeLastPopUp = () => {
    setPopUps((prevPopUps) => {
      if (prevPopUps.length <= 1) {
        return [];
      }
      return prevPopUps.slice(0, prevPopUps.length - 1);
    });
  };

  const removeAllPopUpsFrom = (index: number) => {
    setPopUps((prevPopUps) => {
      if (index < 0 || index >= prevPopUps.length || prevPopUps.length === 0) {
        return prevPopUps;
      }

      if (index === 0) {
        return [];
      }

      return prevPopUps.slice(0, index);
    });
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
