export default function WebsiteIcon({ className = "", color }: ImageIconProps) {
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
      aria-label="Website icon"
    >
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        d="M0 22.667V9.333h6.667V24H1.333A1.333 1.333 0 0 1 0 22.667ZM24 1.333C24 .597 23.403 0 22.667 0H1.333C.597 0 0 .597 0 1.333v5.334h24V1.333ZM22.667 24c.736 0 1.333-.597 1.333-1.333V9.333H9.333V24h13.334Z"
      />
    </svg>
  );
}
