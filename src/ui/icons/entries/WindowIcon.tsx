import type { IconProps } from "@/src/ui/icons";
export default function WindowIcon({ className = "", size , strokeWidth}: IconProps) {
  return (
    <svg width={size} height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1024 1024"
      className={className} aria-hidden="true"
    >
      <g  stroke="currentColor">
        <rect
          width={948}
          height={586}
          x={38}
          y={199}
          strokeWidth={strokeWidth ?? 64}
          rx={136}
        />
        <path
          strokeLinecap="round"
          strokeWidth={strokeWidth ?? 64}
          d="M323 898h397M221 898h0"
        />
        <path
          strokeLinecap="round"
          strokeWidth={strokeWidth ?? 64}
          d="M192 365H720M192 600H584.343M192 485.819H636.212"
          opacity={0.66}
        />
      </g>
    </svg>
  );
}
