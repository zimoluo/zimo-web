import type { IconProps } from "@/src/ui/icons";
export default function LoopTrackIcon({ className = "", size , strokeWidth}: IconProps) {
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
        strokeWidth={strokeWidth ?? 2}
        d="m17.706 3.12 2.853 2.853m0 0-2.853 2.853m2.853-2.853H7.245a3.804 3.804 0 0 0-3.804 3.804m2.853 8.559-2.853-2.853m0 0 2.853-2.853m-2.853 2.853h13.314c2.1 0 3.804-1.703 3.804-3.804"
      />
      <path

        fill="currentColor"
        d="M9.812 21.386a2.188 2.188 0 1 1 4.376 0 2.188 2.188 0 0 1-4.376 0Z"
      />
    </svg>
  );
}
