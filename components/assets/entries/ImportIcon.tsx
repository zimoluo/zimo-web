export default function ImportIcon({ className = "", color }: ImageIconProps) {
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
      className={className}
      aria-label="Import"
    >
      <g
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={70}
      >
        <path d="M512 67.26C266.504 67.26 67.26 266.504 67.26 512S266.504 956.74 512 956.74 956.74 757.496 956.74 512m0-444.74L592.053 431.947" />
        <path d="M556.474 252.719v214.807h214.809" />
      </g>
    </svg>
  );
}
