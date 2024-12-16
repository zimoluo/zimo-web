export default function DeleteCommentIcon({
  className = "",
  color,
  strokeWidth = 1.453,
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
      aria-label="Trash can icon"
    >
      <path
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={strokeWidth}
        d="M9.594 12v6.016M14.406 12v6.016M2.374 5.984h19.252M4.78 9.594v9.625a3.61 3.61 0 0 0 3.61 3.61h7.22a3.61 3.61 0 0 0 3.61-3.61V9.594M8.39 3.577a2.406 2.406 0 0 1 2.407-2.406h2.406a2.406 2.406 0 0 1 2.407 2.406v2.407H8.39V3.577Z"
      />
    </svg>
  );
}
