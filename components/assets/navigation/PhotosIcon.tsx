export default function PhotosIcon({
  color = null,
  className = "",
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1024 1024"
      aria-label="Navigate to photos page"
      className={className}
    >
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        fillRule="evenodd"
        d="M768 64H543v193.858C669.766 273.16 768 381.108 768 512s-98.234 238.84-225 254.142V960h225c106.039 0 192-85.961 192-192V256c0-106.039-85.961-192-192-192ZM479 960V765.893C353.203 749.703 256 642.203 256 512s97.203-237.703 223-253.893V64H256C149.961 64 64 149.961 64 256v512c0 106.039 85.961 192 192 192h223ZM256 0C114.615 0 0 114.615 0 256v512c0 141.385 114.615 256 256 256h512c141.385 0 256-114.615 256-256V256C1024 114.615 909.385 0 768 0H256Zm484 220c0-35.346 28.654-64 64-64 35.346 0 64 28.654 64 64 0 35.346-28.654 64-64 64-35.346 0-64-28.654-64-64Zm-36 292c0 106.039-85.961 192-192 192s-192-85.961-192-192 85.961-192 192-192 192 85.961 192 192Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
