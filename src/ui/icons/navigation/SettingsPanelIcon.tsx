import type { IconProps } from "@/src/ui/icons";
export default function SettingsPanelIcon({ className = "", size, strokeWidth = 64 }: IconProps) {
  return (
    <svg width={size} height={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024" aria-hidden="true"
      className={className}
    >
      <path

        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        fill="none"
        d="M824 512H200"
      />
    </svg>
  );
}
