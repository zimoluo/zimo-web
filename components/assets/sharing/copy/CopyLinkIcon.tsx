export default function CopyLinkIcon({
  className = "",
  color,
  strokeWidth = 64,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1024 1024"
      className={className}
      aria-label="Copy link"
    >
      <g
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      >
        <path d="M421.376 604c-69.622-69.795-63.351-189.243 14.008-266.793l224.108-224.669C736.85 34.988 856 28.701 925.624 98.496c69.623 69.796 63.35 189.242-14.008 266.792L799.562 477.623" />
        <path d="M602.624 420c69.623 69.795 63.35 189.242-14.008 266.793L476.562 799.126 364.507 911.463c-77.358 77.551-196.509 83.834-266.131 14.039-69.622-69.794-63.35-189.242 14.007-266.792l112.056-112.338" />
      </g>
    </svg>
  );
}
