export default function RSSIcon({
  className = "",
  color,
  isSaturated = false,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 256 256"
      className={`scale-[0.925] ${className}`}
      aria-label="RSS feed icon"
    >
      <g
        className={color ? "" : isSaturated ? "fill-saturated" : "fill-primary"}
        fill={color || undefined}
      >
        <path d="M0 87v48.9c31.9 0 62.1 12.6 84.7 35.2s35.1 52.8 35.1 84.8v.1h49.1c0-46.6-19-88.7-49.6-119.4C88.8 106 46.6 87.1 0 87ZM34 187.898c-9.4 0-17.8 3.8-24 10-6.2 6.2-10 14.6-10 24 0 9.3 3.8 17.7 10 23.9 6.2 6.1 14.6 9.9 24 9.9s17.8-3.7 24-9.9c6.2-6.2 10-14.6 10-23.9 0-9.4-3.8-17.8-10-24-6.2-6.2-14.6-10-24-10Z" />
        <path d="M180.9 75.1C134.6 28.7 70.7 0 .1 0v48.9c114.1.1 206.8 93 206.9 207.1h49c0-70.6-28.7-134.5-75.1-180.9Z" />
      </g>
    </svg>
  );
}
