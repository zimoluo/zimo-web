import type { IconProps } from "@/src/ui/icons";
export default function ReplyToIcon({ className = "", size }: IconProps) {
  return (
    <svg width={size} height={size}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
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

        fill="currentColor"
        d="M835.487 550.517 320.332 987.046c-25.104 21.274-45.454 11.842-45.454-21.063V58.017c0-32.905 20.35-42.335 45.454-21.063l515.155 436.529c25.104 21.272 25.104 55.762 0 77.034Z"
      />
    </svg>
  );
}
