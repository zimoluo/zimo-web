export default function SettingsPanelIcon({
  color = null,
  className = "",
  strokeWidth = 64,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      aria-label="Settings panel button"
      className={className}
    >
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        fill="none"
        d="M824 512H200"
      />
    </svg>
  );
}
