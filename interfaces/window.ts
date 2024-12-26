interface WindowData {
  content: React.ReactNode;
  defaultHeight: number;
  defaultWidth: number;
  defaultCenterX?: number;
  defaultCenterY?: number;
  minHeight?: number;
  minWidth?: number;
  maxHeight?: number;
  maxWidth?: number;
  minAspectRatio?: number;
  maxAspectRatio?: number;
  disableWidthAdjustment?: boolean;
  disableHeightAdjustment?: boolean;
  disableExpandToScreen?: boolean;
  cornerRadius?: number;
  allowOverflow?: boolean;
  disableBlur?: boolean;
  disableShadow?: boolean;
  countsToLimit?: boolean;
  layer?: number;
  contextKey?: string;
  uniqueId: string;
  tags?: string[];
  saveComponentKey?: WindowPickerEntry;
  reducedStartingAnimation?: boolean;
  removeStartingAnimation?: boolean;
  requireAllDataSaved?: boolean;
  specificDataKeyToBeSaved?: (keyof WindowData)[];
}

interface WindowState {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface WindowSaveData {
  centerX: number;
  centerY: number;
  order: number;
  width: number;
  height: number;
  data: Omit<
    WindowData,
    | "uniqueId"
    | "content"
    | "defaultCenterX"
    | "defaultCenterY"
    | "defaultWidth"
    | "defaultHeight"
  >;
  initialProps: Record<string, any>;
}

interface WindowAction {
  closeWindow: () => void;
  setActiveWindow: () => void;
  isActiveWindow: boolean;
  windowContentRef: React.RefObject<HTMLDivElement> | null;
  uniqueId: string;
  isWindowDragging: boolean;
  isWindowResizing: boolean;
  modifyWindowSaveProps: (newProps: Record<string, any>) => void;
  windowData: WindowData;
  setWindowData: (
    updater: ((data: WindowData) => WindowData) | Partial<WindowData>
  ) => void;
  windowState: WindowState;
  setWindowState: (
    updater: ((state: WindowState) => WindowState) | Partial<WindowState>
  ) => void;
}

interface WindowPickerSection {
  title: string;
  entries: WindowPickerEntry[];
}

type WindowPickerEntry =
  | "blog"
  | "projects"
  | "photos"
  | "management"
  | "faviconWidget"
  | "zimoWebInWindow"
  | "themeMakerToolset"
  | "settingsPanel"
  | "notebook"
  | "navigator"
  | "wikipedia"
  | "calculator"
  | "blank"
  | "signalGenerator"
  | "debugger"
  | "stickyNotes";
