"id random";

export default function DuskFavicon({
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
        id="a_ad7ecf32441d5e02423d"
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
      <g mask="url(#a_ad7ecf32441d5e02423d)">
        <path fill="url(#b_47db6d3a90604231b01a)" d="M25 25h1010v1010H25z" />
      </g>
      <path
        stroke="#FFF1FB"
        strokeMiterlimit={10}
        strokeWidth={40}
        d="M264.494 963.215C119.2 873.821 22.276 713.384 22.276 530.278c0-4.546.225-9.045.343-13.563 67.8-32.878 143.834-51.493 224.219-51.844 97.807-.426 189.396 26.231 267.719 72.875C369.474 625.83 270.99 782.854 264.494 963.215Zm0 0c9.984-277.187 237.116-499.435 517-500.656 93.288-.406 180.878 23.888 256.746 66.594.01.377.04.748.04 1.125 0 280.56-227.444 508.002-508.004 508.002-97.44 0-188.459-27.5-265.782-75.065ZM22.264 530.266c0-280.56 227.44-508 508-508s507.996 227.44 507.996 508-227.435 507.994-507.996 507.994-508-227.433-508-507.994Z"
      />
      <defs>
        <pattern
          id="b_47db6d3a90604231b01a"
          width={1}
          height={1}
          patternContentUnits="objectBoundingBox"
        >
          <use xlinkHref="#c_203f61345869b276932b" transform="scale(.03125)" />
        </pattern>
        <image
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAOVBMVEUnKEI9M1TOYXbsorH4qafaaYXembaMSGiaRWbujaD9saT9uaTNkLn3paM+Pl0sK0T/8s7/6b87MlJVX1KUAAABDElEQVQ4y42NCXbDIAxEBV4EKDht73/YjhZC4te4mYfRSP6MaL/d7Ox2wuK2C572Zb8ULUsgC45VKG4UAP/IgXW0065haIW9EIA/JCK9h6fae23r2lSo6hxozlKFWtu2LefcQoKZTiQ3IbB9AMiCxVRkiyfVVkgAyEIdgCigKxR+JOi4QjGpQmilQMwK4KUBqJEJIBIYrQ49YQLMsKVszNoOIAeQkgG2YibAJNMZ4KLKXEt6C+A1owSB+gr4nHXujg3IeSYk/3cBTE3A/DNA0B2fAw9a2wnQABxGAoDnFXSEAXAc0XzbIAIOItgJwN5nfhCQA/GKbeerUhRPhN4Cpk+AL0q+/Mx9rJ/z4BeCHRBhWRAYNQAAAABJRU5ErkJggg=="
          id="c_203f61345869b276932b"
          width={32}
          height={32}
          style={{ imageRendering: "pixelated" }}
        />
      </defs>
    </svg>
  );
}
