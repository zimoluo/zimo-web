export default function BroomIcon({
  className = "",
  color,
  strokeWidth = 48,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 800 800"
      className={className}
      aria-label="Broom icon"
    >
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="m471 188.999 114 69.334L637 173c19-31.333 9-72.667-22.333-91.667-31.334-19-72.667-9-91.667 22.333l-52 85.333ZM406 305.332l105.333 64.001C572.667 406.667 591.334 482 561.667 542l-68.333 139.333c-22 45-75.334 60.667-118.001 34.334L161 585.333c-43-26-53.333-80.333-23.667-120.666L229.667 340c40-54 115-72.001 176.333-34.668Z"
      />
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="m441.444 169.93 170.82 104.02-69.347 113.88-170.82-104.02 69.347-113.88ZM323 560.337l-55 90.333M408.333 612.333l-54.999 90.334M237.667 508.333l-55 90.334"
      />
    </svg>
  );
}
