export default function SignalIcon({
  className = "",
  color,
  strokeWidth = 37,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 800 800"
      className={className}
      aria-label="Signal icon"
    >
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M541.42 258.579c78.106 78.104 78.106 204.738 0 282.845m-282.841-.004c-78.105-78.103-78.105-204.737 0-282.842m-94.281 377.125c-130.175-130.176-130.175-341.23 0-471.404m471.405.001c130.173 130.175 130.173 341.23 0 471.403M466.666 400c0 36.82-29.846 66.667-66.666 66.667-36.82 0-66.667-29.847-66.667-66.667 0-36.817 29.847-66.667 66.667-66.667s66.666 29.85 66.666 66.667Z"
      />
    </svg>
  );
}
