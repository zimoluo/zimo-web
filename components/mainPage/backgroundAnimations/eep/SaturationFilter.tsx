import filterStyle from "./filter.module.css";

export default function SaturationFilter() {
  return (
    <div
      className={`pointer-events-none select-none z-90 fixed w-screen h-screen inset-0 ${filterStyle.saturate}`}
      aria-hidden="true"
    />
  );
}
