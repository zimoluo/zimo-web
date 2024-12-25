export default function DashSquircleIcon({
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
      aria-label="Dash squircle icon"
    >
      <rect
        width={960}
        height={960}
        x={32}
        y={32}
        stroke={color || undefined}
        className={color ? "" : "stroke-primary"}
        strokeWidth={strokeWidth}
        rx={225}
        strokeDasharray="150 200"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
