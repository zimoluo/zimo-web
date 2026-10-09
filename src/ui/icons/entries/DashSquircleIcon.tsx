import type { IconProps } from "@/src/ui/icons";
export default function DashSquircleIcon({ className = "", size, strokeWidth = 64 }: IconProps) {
  return (
    <svg width={size} height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1024 1024"
      className={className} aria-hidden="true"
    >
      <rect
        width={960}
        height={960}
        x={32}
        y={32}
        stroke="currentColor"

        strokeWidth={strokeWidth}
        rx={224}
        strokeDasharray="150 200"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
