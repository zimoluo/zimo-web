export default function PasteIcon({
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
      aria-label="Paste"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <g
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinejoin="miter"
      >
        <path
          strokeLinecap="butt"
          strokeWidth={110}
          d="M691.542 153c97.626.543 150.496 4.872 184.986 39.361 39.441 39.44 39.441 102.918 39.441 229.873v269.312c0 126.954 0 190.436-39.441 229.872-39.441 39.441-102.918 39.441-229.872 39.441H377.344c-126.956 0-190.433 0-229.873-39.441-39.44-39.436-39.44-102.918-39.44-229.872V422.234c0-126.955 0-190.433 39.44-229.873 34.489-34.489 87.36-38.818 184.987-39.361"
        />
        <path
          strokeWidth={80}
          d="M332.458 601.766h359.084M287.573 444.667h448.854M377.344 758.865h269.312"
        />
        <path
          strokeLinecap="butt"
          strokeWidth={95}
          d="M332.458 130.469c0-37.184 30.144-67.328 67.328-67.328h224.428c37.183 0 67.328 30.144 67.328 67.328v44.886c0 37.184-30.145 67.328-67.328 67.328H399.786c-37.184 0-67.328-30.144-67.328-67.328z"
        />
      </g>
    </svg>
  );
}
