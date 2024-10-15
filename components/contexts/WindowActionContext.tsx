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
  isActiveWindow = false,
  windowContentRef = null,
  uniqueId = "",
  isWindowDragging = false,
  isWindowResizing = false,
  windowSaveProps = {},
  modifyWindowSaveProps = () => {},
}: Props) {
  return (
    <WindowActionContext.Provider
      value={{
        closeWindow,
        setActiveWindow,
        isActiveWindow,
        windowContentRef,
        uniqueId,
        isWindowDragging,
        isWindowResizing,
        windowSaveProps,
        modifyWindowSaveProps,
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
