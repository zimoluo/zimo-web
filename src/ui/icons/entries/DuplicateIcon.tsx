import type { IconProps } from "@/src/ui/icons";
export default function DuplicateIcon({ className = "", size, strokeWidth = 110 }: IconProps) {
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
      viewBox="0 0 1024 1024" aria-hidden="true"
      className={className}
    >
      <path
        fill="none"

        stroke="currentColor"
        strokeWidth={strokeWidth}
        d="M179.839 714.531h-22.268c-27.964 0-50.633-22.669-50.633-50.633V157.571c0-27.964 22.669-50.633 50.633-50.633h506.327c27.964 0 50.633 22.669 50.633 50.633v18.595M360.102 917.062h506.327c27.964 0 50.633-22.669 50.633-50.633V360.102c0-27.964-22.669-50.633-50.633-50.633H360.102c-27.964 0-50.633 22.669-50.633 50.633v506.327c0 27.964 22.669 50.633 50.633 50.633"
      />
    </svg>
  );
}
