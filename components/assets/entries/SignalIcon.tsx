export default function SignalIcon({
  className = "",
  color,
  strokeWidth = 37,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 800 800"
      className={className}
      aria-label="Signal icon"
    >
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M538.188 134c82.949 82.842 82.949 217.156 0 300.001m-300.377-.004c-82.948-82.841-82.948-217.156 0-299.998M137.684 534C-.561 395.927-.561 172.071 137.684 34m500.633.001c138.244 138.071 138.244 361.929 0 499.999M458.8 283.999c0 39.053-31.697 70.711-70.8 70.711-39.103 0-70.8-31.658-70.8-70.711 0-39.05 31.697-70.711 70.8-70.711 39.103 0 70.8 31.661 70.8 70.711Z"
      />
    </svg>
  );
}
