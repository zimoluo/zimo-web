import { ReactNode } from "react";

export interface WindowData {
  content: ReactNode;
  defaultHeight: string;
  defaultWidth: string;
  minHeight?: string;
  minWidth?: string;
  maxHeight?: string;
  maxWidth?: string;
  widthAdjustible?: boolean;
  heightAdjustible?: boolean;
  canBeClosed?: boolean;
  canBeMoved?: boolean;
  layer?: number;
}

export interface WindowState {
  width: string;
  height: string;
  data: WindowData;
  x: string;
  y: string;
}
