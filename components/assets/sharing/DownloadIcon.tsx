export default function DownloadIcon({
  className = "",
  color,
  strokeWidth = 64,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      className={className}
      aria-label="Download page"
      fill="none"
    >
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        d="M512 236v418m0 0 162-162.353M512 654 350 491.647M655 777H369"
      />
      <circle
        cx={512}
        cy={512}
        r={476}
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
