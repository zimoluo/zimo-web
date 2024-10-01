"use client";

import _ from "lodash";
import { createContext, useState, useContext, ReactNode } from "react";
import { useSettings } from "./SettingsContext";
import { useToast } from "./ToastContext";

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
      setActiveWindowByContextKey: (contextKey: string) => void;
    }
  | undefined
>(undefined);

export function WindowProvider({ children }: Props) {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [windowOrder, setWindowOrder] = useState<number[]>([]);
  const { settings } = useSettings();
  const { appendToast } = useToast();

  const appendWindow = (newWindowData: PartialBy<WindowData, "uniqueId">) => {
    let isWindowCapped = false;

    setWindows((prevWindows) => {
      const countLimitedWindows = prevWindows.filter(
        (window) => window.countsToLimit
      ).length;

      if (
        newWindowData.countsToLimit &&
        countLimitedWindows >= settings.windowLimit
      ) {
        isWindowCapped = true;
        return prevWindows;
      }

      const formattedData = {
        ...newWindowData,
        uniqueId: `window-${_.uniqueId()}`,
      };

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

    if (isWindowCapped) {
      appendToast({
        title: "Zimo Web",
        description: `Number of windows is capped at ${settings.windowLimit}.`,
      });
    }
  };

  const clearWindow = () => {
    setWindows([]);
    setWindowOrder([]);
  };

  const removeWindow = <K extends keyof WindowData>(
    key: K,
    value: WindowData[K]
  ) => {
    setWindows((prevWindows) => {
      const indexToRemove = prevWindows.findIndex(
        (window) => window[key] === value
      );
      if (indexToRemove !== -1) {
        setWindowOrder((prevOrder) => {
          const newOrder = prevOrder.filter(
            (_, index) => index !== indexToRemove
          );
          return newOrder.map((order) =>
            order > prevOrder[indexToRemove] ? order - 1 : order
          );
        });
        return prevWindows.filter((window) => window[key] !== value);
      }
      return prevWindows;
    });
  };

  const removeWindowByContextKey = (contextKey: string) =>
    removeWindow("contextKey", contextKey);
  const removeWindowByUniqueId = (uniqueId: string) =>
    removeWindow("uniqueId", uniqueId);

  const setActiveWindowByKey = <K extends keyof WindowData>(
    key: K,
    value: WindowData[K]
  ) => {
    setWindowOrder((prevOrder) => {
      const windowIndex = windows.findIndex((window) => window[key] === value);
      if (windowIndex === -1) {
        return prevOrder;
      }

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

  const setActiveWindow = (uniqueId: string) =>
    setActiveWindowByKey("uniqueId", uniqueId);
  const setActiveWindowByContextKey = (contextKey: string) =>
    setActiveWindowByKey("contextKey", contextKey);

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
        setActiveWindowByContextKey,
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
