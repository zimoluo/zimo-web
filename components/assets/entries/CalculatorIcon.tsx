export default function CalculatorIcon({
  className = "",
  color,
  strokeWidth = 35,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 800 800"
      className={className}
      aria-label="Calculator icon"
    >
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={strokeWidth}
        d="M79.918 720.081C134.835 775 223.223 775 400 775c176.775 0 265.166 0 320.081-54.919C775 665.166 775 576.775 775 400c0-176.777 0-265.165-54.919-320.082C665.166 25 576.775 25 400 25c-176.777 0-265.165 0-320.082 54.918C25 134.835 25 223.223 25 400c0 176.775 0 265.166 54.918 320.081Z"
      />
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={strokeWidth}
        d="M626 268.273H475.333M626 494.091H475.333M626 607H475.333M324.667 268.273h-75.334m0 0H174m75.333 0V193m0 75.273v75.273m56.5 150.545-56.499 56.455m0 0L192.834 607m56.5-56.454-56.501-56.455m56.501 56.455L305.833 607"
        strokeLinecap="round"
      />
    </svg>
  );
}
