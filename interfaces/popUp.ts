interface PopUp {
  content?: React.ReactNode;
  linkToPage?: string;
  onClose?: () => void;
  desktopOnly?: boolean;
  uniqueId: string;
  contextKey?: string;
  hasUtilityButton?: boolean;
  hasDarkOverlay?: boolean;
  darkOpacity?: number;
}

interface PopUpAction {
  closePopUp: () => void;
}
