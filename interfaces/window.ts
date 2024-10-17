interface WindowData {
  content: React.ReactNode;
  defaultHeight: WindowDimension;
  defaultWidth: WindowDimension;
  defaultCenterX?: number;
  defaultCenterY?: number;
  minHeight?: number;
  minWidth?: number;
  maxHeight?: number;
  maxWidth?: number;
  disableWidthAdjustment?: boolean;
  disableHeightAdjustment?: boolean;
  disableClose?: boolean;
  disableMove?: boolean;
  disableExpandToScreen?: boolean;
  allowOverflow?: boolean;
  disableBlur?: boolean;
  disableShadow?: boolean;
  countsToLimit?: boolean;
  layer?: number;
  contextKey?: string;
  uniqueId: string;
  tags?: string[];
  saveComponentKey?: string;
}

interface WindowState {
  width: WindowDimension;
  height: WindowDimension;
  x: number;
  y: number;
}

interface WindowSaveData {
  centerX: number;
  centerY: number;
  order: number;
  width: WindowDimension;
  height: WindowDimension;
  data: Omit<WindowData, "uniqueId" | "content">;
  initialProps: Record<string, any>;
}

type WindowDimension = "fit" | number; // in px

interface WindowAction {
  closeWindow: () => void;
  setActiveWindow: () => void;
  isActiveWindow: boolean;
  windowContentRef: React.RefObject<HTMLDivElement> | null;
  uniqueId: string;
  isWindowDragging: boolean;
  isWindowResizing: boolean;
  modifyWindowSaveProps: (newProps: Record<string, any>) => void;
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
  | "blank";
