export default function AboutIcon({
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
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <g>
        <path
          fill="none"
          className={color ? "" : "stroke-primary"}
          stroke={color || undefined}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeWidth={40}
          d="M24.84 213.985c0-104.461 84.684-189.145 189.145-189.145h596.03c104.461 0 189.145 84.684 189.145 189.145v596.03c0 104.461-84.684 189.145-189.145 189.145h-596.03c-104.461 0-189.145-84.684-189.145-189.145v-596.03Z"
        />
        <g className={color ? "" : "fill-primary"} fill={color || undefined}>
          <path d="M454.965 512c0-31.499 25.536-57.035 57.035-57.035 31.499 0 57.035 25.536 57.035 57.035 0 31.499-25.536 57.035-57.035 57.035-31.499 0-57.035-25.536-57.035-57.035Z" />
          <path d="M264.083 512c0-31.499 25.535-57.035 57.034-57.035 31.5 0 57.035 25.536 57.035 57.035 0 31.499-25.535 57.035-57.035 57.035-31.499 0-57.034-25.536-57.034-57.035Z" />
          <path d="M645.848 512c0-31.499 25.535-57.035 57.035-57.035 31.499 0 57.034 25.536 57.034 57.035 0 31.499-25.535 57.035-57.034 57.035-31.5 0-57.035-25.536-57.035-57.035Z" />
        </g>
      </g>
    </svg>
  );
}
