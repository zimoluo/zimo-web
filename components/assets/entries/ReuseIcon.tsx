export default function ReuseIcon({
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
      aria-label="Reuse"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        d="m289.048 776.387.762-184.011-62.066 61.86L119.367 546.29s-30.89-30.787-.572-61.099l138.459-138.257-59.782-60.054-170.87 170.47s-60.639 59.816 1.189 120.393L165.63 715.335l-60.78 61.004h184.198zM438.501 289.73l-62.399-62.429 108.282-108.183s30.747-30.883 61.066-.57l138.411 138.257 60.543-60.054L573.342 26.518s-59.924-60.481-120.562 1.236L314.845 165.346l-61.114-61.622.429 185.721zm557.64 156.454L858.397 308.592l60.733-60.957H734.932l-.762 183.964 62.114-61.86 108.282 107.993s30.89 30.787.666 61.052l-138.458 138.21 60.162 60.386 170.491-170.802c0 .142 60.633-59.769-1.286-120.394M585.527 734.672l62.399 62.002-108.235 108.183s-30.795 30.787-61.114.57L340.595 767.645 280.1 827.746l170.681 169.805s59.972 60.389 120.562-1.33L709.23 858.676l61.066 61.147-.047-184.391z"
      />
    </svg>
  );
}
