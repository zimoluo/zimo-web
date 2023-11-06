export default function ProjectsIcon({
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
      viewBox="0 0 1024 1024"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <clipPath id="a">
        <path d="M0 0h1024v1024H0z" />
      </clipPath>
      <g
        clipPath="url(#a)"
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
      >
        <path d="m512 0-65.836 242.585c21.108-5.14 43.146-7.938 65.836-7.938 22.69 0 44.728 2.798 65.836 7.938L512 0ZM149.954 149.954l124.992 218.018a278.795 278.795 0 0 1 93.026-93.026L149.954 149.954Zm724.092 0L656.028 274.946a278.795 278.795 0 0 1 93.026 93.026l124.992-218.018Zm-631.461 296.21L0 512l242.585 65.836c-5.14-21.108-7.938-43.146-7.938-65.836 0-22.69 2.798-44.728 7.938-65.836Zm538.83 0c5.14 21.108 7.938 43.146 7.938 65.836 0 22.69-2.798 44.728-7.938 65.836L1024 512l-242.585-65.836ZM274.946 656.028 149.954 874.046l218.018-124.992a278.795 278.795 0 0 1-93.026-93.026Zm474.108 0a278.795 278.795 0 0 1-93.026 93.026l218.018 124.992-124.992-218.018Zm-302.89 125.387L512 1024l65.836-242.585c-21.108 5.14-43.146 7.938-65.836 7.938-22.69 0-44.728-2.798-65.836-7.938ZM272.465 512c0-132.291 107.244-239.535 239.535-239.535S751.535 379.709 751.535 512 644.291 751.535 512 751.535 272.465 644.291 272.465 512Z" />
      </g>
    </svg>
  );
}
