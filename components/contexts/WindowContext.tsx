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
  cloneElement,
  useEffect,
} from "react";
import { useSettings } from "./SettingsContext";
import { useToast } from "./ToastContext";
import { windowEntryMap } from "../window/WindowPickerEntry";
import { defaultSettings } from "@/lib/constants/defaultSettings";

interface Props {
  children?: ReactNode;
}

const WindowContext = createContext<
  | {
      windows: WindowData[];
      windowOrder: number[];
      windowRefs: RefObject<HTMLDivElement | null>[];
      appendWindow: (windowData: PartialBy<WindowData, "uniqueId">) => void;
      clearWindow: () => void;
      removeWindowByIndex: (index: number) => void;
      removeWindowByUniqueId: (uniqueId: string) => void;
      removeWindowByContextKey: (uniqueKey: string) => void;
      setActiveWindowByIndex: (index: number) => void;
      setActiveWindowByUniqueId: (uniqueId: string) => void;
      setActiveWindowByContextKey: (contextKey: string) => void;
      registerWindowRef: (
        index: number,
        ref: RefObject<HTMLDivElement | null>
      ) => void;
      isWindowMinimized: boolean;
      setIsWindowMinimized: Dispatch<SetStateAction<boolean>>;
      initiateWindowCleanup: () => void;
      windowCleanupData: ({ newX: number; newY: number } | null)[];
      windowSaveProps: WindowSaveData["initialProps"][];
      modifyWindowSavePropsByIndex: (
        index: number,
        newProps: Record<string, any>
      ) => void;
      restoreWindowFromSave: (
        save: WindowSaveData[],
        viewportDimension: { width: number; height: number }
      ) => void;
      saveWindows: (doSync?: boolean) => void;
      windowStates: WindowState[];
      updateWindowStateByIndex: (
        index: number,
        updater: ((state: WindowState) => WindowState) | Partial<WindowState>
      ) => void;
      updateWindowDataByIndex: (
        index: number,
        updater: ((data: WindowData) => WindowData) | Partial<WindowData>
      ) => void;
    }
  | undefined
>(undefined);

export const windowSoftTopBorder = 72;
export const windowSoftLeftBorder = 16;
export const windowSoftRightBorder = 16;
export const windowSoftBottomBorder = 36;

export function WindowProvider({ children }: Props) {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [windowStates, setWindowStates] = useState<WindowState[]>([]);
  const [windowOrder, setWindowOrder] = useState<number[]>([]);
  const [windowRefs, setWindowRefs] = useState<
    RefObject<HTMLDivElement | null>[]
  >([]);
  const [windowCleanupData, setWindowCleanupData] = useState<
    ({ newX: number; newY: number } | null)[]
  >([]);
  const [windowSaveProps, setWindowSaveProps] = useState<
    WindowSaveData["initialProps"][]
  >([]);
  const [isWindowMinimized, setIsWindowMinimized] = useState(false);
  const { settings, updateSettings } = useSettings();
  const { appendToast } = useToast();
  const [windowSaveDataBuffer, setWindowSaveDataBuffer] = useState<{
    data: WindowSaveData[];
    doSync: boolean;
  } | null>(null);
  const [shouldAnnounceNotification, setShouldAnnounceNotification] =
    useState(false);

  const appendWindow = (newWindowData: PartialBy<WindowData, "uniqueId">) => {
    setWindows((prevWindows) => {
      const countLimitedWindows = prevWindows.filter(
        (window) => window.countsToLimit
      ).length;

      if (
        newWindowData.countsToLimit &&
        countLimitedWindows >= settings.windowLimit
      ) {
        setShouldAnnounceNotification(true);
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

      const newWindows = [...prevWindows, formattedData as WindowData];

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

        setWindowSaveProps((prevProps) => {
          if (!(prevProps.length < newWindows.length)) {
            return prevProps;
          }

          return [...prevProps, {}];
        });

        setWindowStates((prevStates) => {
          if (!(prevStates.length < newWindows.length)) {
            return prevStates;
          }

          let confinedWidth = Math.max(
            formattedData.minWidth ?? 0,
            (formattedData.minHeight ?? 0) *
              (formattedData.minAspectRatio ?? 0),
            Math.min(
              formattedData.defaultWidth,
              window.innerWidth - windowSoftLeftBorder - windowSoftRightBorder
            )
          );

          let confinedHeight = Math.max(
            formattedData.minHeight ?? 0,
            (formattedData.minWidth ?? 0) /
              (formattedData.maxAspectRatio ?? Infinity),
            Math.min(
              formattedData.defaultHeight,
              window.innerHeight - windowSoftBottomBorder - windowSoftTopBorder
            )
          );

          if (formattedData.disableWidthAdjustment) {
            confinedWidth = formattedData.defaultWidth;
          }

          if (formattedData.disableHeightAdjustment) {
            confinedHeight = formattedData.defaultHeight;
          }

          return [
            ...prevStates,
            {
              x: -300 - confinedWidth,
              y: -300 - confinedHeight,
              width: confinedWidth,
              height: confinedHeight,
            },
          ];
        });
      }

      return newWindows;
    });
  };

  const clearWindow = () => {
    setWindows([]);
    setWindowOrder([]);
    setWindowRefs([]);
    setWindowCleanupData([]);
    setWindowSaveProps([]);
    setWindowStates([]);
    updateSettings({
      windowSaveData: structuredClone(defaultSettings.windowSaveData),
    });
  };

  const removeWindowByPredicate = (
    predicate: (window: WindowData, index: number) => boolean
  ) => {
    setWindows((prevWindows) => {
      const indexToRemove = prevWindows.findIndex(predicate);
      if (indexToRemove === -1) {
        return prevWindows;
      }

      setWindowOrder((prevOrder) => {
        if (prevOrder.length < prevWindows.length) {
          return prevOrder;
        }
        return prevOrder
          .filter((_, index) => index !== indexToRemove)
          .map((order) =>
            order > prevOrder[indexToRemove] ? order - 1 : order
          );
      });

      setWindowRefs((prevRefs) => {
        if (prevRefs.length < prevWindows.length) {
          return prevRefs;
        }
        return prevRefs.filter((_, index) => index !== indexToRemove);
      });

      setWindowCleanupData((prevData) => {
        if (prevData.length < prevWindows.length) {
          return prevData;
        }
        return prevData.filter((_, index) => index !== indexToRemove);
      });

      setWindowSaveProps((prevProps) => {
        if (prevProps.length < prevWindows.length) {
          return prevProps;
        }
        return prevProps.filter((_, index) => index !== indexToRemove);
      });

      setWindowStates((prevStates) => {
        if (prevStates.length < prevWindows.length) {
          return prevStates;
        }
        return prevStates.filter((_, index) => index !== indexToRemove);
      });

      return prevWindows.filter((_, index) => index !== indexToRemove);
    });
  };

  const removeWindowByContextKey = (contextKey: string) =>
    removeWindowByPredicate((window) => window.contextKey === contextKey);

  const removeWindowByUniqueId = (uniqueId: string) =>
    removeWindowByPredicate((window) => window.uniqueId === uniqueId);

  const removeWindowByIndex = (index: number) =>
    removeWindowByPredicate((_, idx) => idx === index);

  const setActiveWindowByPredicate = (
    predicate: (window: WindowData, index: number) => boolean
  ) => {
    setWindowOrder((prevOrder) => {
      const windowIndex = windows.findIndex(predicate);
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

  const setActiveWindowByUniqueId = (uniqueId: string) =>
    setActiveWindowByPredicate((window) => window.uniqueId === uniqueId);

  const setActiveWindowByContextKey = (contextKey: string) =>
    setActiveWindowByPredicate((window) => window.contextKey === contextKey);

  const setActiveWindowByIndex = (index: number) =>
    setActiveWindowByPredicate((_, idx) => idx === index);

  const registerWindowRef = (
    index: number,
    ref: RefObject<HTMLDivElement | null>
  ) => {
    setWindowRefs((prevRefs) => {
      const newRefs = [...prevRefs];
      newRefs[index] = ref;
      return newRefs;
    });
  };

  const initiateWindowCleanup = useCallback(() => {
    const gap = 8;
    const rowHeight = 90;
    const windowMargin = windowSoftLeftBorder;
    const availableWidth = window.innerWidth - windowMargin;
    const newCleanupData: { newX: number; newY: number }[] = [];
    const newOrder: number[] = [];

    const getMinWidth = (
      windowData: WindowData,
      ref: RefObject<HTMLDivElement | null>
    ) => {
      if (windowData.disableWidthAdjustment) {
        return ref.current?.offsetWidth ?? 0;
      }

      return Math.max(
        windowData.minWidth ?? 0,
        (windowData.minHeight ?? 0) * (windowData.minAspectRatio ?? 0)
      );
    };

    const sortedWindows = windows
      .map((data, idx) => {
        const ref = windowRefs[idx];
        const refWidth = getMinWidth(data, ref);

        return {
          order: windowOrder[idx],
          idx,
          refWidth,
        };
      })
      .sort((a, b) => b.refWidth - a.refWidth);

    const rows: number[][] = [];

    for (const { idx, refWidth } of sortedWindows) {
      let placedInRow = false;

      for (let r = 0; r < rows.length; r++) {
        const rowWidth = rows[r].reduce((sum, windowIdx) => {
          const otherData = windows[windowIdx];
          const otherRef = windowRefs[windowIdx];
          const otherRefWidth = getMinWidth(otherData, otherRef);
          return sum + otherRefWidth + gap;
        }, windowMargin);

        if (rowWidth + refWidth + gap <= availableWidth) {
          rows[r].push(idx);
          placedInRow = true;
          break;
        }
      }

      if (!placedInRow) {
        rows.push([idx]);
      }
    }

    const sortedRows = rows
      .map((row) => ({
        row,
        totalWidth: row.reduce((sum, windowIdx) => {
          const ref = windowRefs[windowIdx];
          const data = windows[windowIdx];
          const refWidth = getMinWidth(data, ref);
          return sum + refWidth + gap;
        }, windowMargin),
      }))
      .sort((a, b) => b.totalWidth - a.totalWidth)
      .map(({ row }) => row.sort((a, b) => windowOrder[a] - windowOrder[b]));

    sortedRows
      .flatMap((row, rowIndex) => {
        let currentRowWidth = windowMargin;

        return row.map((windowIdx) => {
          const ref = windowRefs[windowIdx];
          const data = windows[windowIdx];

          const refWidth = getMinWidth(data, ref);

          newCleanupData[windowIdx] = {
            newX: currentRowWidth,
            newY: windowSoftTopBorder + rowIndex * rowHeight,
          };

          currentRowWidth += refWidth + gap;

          return windowIdx;
        });
      })
      .reduce((acc, windowIdx, index) => {
        acc[windowIdx] = index;
        return acc;
      }, newOrder);

    setWindowCleanupData(newCleanupData);
    setWindowOrder(newOrder);
  }, [windowRefs, windows, windowOrder]);

  const modifyWindowSavePropsByIndex = (
    index: number,
    newProps: Record<string, any>
  ) => {
    setWindowSaveProps((prevProps) => {
      const newSaveProps = [...prevProps];
      newSaveProps[index] = { ...newSaveProps[index], ...newProps };
      return newSaveProps;
    });
  };

  const updateWindowStateByIndex = (
    index: number,
    updater: ((state: WindowState) => WindowState) | Partial<WindowState>
  ) => {
    setWindowStates((prevStates) => {
      const newStates = [...prevStates];
      if (typeof updater === "function") {
        newStates[index] = updater(newStates[index]);
      } else {
        newStates[index] = { ...newStates[index], ...updater };
      }
      return newStates;
    });
  };

  const updateWindowDataByIndex = (
    index: number,
    updater: ((data: WindowData) => WindowData) | Partial<WindowData>
  ) => {
    setWindows((prevWindows) => {
      const newWindows = [...prevWindows];
      if (typeof updater === "function") {
        newWindows[index] = updater(newWindows[index]);
      } else {
        newWindows[index] = { ...newWindows[index], ...updater };
      }
      return newWindows;
    });
  };

  const saveWindows = useCallback(
    (doSync: boolean = true) => {
      if (settings.disableWindowSaving) {
        return;
      }

      setWindows((currentWindows) => {
        setWindowStates((currentWindowStates) => {
          setWindowOrder((currentWindowOrder) => {
            setWindowSaveProps((currentWindowSaveProps) => {
              const savedWindows = currentWindows
                .map((window, index) => {
                  if (!window.saveComponentKey) {
                    return null;
                  }

                  const { x, y, width, height } = currentWindowStates[index];

                  return {
                    order: currentWindowOrder[index],
                    centerX: Math.round(x + width / 2),
                    centerY: Math.round(y + height / 2),
                    width: !window.disableWidthAdjustment
                      ? Math.round(width)
                      : window.defaultWidth,
                    height: !window.disableHeightAdjustment
                      ? Math.round(height)
                      : window.defaultHeight,
                    data: window.requireAllDataSaved // The window usually doesn't need all of its data saved, as the window data is not meant to be changed during the window's use, so they need not be saved unless necessary. The missing values are drawn from the default preset. requireAllDataSaved overrides specificDataToBeSaved, which specifies which key to save.
                      ? _.omit(window, [
                          "uniqueId",
                          "content",
                          "defaultCenterX",
                          "defaultCenterY",
                          "defaultWidth",
                          "defaultHeight", // These fields are never saved no matter what situation. They are not meant to be saved for various reasons.
                        ])
                      : {
                          ...Object.fromEntries(
                            _.without(
                              window.specificDataKeyToBeSaved ?? [],
                              "uniqueId",
                              "content",
                              "defaultCenterX",
                              "defaultCenterY",
                              "defaultWidth",
                              "defaultHeight"
                            ).map((key) => [key, window[key]])
                          ),
                          saveComponentKey: window.saveComponentKey, // saveComponentKey is always saved, since this is needed to identify which preset this window should use upon restoration.
                          countsToLimit: window.countsToLimit, // countsToLimit is always saved, since this field is not a part of the default preset.
                        },
                    initialProps: currentWindowSaveProps[index],
                  };
                })
                .filter(Boolean) as WindowSaveData[];

              setWindowSaveDataBuffer({ data: savedWindows, doSync });

              return currentWindowSaveProps;
            });
            return currentWindowOrder;
          });
          return currentWindowStates;
        });
        return currentWindows;
      });
    },
    [settings.disableWindowSaving, setWindowSaveDataBuffer]
  );

  const restoreWindowFromSave = (
    save: WindowSaveData[],
    viewportDimension: {
      width: number;
      height: number;
    }
  ) => {
    const filteredSave = save.filter(
      (saveData) =>
        saveData.data.saveComponentKey &&
        saveData.data.saveComponentKey in windowEntryMap
    );

    setWindows(
      filteredSave.map((saveData) => ({
        ..._.omit(
          windowEntryMap?.[saveData.data.saveComponentKey as WindowPickerEntry]
            .window,
          ["uniqueId", "content"]
        ),
        ...saveData.data,
        uniqueId: `window-${_.uniqueId()}`,
        content: cloneElement(
          (windowEntryMap?.[saveData.data.saveComponentKey as WindowPickerEntry]
            ?.window?.content ?? null) as any,
          saveData.initialProps
        ),
        defaultCenterX:
          (saveData.centerX / viewportDimension.width) * window.innerWidth,
        defaultCenterY:
          (saveData.centerY / viewportDimension.height) * window.innerHeight,
        defaultWidth: saveData.width,
        defaultHeight: saveData.height,
      }))
    );

    const originalOrder = filteredSave.map((data) => data.order);
    const rankMap = new Map<number, number>();
    originalOrder
      .slice()
      .sort((a, b) => a - b)
      .forEach((v, i) => rankMap.has(v) || rankMap.set(v, i));
    const occurrenceMap = new Map<number, number>();
    const condensedOrder = originalOrder.map(
      (v) =>
        rankMap.get(v)! +
        (occurrenceMap.set(v, (occurrenceMap.get(v) || 0) + 1).get(v)! - 1)
    );

    setWindowOrder(condensedOrder);
    setWindowSaveProps(filteredSave.map((data) => data.initialProps));
    setWindowRefs(filteredSave.map(() => ({ current: null })));
    setWindowCleanupData(filteredSave.map(() => null));
    setWindowStates(
      filteredSave.map((data) => ({
        x: -300 - data.width,
        y: -300 - data.height,
        width: data.width,
        height: data.height,
      }))
    );
  };

  useEffect(() => {
    if (shouldAnnounceNotification) {
      setShouldAnnounceNotification(false);
      appendToast({
        title: "Window",
        icon: "window",
        description: `No more than ${settings.windowLimit} window${
          settings.windowLimit === 1 ? "" : "s"
        } is allowed.`,
      });
    }
  }, [shouldAnnounceNotification]);

  useEffect(() => {
    if (windowSaveDataBuffer) {
      updateSettings(
        {
          windowSaveData: {
            windows: windowSaveDataBuffer.data,
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight,
            },
          },
        },
        windowSaveDataBuffer.doSync
      );

      setWindowSaveDataBuffer(null);
    }
  }, [windowSaveDataBuffer]);

  return (
    <WindowContext.Provider
      value={{
        windows,
        windowOrder,
        appendWindow,
        clearWindow,
        removeWindowByIndex,
        removeWindowByContextKey,
        removeWindowByUniqueId,
        setActiveWindowByIndex,
        setActiveWindowByUniqueId,
        setActiveWindowByContextKey,
        windowRefs,
        registerWindowRef,
        isWindowMinimized,
        setIsWindowMinimized,
        initiateWindowCleanup,
        windowCleanupData,
        windowSaveProps,
        modifyWindowSavePropsByIndex,
        restoreWindowFromSave,
        saveWindows,
        windowStates,
        updateWindowStateByIndex,
        updateWindowDataByIndex,
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
