import filterStyle from "./filter.module.css";

export default function RainbowFilter() {
  return (
    <div
      className={`pointer-events-none select-none  fixed w-screen h-screen inset-0 ${filterStyle.rainbow}`}
      aria-hidden="true"
    />
  );
}
