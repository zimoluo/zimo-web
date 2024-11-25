"id random";

export default function PixellandFavicon({
  className = "",
  height,
  width,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="none"
      viewBox="0 0 1060.54 1060.54"
      aria-label="The website's favicon used for display purposes"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <mask
        id="a_c8b2d1a1fabd09bbd29f"
        width={1010}
        height={1010}
        x={25}
        y={25}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "alpha",
        }}
      >
        <circle cx={530} cy={530} r={505} fill="#D9D9D9" />
      </mask>
      <g mask="url(#a_c8b2d1a1fabd09bbd29f)">
        <path fill="url(#b_74fe15b6386d5b72088f)" d="M25 25h1010v1010H25z" />
      </g>
      <path
        stroke="#F7FDFF"
        strokeMiterlimit={10}
        strokeWidth={40}
        d="M264.494 963.215C119.2 873.821 22.276 713.384 22.276 530.278c0-4.546.225-9.045.343-13.563 67.8-32.878 143.834-51.493 224.219-51.844 97.807-.426 189.396 26.231 267.719 72.875C369.474 625.83 270.99 782.854 264.494 963.215Zm0 0c9.984-277.187 237.116-499.435 517-500.656 93.288-.406 180.878 23.888 256.746 66.594.01.377.04.748.04 1.125 0 280.56-227.444 508.002-508.004 508.002-97.44 0-188.459-27.5-265.782-75.065ZM22.264 530.266c0-280.56 227.44-508 508-508s507.996 227.44 507.996 508-227.435 507.994-507.996 507.994-508-227.433-508-507.994Z"
      />
      <defs>
        <pattern
          id="b_74fe15b6386d5b72088f"
          width={1}
          height={1}
          patternContentUnits="objectBoundingBox"
        >
          <use xlinkHref="#c_a60411b9239ec6c58854" transform="scale(.03125)" />
        </pattern>
        <image
          xlinkHref="data:image/png;base64,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"
          id="c_a60411b9239ec6c58854"
          width={32}
          height={32}
          style={{ imageRendering: "pixelated" }}
        />
      </defs>
    </svg>
  );
}
