import { ReactNode } from "react";

export interface PopUp {
  content?: ReactNode;
  linkToPage?: string;
  onClose?: () => void;
  desktopOnly?: boolean;
  id?: string;
  uniqueKey?: string;
  hasUtilityButton?: boolean;
  hasDarkOverlay?: boolean;
  darkOpacity?: number;
}
