export default function DownloadIcon({
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
      viewBox="0 0 640 640"
      className={className}
      aria-label="Download page"
    >
      <g
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
      >
        <path
          strokeWidth={46}
          d="M320 160.733v229.424m0 0 89.109-89.109M320 390.157l-89.109-89.109"
        />
        <path
          strokeLinejoin="miter"
          strokeWidth={46}
          d="M438.812 479.267H201.188"
        />
        <path
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeWidth={40}
          d="M25.157 320c0-138.99 0-208.485 43.179-251.664S181.01 25.157 320 25.157s208.486 0 251.663 43.179c43.18 43.179 43.18 112.674 43.18 251.664s0 208.486-43.18 251.663c-43.177 43.18-112.674 43.18-251.663 43.18-138.99 0-208.485 0-251.664-43.18C25.157 528.486 25.157 458.989 25.157 320Z"
        />
      </g>
    </svg>
  );
}
