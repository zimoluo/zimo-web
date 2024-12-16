export default function NotebookIcon({
  className = "",
  color,
  strokeWidth = 48,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 800 800"
      className={className}
      aria-label="Notebook icon"
    >
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={strokeWidth}
        d="M80 257.6c0-100.692 0-151.038 31.34-182.319C142.679 44 193.119 44 294 44h214c100.88 0 151.319 0 182.66 31.281C722 106.562 722 156.908 722 257.6v284.8c0 100.691 0 151.037-31.34 182.318C659.319 756 608.88 756 508 756H294c-100.881 0-151.321 0-182.66-31.282C80 693.437 80 643.091 80 542.4V257.6Z"
      />
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        d="M259 61v695M45 400h71M45 543h71M45 257h71M383 204h179M383 329h179"
      />
    </svg>
  );
}
