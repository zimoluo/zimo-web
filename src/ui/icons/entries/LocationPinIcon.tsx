import type { IconProps } from "@/src/ui/icons";
export default function LocationPinIcon({ className = "", size, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size}
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      strokeMiterlimit={10}
      style={{
        fillRule: "nonzero",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
      viewBox="0 0 24 24"
      className={className} aria-hidden="true"
    >
      <g
        fill="none"

        stroke="currentColor"
        strokeWidth={strokeWidth}
      >
        <path d="M12 23.132c4.33-4.453 8.658-8.44 8.658-13.358 0-4.919-3.876-8.906-8.658-8.906S3.342 4.855 3.342 9.774c0 4.918 4.329 8.905 8.658 13.358Z" />
        <path d="M12 13.237a3.71 3.71 0 1 0 0-7.421 3.71 3.71 0 0 0 0 7.42Z" />
      </g>
    </svg>
  );
}
