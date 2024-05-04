export default function CircledEllipsisIcon({
  color = null,
  className = "",
  height,
  width,
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
      viewBox="0 0 1024 1024"
      aria-label="Circled Ellipsis"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        d="M282.096 512c0-31.743 25.733-57.476 57.476-57.476s57.476 25.733 57.476 57.476-25.733 57.476-57.476 57.476-57.476-25.733-57.476-57.476m172.428 0c0-31.743 25.733-57.476 57.476-57.476s57.476 25.733 57.476 57.476-25.733 57.476-57.476 57.476-57.476-25.733-57.476-57.476m287.38 0c0 31.744-25.732 57.476-57.476 57.476S626.952 543.744 626.952 512s25.732-57.476 57.476-57.476 57.476 25.732 57.476 57.476"
      />
      <path
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="butt"
        strokeWidth={110}
        d="M60.878 512C60.878 262.852 262.852 60.878 512 60.878S963.122 262.852 963.122 512 761.148 963.122 512 963.122 60.878 761.148 60.878 512Z"
      />
    </svg>
  );
}
