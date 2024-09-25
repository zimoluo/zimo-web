"use client";

import _ from "lodash";
import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const WindowContext = createContext<
  | {
      windows: WindowData[];
      appendWindow: (windowData: PartialBy<WindowData, "uniqueId">) => void;
      clearWindow: () => void;
      removeWindowByContextKey: (uniqueKey: string) => void;
      removeWindowByUniqueId: (uniqueId: string) => void;
      setActiveWindow: (uniqueId: string) => void;
    }
  | undefined
>(undefined);

export function WindowProvider({ children }: Props) {
  const [windows, setWindows] = useState<WindowData[]>([]);

  const appendWindow = (newWindowData: PartialBy<WindowData, "uniqueId">) => {
    const formattedData = {
      ...newWindowData,
      uniqueId: `window-${_.uniqueId()}`,
    };

    setWindows((prevWindows) => {
      if (
        formattedData.contextKey &&
        prevWindows.some(
          (someWindow) => someWindow.contextKey === formattedData.contextKey
        )
      ) {
        return prevWindows;
      }

      return [...prevWindows, formattedData];
    });
  };

  const clearWindow = () => {
    setWindows([]);
  };

  const removeWindowByContextKey = (contextKey: string) => {
    setWindows((prevWindows) =>
      prevWindows.filter((window) => window.contextKey !== contextKey)
    );
  };

  const removeWindowByUniqueId = (uniqueId: string) => {
    setWindows((prevWindows) =>
      prevWindows.filter((window) => window.uniqueId !== uniqueId)
    );
  };

  const setActiveWindow = (uniqueId: string) => {
    setWindows((prevWindows) => {
      const newWindows = [...prevWindows];
      const windowIndex = newWindows.findIndex(
        (window) => window.uniqueId === uniqueId
      );
      const windowData = newWindows.splice(windowIndex, 1)[0];
      newWindows.push(windowData);
      return newWindows;
    });
  };

  return (
    <WindowContext.Provider
      value={{
        windows,
        appendWindow,
        clearWindow,
        removeWindowByContextKey,
        removeWindowByUniqueId,
        setActiveWindow,
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
