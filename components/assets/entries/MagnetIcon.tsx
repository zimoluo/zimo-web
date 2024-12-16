export default function MagnetIcon({
  className = "",
  color,
  strokeWidth = 48,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 800 800"
      className={className}
      aria-label="Magnet icon"
    >
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M481.48 100H550c27.614 0 50 22.386 50 50v50c0 27.614-22.386 50-50 50h-68.52m0-150H366.667c-165.686 0-300 134.315-300 300 0 165.687 134.315 300 300 300H481.48m0-600v150m0 0H364.814c-82.842 0-149.999 67.157-149.999 150s67.157 150 149.999 150H481.48m0 150H550c27.614 0 50-22.387 50-50v-50c0-27.613-22.386-50-50-50h-68.52m0 150V550"
      />
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        d="M716.667 200s50 60 50 200-50 200-50 200M650 300s16.667 30 16.667 100S650 500 650 500"
      />
    </svg>
  );
}
