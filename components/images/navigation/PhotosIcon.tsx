export default function PhotosIcon({
  color = null,
  className = "",
  height,
  width,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      strokeMiterlimit={10}
      style={{
        fillRule: "nonzero",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
      viewBox="0 0 657.356 657.356"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <path
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth={25}
        d="M17.39 142.894C17.39 73.58 73.58 17.39 142.894 17.39h371.568c69.314 0 125.504 56.19 125.504 125.504v371.568c0 69.314-56.19 125.504-125.504 125.504H142.894c-69.314 0-125.504-56.19-125.504-125.504V142.894Z"
      />
      <path
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth={25}
        d="M183.576 328.678c0-80.138 64.964-145.102 145.102-145.102s145.103 64.964 145.103 145.102-64.965 145.103-145.103 145.103-145.102-64.965-145.102-145.103Z"
      />
      <path
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth={25}
        d="M328.678 17.39v166.186m0 290.205v166.185"
      />
      <path d="M487.299 121.852c0-20.489 16.61-37.1 37.099-37.1 20.489 0 37.099 16.611 37.099 37.1s-16.61 37.099-37.099 37.099c-20.489 0-37.099-16.61-37.099-37.099Z" />
    </svg>
  );
}
