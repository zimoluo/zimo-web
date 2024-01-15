type ToastIcon = "generic" | "comment";

interface ToastEntry {
  icon?: ToastIcon;
  title: string;
  description?: string;
  id?: string;
}
