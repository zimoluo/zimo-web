import type { NotificationIcon } from "../model/queue";

const paths: Readonly<Record<NotificationIcon, string>> = {
  generic: "M12 8v8m0 0h.01M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0",
  cog: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2",
  comment: "M3 4h18v13H9l-6 4V4",
  heart: "M12 21 3 12a5 5 0 0 1 9-6 5 5 0 0 1 9 6l-9 9",
  warning: "M12 9v4m0 4h.01M12 3 2 21h20L12 3",
  check: "M5 13l4 4L19 7",
  cross: "M6 6l12 12M18 6 6 18",
  studio: "M3 21l5-1L21 7l-4-4L4 16l-1 5M14 6l4 4",
  notebook: "M5 3h15v18H5V3M2 7h6m-6 5h6m-6 5h6M11 7h5m-5 5h5",
  photo: "M3 3h18v18H3V3M3 18l6-6 4 4 4-7 4 9M7 7h.01",
  window: "M3 4h18v16H3V4M3 9h18M6 6h.01m3 0h.01",
  mark: "M4 5h16L4 19h16M6 3v18m12-18v18",
  calculator: "M5 2h14v20H5V2M8 5h8v4H8V5M8 13h.01m4 0h.01m4 0h.01M8 17h.01m4 0h.01m4 0h.01",
  link: "M10 13l4-4M8 16l-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M16 8l2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0",
  search: "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14M15 15l6 6",
  navigator: "M12 2 3 22l9-6 9 6L12 2",
  signal: "M2 12h3l3-8 4 16 4-16 3 8h3",
  trash: "M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7m4-7v7",
  pin: "M8 3h8l-1 6 4 4H5l4-4-1-6M12 13v9",
  sharing: "M7 12l10-7M7 12l10 7M3 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0M17 5a2 2 0 1 0 4 0 2 2 0 0 0-4 0M17 19a2 2 0 1 0 4 0 2 2 0 0 0-4 0",
  management: "M4 3h16v18H4V3M8 7h8m-8 5h8m-8 5h5",
  blank: "",
};

export function NotificationIconView({ icon, className }: {
  readonly icon: NotificationIcon;
  readonly className?: string;
}) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={paths[icon]} />
  </svg>;
}
