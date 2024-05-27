export default function LightBulbIcon({
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
      viewBox="0 0 640 640"
      className={className}
      aria-label="Light bulb icon"
    >
      <g
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={38}
      >
        <path
          strokeLinecap="butt"
          strokeLinejoin="miter"
          d="M114.452 251.484c0-113.521 92.027-205.548 205.548-205.548 113.52 0 205.548 92.027 205.548 205.548 0 60.859-26.45 115.543-68.483 153.18-30.714 27.502-46.073 41.255-50.209 46.358-13.341 16.466-13.93 17.784-17.296 38.706-1.044 6.487-1.044 16.266-1.044 35.82 0 25.614 0 38.421-5.509 47.961a41.1 41.1 0 0 1-15.046 15.046c-9.54 5.509-22.347 5.509-47.961 5.509s-38.421 0-47.961-5.509a41.1 41.1 0 0 1-15.047-15.046c-5.508-9.54-5.508-22.347-5.508-47.961 0-19.554 0-29.333-1.044-35.82-3.366-20.922-3.954-22.24-17.296-38.706-4.137-5.103-19.496-18.856-50.21-46.358-42.032-37.637-68.482-92.321-68.482-153.18Zm274.064 274.064H251.484"
        />
        <path d="m341.528 224.078-58.729 82.219h82.219l-58.727 82.219" />
      </g>
    </svg>
  );
}
