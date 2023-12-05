export default function ReplyIcon({ className = "", color }: ImageIconProps) {
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
      aria-label="Reply to "
    >
      <g
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={1.5}
      >
        <path
          className={color ? "" : "fill-primary"}
          fill={color || undefined}
          d="M17.56 12.556a.556.556 0 1 0 0-1.112.556.556 0 0 0 0 1.112Zm-5.56 0a.556.556 0 1 0 0-1.112.556.556 0 0 0 0 1.112Zm-5.56 0a.556.556 0 1 0 0-1.112.556.556 0 0 0 0 1.112Z"
        />
        <path
          fill="none"
          d="M12 23.119c6.14 0 11.119-4.978 11.119-11.119C23.119 5.86 18.14.881 12 .881S.881 5.86.881 12c0 2.025.542 3.924 1.488 5.56l-.932 5.003 5.004-.932A11.068 11.068 0 0 0 12 23.12Z"
        />
      </g>
    </svg>
  );
}
