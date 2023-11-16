"id random";

export default function HeartFilledIcon({
  className = "",
  color,
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
      viewBox="0 0 471.701 471.701"
      className={className}
      aria-hidden="true"
    >
      <clipPath id="a_b35b20d378e3d98c47f8">
        <path d="M0 0h471.701v471.701H0z" />
      </clipPath>
      <g clipPath="url(#a_b35b20d378e3d98c47f8)">
        <path
          className={color ? "" : "fill-primary"}
          fill={color || undefined}
          d="M433.601 56.06c-24.7-26.3-57.4-40.675-92.3-40.675s-67.7 14.481-92.4 40.782l-12.9 13.736-13.1-13.95c-24.7-26.3-57.6-40.887-92.5-40.887-34.8 0-67.6 14.48-92.2 40.675C13.5 82.04-.1 116.966 0 154.128c0 37.161 13.7 71.98 38.4 98.28l187.8 199.968c2.6 2.769 6.1 4.259 9.5 4.259 3.4 0 6.9-1.384 9.5-4.152l188.2-199.649c24.7-26.3 38.3-61.226 38.3-98.387.1-37.161-13.4-72.086-38.1-98.387Z"
        />
      </g>
    </svg>
  );
}
