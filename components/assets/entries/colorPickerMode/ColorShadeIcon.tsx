"id random";

export default function ColorShadeIcon({
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
      viewBox="0 0 216 216"
      aria-label="Color shade mode"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <clipPath id="a_bb9b3a3e5b3b484f5b4b" clipRule="nonzero">
        <path d="M0 108c0-50.912 0-76.368 15.816-92.184S57.088 0 108 0s76.368 0 92.183 15.816C216 31.632 216 57.088 216 108s0 76.368-15.817 92.183C184.368 216 158.911 216 108 216s-76.368 0-92.184-15.817C0 184.368 0 158.911 0 108" />
      </clipPath>
      <g
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        clipPath="url(#a_bb9b3a3e5b3b484f5b4b)"
      >
        <path d="M0 0h216v36.1H0z" opacity={0.167} />
        <path d="M0 36h216v36.1H0z" opacity={0.333} />
        <path d="M0 72h216v36.1H0z" opacity={0.5} />
        <path d="M0 108h216v36.1H0z" opacity={0.667} />
        <path d="M0 144h216v36.1H0z" opacity={0.833} />
        <path d="M0 180h216v36H0z" />
      </g>
    </svg>
  );
}
