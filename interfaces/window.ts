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
}

interface WindowState {
  width: WindowDimension;
  height: WindowDimension;
  data: WindowData;
  x: WindowPosition;
  y: WindowPosition;
}

type WindowDimension = "fit" | number | "screen"; // in px

type WindowPosition = number | "center";

interface WindowAction {
  closeWindow: () => void;
  setActiveWindow: () => void;
}
