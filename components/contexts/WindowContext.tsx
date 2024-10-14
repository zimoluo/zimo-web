"use client";

import _ from "lodash";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  RefObject,
  Dispatch,
  SetStateAction,
  useCallback,
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
      isWindowMinimized: boolean;
      setIsWindowMinimized: Dispatch<SetStateAction<boolean>>;
      initiateWindowCleanup: () => void;
      windowCleanupData: ({ newX: number; newY: number } | null)[];
    }
  | undefined
>(undefined);

export function WindowProvider({ children }: Props) {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [windowOrder, setWindowOrder] = useState<number[]>([]);
  const [windowRefs, setWindowRefs] = useState<RefObject<HTMLDivElement>[]>([]);
  const [windowCleanupData, setWindowCleanupData] = useState<
    ({ newX: number; newY: number } | null)[]
  >([]);
  const [isWindowMinimized, setIsWindowMinimized] = useState(false);
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

        setWindowCleanupData((prevData) => {
          if (!(prevData.length < newWindows.length)) {
            return prevData;
          }

          return [...prevData, null];
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
    setWindowCleanupData([]);
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

      setWindowCleanupData((prevData) => {
        const newData = prevData.filter((_, index) => index !== indexToRemove);

        if (prevData.length < prevWindows.length) {
          return prevData;
        }

        return newData;
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

  // Centralized computation function
  const initiateWindowCleanup = useCallback(() => {
    const gap = 8;
    const rowHeight = 90;
    const windowMargin = 40;
    const availableWidth = window.innerWidth - windowMargin;
    const newCleanupData: { newX: number; newY: number }[] = [];
    const newOrder: number[] = [];

    // Separate movable and disableMove windows
    const movableWindows = windows
      .map((data, idx) => ({ data, idx, order: windowOrder[idx] }))
      .filter((item) => !item.data.disableMove);

    const disableMoveWindows = windows
      .map((data, idx) => ({ data, idx, order: windowOrder[idx] }))
      .filter((item) => item.data.disableMove);

    // Sort disableMove windows based on their original order
    disableMoveWindows.sort((a, b) => a.order - b.order);

    // Sort movable windows by width (descending) and process them first
    const sortedWindows = movableWindows
      .map(({ data, idx, order }) => {
        const ref = windowRefs[idx];
        const refWidth = data.disableWidthAdjustment
          ? ref?.current?.offsetWidth ?? 0
          : data.minWidth ?? ref?.current?.offsetWidth ?? 0;

        return { order, idx, refWidth };
      })
      .sort((a, b) => b.refWidth - a.refWidth); // Sort by refWidth descending

    const rows: number[][] = []; // 2D array for window indices in rows

    for (const { idx, refWidth } of sortedWindows) {
      let placedInRow = false;

      // Try to fit the window into an existing row
      for (let r = 0; r < rows.length; r++) {
        const rowWidth = rows[r].reduce((sum, windowIdx) => {
          const otherData = windows[windowIdx];
          const otherRef = windowRefs[windowIdx];
          const otherRefWidth = otherData.disableWidthAdjustment
            ? otherRef?.current?.offsetWidth ?? 0
            : otherData.minWidth ?? otherRef?.current?.offsetWidth ?? 0;
          return sum + otherRefWidth + gap;
        }, windowMargin);

        if (rowWidth + refWidth + gap <= availableWidth) {
          rows[r].push(idx); // Add window index to this row
          placedInRow = true;
          break;
        }
      }

      if (!placedInRow) {
        rows.push([idx]); // Start a new row with the current window
      }
    }

    // Sort rows by total row width and assign positions for movable windows
    const sortedRows = rows
      .map((row) => ({
        row,
        totalWidth: row.reduce((sum, windowIdx) => {
          const ref = windowRefs[windowIdx];
          const data = windows[windowIdx];
          const refWidth = data.disableWidthAdjustment
            ? ref?.current?.offsetWidth ?? 0
            : data.minWidth ?? ref?.current?.offsetWidth ?? 0;
          return sum + refWidth + gap;
        }, windowMargin),
      }))
      .sort((a, b) => b.totalWidth - a.totalWidth) // Sort rows by total width, descending
      .map(({ row }) => row.sort((a, b) => windowOrder[a] - windowOrder[b])); // Sort each row's windows by order

    // Assign new x and y positions, and create a new order for movable windows
    let orderCounter = 0; // Counter for new order
    sortedRows
      .flatMap((row, rowIndex) => {
        let currentRowWidth = windowMargin;

        return row.map((windowIdx) => {
          const ref = windowRefs[windowIdx];
          const data = windows[windowIdx];

          // Calculate the width of this window
          const refWidth = data.disableWidthAdjustment
            ? ref?.current?.offsetWidth ?? 0
            : data.minWidth ?? ref?.current?.offsetWidth ?? 0;

          // Set the new X and Y position for the window
          newCleanupData[windowIdx] = {
            newX: currentRowWidth,
            newY: 60 + rowIndex * rowHeight,
          };

          // Update the row width
          currentRowWidth += refWidth + gap;

          return windowIdx;
        });
      })
      .forEach((windowIdx) => {
        // Assign order to the movable windows
        newOrder[windowIdx] = orderCounter++;
      });

    // Handle disableMove windows: assign them the highest order based on their relative previous order
    disableMoveWindows.forEach(({ idx }) => {
      // Assign their order starting after the last movable window
      newOrder[idx] = orderCounter++;
      // They retain their existing position (or can have custom logic for positioning)
      newCleanupData[idx] = {
        newX: 0,
        newY: 0,
      };
    });

    // Set the new positions and window order
    setWindowCleanupData(newCleanupData);
    setWindowOrder(newOrder); // This will now reflect left-to-right, top-to-bottom order
  }, [windowRefs, windows, windowOrder]);

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
        isWindowMinimized,
        setIsWindowMinimized,
        initiateWindowCleanup,
        windowCleanupData,
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
