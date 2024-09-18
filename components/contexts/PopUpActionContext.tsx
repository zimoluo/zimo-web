"use client";

import { createContext, useContext, ReactNode } from "react";

type Props = Partial<PopUpAction> & {
  children?: ReactNode;
};

const PopUpActionContext = createContext<PopUpAction | undefined>(undefined);

export function PopUpActionProvider({
  children,
  closePopUp = () => {},
}: Props) {
  return (
    <PopUpActionContext.Provider
      value={{
        closePopUp,
      }}
    >
      {children}
    </PopUpActionContext.Provider>
  );
}

export const usePopUpAction = () => {
  const context = useContext(PopUpActionContext);
  if (context === undefined) {
    throw new Error("usePopUpAction must be used within a PopUpActionProvider");
  }
  return context;
};
