import type { IconProps } from "@/src/ui/icons";
export default function UpDownSwitchIcon({ className = "", size , strokeWidth}: IconProps) {
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
      viewBox="0 0 1024 1024"
      className={className} aria-hidden="true"
    >
      <path
        fill="none"

        stroke="currentColor"
        strokeWidth={strokeWidth ?? 140}
        d="M881.393 696.696 512 327.304 142.607 696.696"
      />
    </svg>
  );
}
