export default function PlaybackSpeedIcon({
  className = "",
  color,
}: ImageIconProps) {
  return (
    <svg
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
      className={className}
      aria-label="Playback speed"
    >
      <g
        fill="none"
        className={color ? "" : "stroke-saturated"}
        stroke={color || undefined}
        strokeLinejoin="miter"
        strokeWidth={1.8}
      >
        <path d="M12 21.644a9.644 9.644 0 0 0 0-19.288" />
        <path
          strokeDasharray="4.0,3.0,4.0,3.0"
          d="M12 21.644a9.644 9.644 0 0 1 0-19.288"
        />
        <path
          strokeLinecap="butt"
          d="M15.414 10.941c.781.462.781 1.656 0 2.118l-4.72 2.787C9.934 16.294 9 15.71 9 14.786V9.214c0-.924.934-1.507 1.694-1.059l4.72 2.787Z"
        />
      </g>
    </svg>
  );
}
