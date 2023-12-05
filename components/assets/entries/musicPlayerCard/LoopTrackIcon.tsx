export default function LoopTrackIcon({
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
      viewBox="0 0 24 24"
      className={className}
      aria-label="Looping track"
    >
      <path
        fill="none"
        className={color ? "" : "stroke-saturated"}
        stroke={color || undefined}
        strokeWidth={2}
        d="m17.706 3.12 2.853 2.853m0 0-2.853 2.853m2.853-2.853H7.245a3.804 3.804 0 0 0-3.804 3.804m2.853 8.559-2.853-2.853m0 0 2.853-2.853m-2.853 2.853h13.314c2.1 0 3.804-1.703 3.804-3.804"
      />
      <path
        className={color ? "" : "fill-saturated"}
        fill={color || undefined}
        d="M9.812 21.386a2.188 2.188 0 1 1 4.376 0 2.188 2.188 0 0 1-4.376 0Z"
      />
    </svg>
  );
}
