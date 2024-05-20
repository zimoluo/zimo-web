export default function ExportIcon({ className = "", color }: ImageIconProps) {
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
      aria-label="Export"
    >
      <path
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={70}
        d="M512 67.26C266.504 67.26 67.26 266.504 67.26 512S266.504 956.74 512 956.74 956.74 757.496 956.74 512m-400.266-44.474L921.16 102.842m35.575 179.228V67.26H741.926"
      />
    </svg>
  );
}
