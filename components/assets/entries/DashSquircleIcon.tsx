import type { ImageIconProps } from "@/src/features/entries/model/entry";
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
        className={color ? "" : "stroke-text"}
        strokeWidth={strokeWidth}
        rx={224}
        strokeDasharray="150 200"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
