"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const WindowContext = createContext<
  | {
      windows: WindowData[];
      appendWindow: (windowData: WindowData) => void;
      clearWindow: () => void;
      removeWindowByUniqueKey: (uniqueKey: string) => void;
    }
  | undefined
>(undefined);

export function WindowProvider({ children }: Props) {
  const [windows, setWindows] = useState<WindowData[]>([]);

  const appendWindow = (newWindowData: WindowData) => {
    setWindows((prevWindows) => {
      if (
        newWindowData.uniqueKey &&
        prevWindows.some(
          (someWindow) => someWindow.uniqueKey === newWindowData.uniqueKey
        )
      ) {
        return prevWindows;
      }

      return [...prevWindows, newWindowData];
    });
  };

  const clearWindow = () => {
    setWindows([]);
  };

  const removeWindowByUniqueKey = (uniqueKey: string) => {
    setWindows((prevWindows) =>
      prevWindows.filter((window) => window.uniqueKey !== uniqueKey)
    );
  };

  return (
    <WindowContext.Provider
      value={{
        windows,
        appendWindow,
        clearWindow,
        removeWindowByUniqueKey,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export const useWindow = () => {
  const context = useContext(WindowContext);
  if (context === undefined) {
    throw new Error("useWindow must be used within a WindowProvider");
  }
  return context;
};
