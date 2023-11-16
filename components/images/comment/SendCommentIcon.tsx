export default function SendCommentIcon({
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
      aria-label="Send comment"
    >
      <path
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={1.5}
        d="M11.418 12.003h-8.02m-.227 1.052-1.325 3.957c-.726 2.168-1.089 3.252-.828 3.92a1.98 1.98 0 0 0 1.31 1.186c.69.192 1.733-.277 3.817-1.215L19.51 14.89c2.035-.915 3.052-1.373 3.367-2.009.273-.553.273-1.2 0-1.753-.315-.636-1.332-1.094-3.367-2.01L6.122 3.093c-2.078-.935-3.117-1.403-3.806-1.21a1.978 1.978 0 0 0-1.312 1.183c-.26.666.098 1.747.816 3.91l1.353 4.077c.123.371.185.557.21.747.021.169.02.34-.001.508-.025.19-.087.375-.211.747Z"
      />
    </svg>
  );
}
