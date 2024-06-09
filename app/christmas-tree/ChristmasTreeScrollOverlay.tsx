import overlayStyle from "./scroll-overlay.module.css";

interface Props {
  className?: string;
}

export default function ChristmasTreeScrollOverlay({ className = "" }: Props) {
  return (
    <div
      className={`fixed inset-0 w-screen h-screen ${overlayStyle.overlay} z-50 select-none pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
