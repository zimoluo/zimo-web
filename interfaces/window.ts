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

interface WindowSaveData {
  width: WindowDimension;
  height: WindowDimension;
  centerXProportion: number;
  centerYProportion: number;
  data: Omit<WindowData, "content" | "uniqueId">;
  contentSaveData: {
    name: string;
    data: Record<string, Exclude<any, Function>>;
  };
}

type WindowDimension = "fit" | number; // in px

interface WindowAction {
  closeWindow: () => void;
  setActiveWindow: () => void;
  isActiveWindow: boolean;
}
