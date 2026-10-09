import type { IconProps } from "@/src/ui/icons";
export default function PauseTrackIcon({ className = "", size , strokeWidth}: IconProps) {
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
      <path
        fill="none"

        stroke="currentColor"
        strokeWidth={strokeWidth ?? 2.45}
        d="M7.722 3.164v17.672m8.556-17.672v17.672"
      />
    </svg>
  );
}
