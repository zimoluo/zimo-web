"use client";

import { createContext, useContext, ReactNode } from "react";

type Props = WindowAction & {
  children?: ReactNode;
};

const WindowActionContext = createContext<WindowAction | undefined>(undefined);

export function WindowActionProvider({
  children,
  closeWindow,
  setActiveWindow,
  isActiveWindow,
  windowContentRef,
  uniqueId,
  isWindowDragging,
  isWindowResizing,
  modifyWindowSaveProps,
  windowData,
  windowState,
  setWindowData,
  setWindowState,
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
        modifyWindowSaveProps,
        windowData,
        windowState,
        setWindowData,
        setWindowState,
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
