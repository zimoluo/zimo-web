export default function DebuggerIcon({
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
      aria-label="Debugger icon"
    >
      <rect
        width={960}
        height={960}
        x={32}
        y={32}
        stroke={color || undefined}
        className={color ? "" : "stroke-primary"}
        strokeWidth={strokeWidth}
        rx={224}
        strokeDasharray="150 200"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        d="m661.403 383.982 7.322 7.32c56.887 56.89 85.332 85.335 85.332 120.68 0 35.346-28.445 63.791-85.332 120.678l-7.322 7.322M567.288 305.92l-55.214 206.062-55.215 206.067m-94.125-334.067-7.32 7.32c-56.89 56.89-85.334 85.335-85.334 120.68 0 35.346 28.444 63.791 85.334 120.678l7.32 7.322"
      />
    </svg>
  );
}
