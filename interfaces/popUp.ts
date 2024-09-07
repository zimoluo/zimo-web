interface PopUp {
  content?: React.ReactNode;
  linkToPage?: string;
  onClose?: () => void;
  desktopOnly?: boolean;
  id?: string;
  uniqueKey?: string;
  hasUtilityButton?: boolean;
  hasDarkOverlay?: boolean;
  darkOpacity?: number;
}
