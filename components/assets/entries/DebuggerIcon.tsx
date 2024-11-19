export default function DebuggerIcon({
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
      aria-label="Debugger icon"
    >
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={strokeWidth}
        strokeDasharray="130 150"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 173.804C21 89.413 89.413 21 173.804 21h452.392C710.587 21 779 89.413 779 173.804v452.392C779 710.587 710.587 779 626.196 779H173.804C89.413 779 21 710.587 21 626.196V173.804Z"
      />
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        d="m516.721 299.986 5.72 5.719c44.443 44.445 66.666 66.668 66.666 94.281 0 27.614-22.223 49.837-66.666 94.28l-5.72 5.72M443.194 239l-43.136 160.986-43.137 160.99M283.386 299.986l-5.719 5.719C233.222 350.15 211 372.373 211 399.986c0 27.614 22.222 49.837 66.667 94.28l5.719 5.72"
      />
    </svg>
  );
}
