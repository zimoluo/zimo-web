interface WindowData {
  content: React.ReactNode;
  defaultHeight: WindowDimension;
  defaultWidth: WindowDimension;
  minHeight?: number;
  minWidth?: number;
  maxHeight?: number;
  maxWidth?: number;
  disableWidthAdjustment?: boolean;
  disableHeightAdjustment?: boolean;
  disableClose?: boolean;
  disableMove?: boolean;
  layer?: number;
  contextKey?: string;
  uniqueId: string;
  allowOverflow?: boolean;
  defaultCenterX?: number;
  defaultCenterY?: number;
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
}
