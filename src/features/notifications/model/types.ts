export type ToastIcon =
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

export interface ToastEntry {
  icon?: ToastIcon;
  title: string;
  description?: string;
  id?: string;
}

export type Direction = "up" | "down" | "left" | "right";
