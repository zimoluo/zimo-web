"use client";

import { createContext, useContext, ReactNode } from "react";

type Props = Partial<WindowAction> & {
  children?: ReactNode;
};

const WindowActionContext = createContext<WindowAction | undefined>(undefined);

export function WindowActionProvider({
  children,
  closeWindow = () => {},
  setActiveWindow = () => {},
}: Props) {
  return (
    <WindowActionContext.Provider
      value={{
        closeWindow,
        setActiveWindow,
      }}
    >
      {children}
    </WindowActionContext.Provider>
  );
}

export const useWindowAction = () => {
  const context = useContext(WindowActionContext);
  if (context === undefined) {
    throw new Error(
      "useWindowAction must be used within a WindowActionProvider"
    );
  }
  return context;
};
