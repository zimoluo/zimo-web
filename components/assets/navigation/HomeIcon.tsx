export default function HomeIcon({
  color = null,
  className = "",
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1024 1024"
      aria-label="Navigate to homepage"
      className={className}
    >
      <g
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={64}
      >
        <path d="M512 992c265.097 0 480-214.903 480-480S777.097 32 512 32 32 246.903 32 512s214.903 480 480 480Z" />
        <path
          strokeLinejoin="round"
          d="M801 895.282V495.926L512 221 223 495.926v399.356m417.658 79.281V735.178c0-78.806-57.571-142.755-128.658-142.755-71.087 0-128.658 63.949-128.658 142.755v239.385"
        />
      </g>
    </svg>
  );
}
