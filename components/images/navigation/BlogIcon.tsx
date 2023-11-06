export default function BlogIcon({
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
      <g
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth={40}
      >
        <path d="M194.37 336.542c99.993-47.108 176.529 33.251 245.988 255.591 69.458 222.339 135.297-225.978 218.106-432.345 82.81-206.367 184.048-249.357 308.669 419.224C1061.72 1086.46 490.277 1037 203.54 925.106 167.359 910.987 65.879 865.868 50.9 778.18 28.181 645.197 94.375 383.651 194.37 336.542Z" />
        <path d="M662.88 377.642c0-52.248 43.623-94.604 97.434-94.604 53.812 0 97.435 42.356 97.435 94.604s-43.623 94.604-97.435 94.604c-53.811 0-97.434-42.356-97.434-94.604Z" />
      </g>
    </svg>
  );
}
