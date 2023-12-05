export default function SearchBarIcon({
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
      viewBox="0 0 21 21"
      className={className}
      aria-label="Search entry"
    >
      <path
        fill="none"
        className={color ? "" : "stroke-saturated"}
        stroke={color || undefined}
        strokeWidth={2}
        d="M14.296 14.311 19.5 19.5M16.5 9a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
      />
    </svg>
  );
}
