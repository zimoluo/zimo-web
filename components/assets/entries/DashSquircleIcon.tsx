export default function DashSquircleIcon({
  className = "",
  color,
  strokeWidth = 31,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 800 800"
      className={className}
      aria-label="Dash squircle icon"
    >
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeDasharray="130 150"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M21 173.804C21 89.413 89.413 21 173.804 21h452.392C710.587 21 779 89.413 779 173.804v452.392C779 710.587 710.587 779 626.196 779H173.804C89.413 779 21 710.587 21 626.196V173.804Z"
      />
    </svg>
  );
}
