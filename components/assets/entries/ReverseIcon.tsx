export default function ReverseIcon({
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
      aria-label="Reverse order"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        d="M954.407 265.03 748.636 110.702a51.44 51.44 0 0 0-54.014-4.63 50.26 50.26 0 0 0-28.294 45.784v102.886H100.459c-28.412 0-51.443 23.031-51.443 51.442s23.032 51.443 51.443 51.443h565.869v102.885a50.82 50.82 0 0 0 28.294 45.784 50.93 50.93 0 0 0 54.014-4.629l205.771-154.328a51.444 51.444 0 0 0 0-82.309M69.593 676.572l205.771-154.328a51.44 51.44 0 0 1 54.014-4.63 50.26 50.26 0 0 1 28.294 45.784v102.885h565.869c28.411 0 51.443 23.032 51.443 51.443s-23.032 51.442-51.443 51.442H357.672v102.886a50.83 50.83 0 0 1-28.294 45.784 50.93 50.93 0 0 1-54.014-4.63L69.593 758.88a51.442 51.442 0 0 1 0-82.308"
      />
    </svg>
  );
}
