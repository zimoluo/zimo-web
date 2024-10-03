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
  cannotBeSaved?: boolean;
  layer?: number;
  contextKey?: string;
  uniqueId: string;
}

interface WindowState {
  width: WindowDimension;
  height: WindowDimension;
  data: WindowData;
  x: number;
  y: number;
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
  | "navigator";
