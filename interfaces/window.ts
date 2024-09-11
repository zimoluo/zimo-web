interface WindowData {
  content: React.ReactNode;
  defaultHeight: WindowDimension;
  defaultWidth: WindowDimension;
  minHeight?: WindowDimension;
  minWidth?: WindowDimension;
  maxHeight?: WindowDimension;
  maxWidth?: WindowDimension;
  disableWidthAdjustment?: boolean;
  disableHeightAdjustment?: boolean;
  disableClose?: boolean;
  disableMove?: boolean;
  layer?: number;
  uniqueKey?: string;
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
