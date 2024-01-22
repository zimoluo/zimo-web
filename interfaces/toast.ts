type ToastIcon = "generic" | "comment" | "settings";

interface ToastEntry {
  icon?: ToastIcon;
  title: string;
  description?: string;
  id?: string;
}

type Direction = "up" | "down" | "left" | "right";
