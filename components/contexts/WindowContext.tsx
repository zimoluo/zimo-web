"use client";

import _ from "lodash";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  RefObject,
} from "react";
import { useSettings } from "./SettingsContext";
import { useToast } from "./ToastContext";

interface Props {
  children?: ReactNode;
}

const WindowContext = createContext<
  | {
      windows: WindowData[];
      windowOrder: number[];
      windowRefs: RefObject<HTMLDivElement>[];
      appendWindow: (windowData: PartialBy<WindowData, "uniqueId">) => void;
      clearWindow: () => void;
      removeWindowByContextKey: (uniqueKey: string) => void;
      removeWindowByUniqueId: (uniqueId: string) => void;
      setActiveWindow: (uniqueId: string) => void;
      setActiveWindowByContextKey: (contextKey: string) => void;
      registerWindowRef: (
        index: number,
        ref: RefObject<HTMLDivElement>
      ) => void;
    }
  | undefined
>(undefined);

export function WindowProvider({ children }: Props) {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [windowOrder, setWindowOrder] = useState<number[]>([]);
  const [windowRefs, setWindowRefs] = useState<RefObject<HTMLDivElement>[]>([]);
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

        setWindowRefs((prevRefs) => {
          if (!(prevRefs.length < newWindows.length)) {
            return prevRefs;
          }

          return [...prevRefs, { current: null }];
        });
      }

      return newWindows;
    });

    if (isWindowCapped) {
      appendToast({
        title: "Zimo Web",
        description: `No more than ${settings.windowLimit} window${
          settings.windowLimit === 1 ? "" : "s"
        } is allowed.`,
      });
    }
  };

  const clearWindow = () => {
    setWindows([]);
    setWindowOrder([]);
    setWindowRefs([]);
  };

  const removeWindow = <K extends keyof WindowData>(
    key: K,
    value: WindowData[K]
  ) => {
    setWindows((prevWindows) => {
      const indexToRemove = prevWindows.findIndex(
        (window) => window[key] === value
      );
      if (indexToRemove === -1) {
        return prevWindows;
      }

      setWindowOrder((prevOrder) => {
        const newOrder = prevOrder.filter(
          (_, index) => index !== indexToRemove
        );

        if (prevOrder.length < prevWindows.length) {
          return prevOrder;
        }

        return newOrder.map((order) =>
          order > prevOrder[indexToRemove] ? order - 1 : order
        );
      });

      setWindowRefs((prevRefs) => {
        const newRefs = prevRefs.filter((_, index) => index !== indexToRemove);

        if (prevRefs.length < prevWindows.length) {
          return prevRefs;
        }

        return newRefs;
      });

      return prevWindows.filter((window) => window[key] !== value);
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

  const registerWindowRef = (index: number, ref: RefObject<HTMLDivElement>) => {
    setWindowRefs((prevRefs) => {
      const newRefs = [...prevRefs];
      newRefs[index] = ref;
      return newRefs;
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
        setActiveWindowByContextKey,
        windowRefs,
        registerWindowRef,
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
