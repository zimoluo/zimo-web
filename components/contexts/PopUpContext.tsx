"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import _ from "lodash";

interface Props {
  children?: ReactNode;
}

const PopUpContext = createContext<
  | {
      popUps: PopUp[];
      appendPopUp: (popUp: PartialBy<PopUp, "uniqueId">) => void;
      clearPopUp: () => void;
      removeLastPopUp: () => void;
      removeAllPopUpsFrom: (index: number) => void;
      removePopUpByContextKey: (contextKey: string) => void;
      removePopUpByUniqueId: (uniqueId: string) => void;
    }
  | undefined
>(undefined);

export function PopUpProvider({ children }: Props) {
  const [popUps, setPopUps] = useState<PopUp[]>([]);

  const appendPopUp = (newPopUp: PartialBy<PopUp, "uniqueId">) => {
    setPopUps((prevPopUps) => {
      if (
        newPopUp.contextKey &&
        prevPopUps.some((popUp) => popUp.contextKey === newPopUp.contextKey)
      ) {
        return prevPopUps;
      }

      const formattedNewPopUp = {
        ...newPopUp,
        uniqueId: _.uniqueId("toast_"),
      };
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

  const removePopUpByContextKey = (contextKey: string) => {
    setPopUps((prevPopUps) =>
      prevPopUps.filter((popUp) => popUp.contextKey !== contextKey)
    );
  };

  const removePopUpByUniqueId = (uniqueId: string) => {
    setPopUps((prevPopUps) =>
      prevPopUps.filter((popUp) => popUp.uniqueId !== uniqueId)
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
        removePopUpByContextKey,
        removePopUpByUniqueId,
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
