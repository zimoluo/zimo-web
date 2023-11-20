export default function AdjustSpeedIcon({
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
      aria-label="Adjust speed"
    >
      <path
        fill="none"
        className={color ? "" : "stroke-saturated"}
        stroke={color || undefined}
        strokeWidth={2.4}
        d="M11.884 6.647v10.706c0 1.221 0 1.832-.25 2.146a1.146 1.146 0 0 1-.897.43c-.401 0-.878-.381-1.832-1.144l-4.901-3.921c-1.224-.98-1.835-1.469-2.057-2.06a2.292 2.292 0 0 1 0-1.608c.221-.591.833-1.08 2.057-2.06l4.901-3.92c.954-.764 1.43-1.145 1.832-1.146.35 0 .68.159.897.431.25.314.25.925.25 2.146Zm10.315 0v10.706c0 1.221 0 1.832-.25 2.146a1.145 1.145 0 0 1-.898.43c-.401 0-.878-.381-1.831-1.144l-4.902-3.921c-1.223-.98-1.835-1.469-2.057-2.06a2.291 2.291 0 0 1 0-1.608c.222-.591.834-1.08 2.057-2.06l4.902-3.92c.953-.764 1.43-1.145 1.831-1.146.35 0 .68.159.897.431.25.314.25.925.25 2.146Z"
      />
    </svg>
  );
}
