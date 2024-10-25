export default function WindowIcon({ className = "", color }: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1024 1024"
      className={className}
      aria-label="Window widget"
    >
      <g className={color ? "" : "stroke-primary"} stroke={color || undefined}>
        <rect
          width={947}
          height={586}
          x={39}
          y={199}
          strokeWidth={47}
          rx={70}
        />
        <path strokeLinecap="round" strokeWidth={44} d="M336 853h397" />
        <path
          strokeLinecap="round"
          strokeWidth={44}
          d="M178 310h397M178 487h295M178 401h334"
          opacity={0.5}
        />
        <path strokeLinecap="round" strokeWidth={44} d="M269 853h0" />
      </g>
    </svg>
  );
}
