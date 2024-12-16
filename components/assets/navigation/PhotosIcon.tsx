export default function PhotosIcon({
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
      aria-label="Navigate to photos page"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        fillRule="evenodd"
        d="M768 62H543V257.858C669.766 273.16 768 381.108 768 512C768 642.892 669.766 750.84 543 766.142V962H768C875.143 962 962 875.143 962 768V256C962 148.857 875.143 62 768 62ZM481 962V766.142C354.234 750.84 256 642.892 256 512C256 381.108 354.234 273.16 481 257.858V62H256C148.857 62 62 148.857 62 256V768C62 875.143 148.857 962 256 962H481ZM256 0C114.615 0 0 114.615 0 256V768C0 909.385 114.615 1024 256 1024H768C909.385 1024 1024 909.385 1024 768V256C1024 114.615 909.385 0 768 0H256ZM746 220C746 187.967 771.967 162 804 162C836.033 162 862 187.967 862 220C862 252.033 836.033 278 804 278C771.967 278 746 252.033 746 220ZM706 512C706 619.143 619.143 706 512 706C404.857 706 318 619.143 318 512C318 404.857 404.857 318 512 318C619.143 318 706 404.857 706 512Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
