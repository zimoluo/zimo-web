import type { IconProps } from "@/src/ui/icons";
export default function DownloadIcon({ className = "", size, strokeWidth = 64 }: IconProps) {
  return (
    <svg width={size} height={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      className={className} aria-hidden="true"
      fill="none"
    >
      <path

        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        d="M512 236v418m0 0 162-162.353M512 654 350 491.647M655 777H369"
      />
      <circle
        cx={512}
        cy={512}
        r={476}

        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
