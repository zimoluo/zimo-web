export default function SignalIcon({
  className = "",
  color,
  strokeWidth = 50,
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
        d="M550.188 250c82.949 82.842 82.949 217.156 0 300.001m-300.377-.004c-82.948-82.841-82.948-217.156 0-299.998M149.684 650c-138.245-138.073-138.245-361.929 0-500m500.633.001c138.244 138.071 138.244 361.929 0 499.999M470.8 399.999c0 39.053-31.697 70.711-70.8 70.711-39.103 0-70.8-31.658-70.8-70.711 0-39.05 31.697-70.711 70.8-70.711 39.103 0 70.8 31.661 70.8 70.711Z"
      />
    </svg>
  );
}
