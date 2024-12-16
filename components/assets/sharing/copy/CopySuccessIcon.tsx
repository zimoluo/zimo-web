export default function CopySuccessIcon({
  className = "",
  color,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      className={className}
      aria-label="Copy success"
    >
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        fillRule="evenodd"
        d="m168.145 558.913-77.709 77.904C3.227 724.244-7.368 863.391 76.429 947.396c83.854 84.064 222.79 73.414 310.026-14.039l.001-.001 77.464-77.66a344.746 344.746 0 0 1-70.228-17.386l-51.132 51.261c-67.48 67.648-166.847 69.566-222.236 14.039-55.447-55.585-53.5-155.332 14.007-223.007l51.043-51.171a344.762 344.762 0 0 1-17.229-70.519ZM681.439 134.432c67.48-67.648 166.846-69.57 222.237-14.042 55.448 55.585 53.499 155.331-14.008 223.006l21.947 21.893-21.947-21.893-51.043 51.171a344.738 344.738 0 0 1 17.23 70.518l77.708-77.903c87.207-87.426 97.807-226.572 14.008-310.579C863.714-7.46 724.779 3.193 637.544 90.646l20.567 20.516-20.567-20.516-77.465 77.658a344.708 344.708 0 0 1 70.229 17.387l51.131-51.259Z"
        clipRule="evenodd"
        opacity={0.5}
      />
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        fillRule="evenodd"
        d="M512 859c191.643 0 347-155.357 347-347S703.643 165 512 165 165 320.357 165 512s155.357 347 347 347Zm217.847-439.006c12.146-12.066 12.212-31.694.147-43.841-12.066-12.146-31.694-12.212-43.841-.147l-230.845 229.3-90.461-89.856c-12.147-12.065-31.775-11.999-43.841.148-12.065 12.147-11.999 31.774.147 43.84l112.308 111.556c12.089 12.008 31.604 12.008 43.693 0l252.693-251Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
