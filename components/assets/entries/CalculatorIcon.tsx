export default function CalculatorIcon({
  className = "",
  color,
  strokeWidth = 64,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1024 1024"
      className={className}
      aria-label="Calculator icon"
    >
      <rect
        width={960}
        height={960}
        x={32}
        y={32}
        stroke={color || undefined}
        className={color ? "" : "stroke-primary"}
        strokeWidth={strokeWidth}
        rx={224}
      />
      <path
        stroke={color || undefined}
        className={color ? "" : "stroke-primary"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M801.56 343.349H608.706M801.56 632.396H608.706M801.56 776.92H608.706M415.854 343.349h-96.428m0 0H223m96.426 0V247m0 96.349v96.35m72.32 192.697-72.318 72.263m0 0-72.32 72.261m72.32-72.261-72.322-72.263m72.322 72.263 72.318 72.261"
      />
    </svg>
  );
}
