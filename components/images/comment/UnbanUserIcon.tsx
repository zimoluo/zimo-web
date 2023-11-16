export default function UnbanUserIcon({
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
      aria-label="Unban user"
    >
      <g className={color ? "" : "fill-primary"} fill={color || undefined}>
        <path d="M2 19c0-3.9 3.1-7 7-7 1.8 0 2.3.2 3.6.8l1-1.6c-.3-.2-.7-.3-.9-.5C14.1 9.6 15 7.9 15 6c0-3.3-2.7-6-6-6S3 2.7 3 6c0 1.9.9 3.7 2.4 4.8C2.2 12.2 0 15.3 0 19v5h11v-2H2v-3ZM5 6c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4Z" />
        <path d="m20 18 3.7 2.1-1 1.7-3.7-2.1V24h-2v-4.3l-3.7 2.1-1-1.7L16 18l-3.7-2.1 1-1.7 3.7 2.1V12h2v4.3l3.7-2.1 1 1.7L20 18Z" />
      </g>
    </svg>
  );
}
