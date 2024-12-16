export default function CommentRingIcon({
  className = "",
  color,
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
      viewBox="0 0 192 192"
      className={className}
      aria-label="Comment ring icon"
    >
      <circle
        cx={96}
        cy={96}
        r={90}
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={11.625}
        fill="none"
      />
      <g
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={11.625}
      >
        <path d="M120.328 98.433a2.433 2.433 0 1 0 0-4.866 2.433 2.433 0 0 0 0 4.866m-24.328 0a2.433 2.433 0 1 0 0-4.866 2.433 2.433 0 0 0 0 4.866m-24.328 0a2.433 2.433 0 1 0 0-4.866 2.433 2.433 0 0 0 0 4.866" />
        <path
          fill="none"
          d="M96 144.656c26.872 0 48.656-21.784 48.656-48.656S122.872 47.344 96 47.344 47.344 69.128 47.344 96c0 8.862 2.369 17.171 6.509 24.328l-4.077 21.896 21.896-4.077c7.157 4.14 15.466 6.509 24.328 6.509"
        />
      </g>
    </svg>
  );
}
