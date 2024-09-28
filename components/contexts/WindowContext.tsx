"use client";

import _ from "lodash";
import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const WindowContext = createContext<
  | {
      windows: WindowData[];
      windowOrder: number[];
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
  const [windowOrder, setWindowOrder] = useState<number[]>([]);

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

      const newWindows = [...prevWindows, formattedData];

      if (newWindows.length > prevWindows.length) {
        setWindowOrder((prevOrder) => {
          if (!(prevOrder.length < newWindows.length)) {
            return prevOrder;
          }

          return [...prevOrder, prevOrder.length];
        });
      }

      return newWindows;
    });
  };

  const clearWindow = () => {
    setWindows([]);
    setWindowOrder([]);
  };

  const removeWindowByContextKey = (contextKey: string) => {
    setWindows((prevWindows) => {
      const indexToRemove = prevWindows.findIndex(
        (window) => window.contextKey === contextKey
      );
      if (indexToRemove !== -1) {
        setWindowOrder((prevOrder) => {
          const newOrder = prevOrder.filter(
            (_, index) => index !== indexToRemove
          );
          return newOrder.map((order) =>
            order > indexToRemove ? order - 1 : order
          );
        });
        return prevWindows.filter((window) => window.contextKey !== contextKey);
      }
      return prevWindows;
    });
  };

  const removeWindowByUniqueId = (uniqueId: string) => {
    setWindows((prevWindows) => {
      const indexToRemove = prevWindows.findIndex(
        (window) => window.uniqueId === uniqueId
      );
      if (indexToRemove !== -1) {
        setWindowOrder((prevOrder) => {
          const newOrder = prevOrder.filter(
            (_, index) => index !== indexToRemove
          );
          return newOrder.map((order) =>
            order > indexToRemove ? order - 1 : order
          );
        });
        return prevWindows.filter((window) => window.uniqueId !== uniqueId);
      }
      return prevWindows;
    });
  };

  const setActiveWindow = (uniqueId: string) => {
    setWindowOrder((prevOrder) => {
      const windowIndex = windows.findIndex(
        (window) => window.uniqueId === uniqueId
      );
      const currentOrder = prevOrder[windowIndex];

      if (currentOrder === prevOrder.length - 1) {
        return prevOrder;
      }

      return prevOrder.map((order) => {
        if (order === currentOrder) {
          return prevOrder.length - 1;
        } else if (order > currentOrder) {
          return order - 1;
        }
        return order;
      });
    });
  };

  return (
    <WindowContext.Provider
      value={{
        windows,
        windowOrder,
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
