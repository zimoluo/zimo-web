export default function NavigatorIcon({
  className = "",
  color,
  strokeWidth = 50,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 800 800"
      className={className}
      aria-label="Navigator icon"
    >
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M400 772c205.45 0 372-166.55 372-372S605.45 28 400 28 28 194.55 28 400s166.55 372 372 372Z"
      />
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m224 578 114.586-188.247a153.1 153.1 0 0 1 51.167-51.167L578 224 463.414 412.247a153.045 153.045 0 0 1-51.167 51.167L224 578Z"
      />
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        d="m363 363 74 74"
      />
    </svg>
  );
}
