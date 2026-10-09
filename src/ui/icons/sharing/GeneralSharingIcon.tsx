import type { IconProps } from "@/src/ui/icons";
export default function GeneralSharingIcon({ className = "", size, strokeWidth = 64 }: IconProps) {
  return (
    <svg width={size} height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1024 1024"
      className={className} aria-hidden="true"
    >
      <g

        stroke="currentColor"
        strokeWidth={strokeWidth}
      >
        <path d="M360 512c0 72.349-58.203 131-130 131s-130-58.651-130-131c0-72.349 58.203-131 130-131s130 58.651 130 131Z" />
        <path strokeLinecap="round" d="M621 224 360 408M621 800 360 616" />
        <path d="M882 851.5c0 72.073-58.427 130.5-130.5 130.5-72.073 0-130.5-58.427-130.5-130.5 0-72.073 58.427-130.5 130.5-130.5 72.073 0 130.5 58.427 130.5 130.5ZM882 172.5c0 72.073-58.427 130.5-130.5 130.5-72.073 0-130.5-58.427-130.5-130.5C621 100.427 679.427 42 751.5 42 823.573 42 882 100.427 882 172.5Z" />
      </g>
    </svg>
  );
}
