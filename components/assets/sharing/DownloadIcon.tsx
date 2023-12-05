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
      viewBox="0 0 24 24"
      className={className}
      aria-label="Download page"
    >
      <path
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={2}
        d="M12 1.283v15.48m0 0 4.763-5.21M12 16.763l-4.763-5.21m8.335 11.164H8.428c-3.369 0-5.053 0-6.099-1.046-1.046-1.046-1.046-2.73-1.046-6.099m21.434 0c0 3.369 0 5.053-1.046 6.099-.357.357-.788.592-1.335.747"
      />
    </svg>
  );
}
