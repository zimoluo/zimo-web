type ToastIcon =
  | "generic"
  | "comment"
  | "settings"
  | "management"
  | "themeMaker"
  | "notebook"
  | "blank"
  | "photo"
  | "window"
  | "faviconOutline"
  | "calculator"
  | "link"
  | "search"
  | "navigator"
  | "signal"
  | "trashCan"
  | "pin"
  | "sharing";

interface ToastEntry {
  icon?: ToastIcon;
  title: string;
  description?: string;
  id?: string;
}

type Direction = "up" | "down" | "left" | "right";
