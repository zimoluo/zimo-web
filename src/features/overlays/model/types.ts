export interface PopUp {
  content?: React.ReactNode;
  linkToPage?: string;
  onClose?: () => void;
  desktopOnly?: boolean;
  uniqueId: string;
  contextKey?: string;
  hasUtilityButton?: boolean;
  hasDarkOverlay?: boolean;
  darkOpacity?: number;
  tags?: string[];
}

export interface PopUpAction {
  closePopUp: () => void;
  isActivePopUp: boolean;
}
