import type { IconProps } from "@/src/ui/icons";
export default function AddPlusIcon({ className = "", size, strokeWidth = 110 }: IconProps) {
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
        d="M311.501 512H512m0 0h200.499M512 512v200.499M512 512V311.501m0 651.621C262.852 963.122 60.878 761.15 60.878 512 60.878 262.852 262.852 60.878 512 60.878c249.15 0 451.122 201.974 451.122 451.122 0 249.15-201.972 451.122-451.122 451.122"
      />
    </svg>
  );
}
