export default function NoSignIcon({
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
      viewBox="0 0 640 640"
      aria-label="Toggle sidebar"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        fillRule="evenodd"
        d="M71.111 320c0-55.787 18.667-107.236 49.813-148.8L468.8 519.076c-41.564 31.146-93.013 49.813-148.8 49.813-137.209 0-248.889-111.68-248.889-248.889m497.778 0c0 55.787-18.667 107.236-49.813 148.8L171.2 120.924c41.564-31.146 93.013-49.813 148.8-49.813 137.209 0 248.889 111.68 248.889 248.889M320 0C143.253 0 0 143.253 0 320s143.253 320 320 320 320-143.253 320-320S496.747 0 320 0"
      />
    </svg>
  );
}
