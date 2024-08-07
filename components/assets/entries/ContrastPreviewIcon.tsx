export default function ContrastPreviewIcon({
  className = "",
  color,
  strokeWidth = 75,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1024 1024"
      className={className}
      aria-label="Contrast preview icon"
    >
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={strokeWidth}
        d="M958 512c0 246.321-199.679 446-446 446-246.319 0-446-199.679-446-446C66 265.681 265.681 66 512 66c246.321 0 446 199.681 446 446Z"
      />
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={strokeWidth}
        d="M760 512.001c0 102.787-62.427 190.981-151.404 228.674C558.143 762.05 512 715.759 512 660.925V363.076c0-54.833 46.143-101.126 96.596-79.751C697.573 321.019 760 409.213 760 512.001Z"
      />
    </svg>
  );
}
