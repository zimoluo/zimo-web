"id random";

export default function AboutIcon({
  color = null,
  className = "",
  height,
  width,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1024 1024"
      aria-label="Navigate to about page"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        fillRule="evenodd"
        d="M256 62h512c107.143 0 194 86.857 194 194v512c0 107.143-86.857 194-194 194H256c-107.143 0-194-86.857-194-194V256c0-107.143 86.857-194 194-194ZM0 256C0 114.615 114.615 0 256 0h512c141.385 0 256 114.615 256 256v512c0 141.385-114.615 256-256 256H256C114.615 1024 0 909.385 0 768V256Zm512 186c-38.66 0-70 31.34-70 70s31.34 70 70 70 70-31.34 70-70-31.34-70-70-70Zm140 70c0-38.66 31.34-70 70-70s70 31.34 70 70-31.34 70-70 70-70-31.34-70-70Zm-350-70c-38.66 0-70 31.34-70 70s31.34 70 70 70 70-31.34 70-70-31.34-70-70-70Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
