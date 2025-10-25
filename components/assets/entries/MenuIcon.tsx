export default function MenuIcon({
  className = "",
  color,
  isActive = false,
}: ImageIconProps & {
  isActive?: boolean;
}) {
  const leftCircle = { x: 338 - 79.5, y: 226 + 79.5 };
  const rightCircle = { x: 765.5, y: 717.5 };

  const [leftX, rightX] = isActive
    ? [rightCircle.x, leftCircle.x]
    : [leftCircle.x, rightCircle.x];

  const circleStyle = (x: number, y: number) => ({
    transform: `translate(${x}px, ${y}px)`,
    transition: "transform 200ms cubic-bezier(.37,.01,.11,.93)",
    transformBox: "fill-box" as const,
    transformOrigin: "center" as const,
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1024 1024"
      className={className}
      aria-label="Menu"
    >
      <rect
        width={784}
        height={278}
        x={904}
        y={445}
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={64}
        rx={139}
        transform="rotate(180 904 445)"
      />

      <circle
        cx={0}
        cy={0}
        r={79.5}
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        style={circleStyle(leftX, leftCircle.y)}
        opacity={0.67}
      />

      <rect
        width={784}
        height={278}
        x={32}
        y={-32}
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={64}
        rx={139}
        transform="matrix(1 0 0 -1 88 824)"
      />

      <circle
        cx={0}
        cy={0}
        r={79.5}
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        style={circleStyle(rightX, rightCircle.y)}
        opacity={0.67}
      />
    </svg>
  );
}
