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
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAclBMVEVlr/8dNDRosP9WmmYvWU46dFlpsf9nr//N6f+ay/v/////4U7/3VNrsv//pxT/rQz/vSb/zCT/zi//4lr/yCn/uBNfpbf/3EgpT0T/2UL/wBZEdJ5KimD/xh7/sh3/oRv/nhr4/P9FdJ45Y4I6aE//rywKzIAiAAAB2klEQVQ4y42S2ZbiMAxE5ch2YpKQhaWBXmf7/1+cW3GYp3no4gSMdFUqczBUSrFd41jKaN9Wdzgc/t/pzV54L13XGVC3c/q6iWJ/6e0PkKoCStu21j6NpSO614RSK1UAYw1dLtPn/bSYtVWNtNk08NP5vCznqSjksy9Ep/7U99N5kLof/4AdIx0rlumyDvdV2ToBytTussLOfpqH07pS75C1ZTtVSBn7dZpfTqUjK2k66wqEvEjRSsvjMb0PpQxDmT9LAQAV3mySFzsWMi7z8WvtLVNNPM/+W104z/PH8fHVNJZzk2JoxOFVUtRqHn7I4E0Frk5fIpS7F6k/Tu+/r7pmRjFmCYp+qKePLuAGkHL24Ic9Ywgx1ESYhaBr0o/RSwV+3dItxsqmFNwaA/j5lm6bLWLKvQKv1xRfCek5gIYKlJQiC3cLTw4QRtYyl6UQU+QsmjMy53+cAucKkJDV1c6hkwejFCM7xjGnjCuXSxC08eKbuVPAFiAHtlLFDcLxomUxOQzlHLJKwnURTLU7mN70RAxoM0RO+kHXoWMpap18mWRGHfWiYMoWOWsZn5D6ZKQGAEw4aGqLJpA5HWUGpJviACZHR1G4jGUHRsmAXDE3X17KAxEVDSr9BXzhFwZplTkvAAAAAElFTkSuQmCC"
          id="c_a60411b9239ec6c58854"
          width={32}
          height={32}
          style={{ imageRendering: "pixelated" }}
        />
      </defs>
    </svg>
  );
}
