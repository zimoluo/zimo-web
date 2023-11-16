"id random";

export default function HeartIcon({ className = "", color }: ImageIconProps) {
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
      aria-label="Like this"
    >
      <clipPath id="a_bea969f4af50efdcd2b1">
        <path d="M0 0h471.701v471.701H0z" />
      </clipPath>
      <g clipPath="url(#a_bea969f4af50efdcd2b1)">
        <path
          className={color ? "" : "fill-primary"}
          fill={color || undefined}
          d="M433.601 56.06c-24.7-26.3-57.4-40.675-92.3-40.675s-67.7 14.481-92.4 40.782l-12.9 13.736-13.1-13.95c-24.7-26.3-57.6-40.887-92.5-40.887-34.8 0-67.6 14.48-92.2 40.675C13.5 82.04-.1 116.966 0 154.128c0 37.161 13.7 71.98 38.4 98.28l187.8 199.968c2.6 2.769 6.1 4.259 9.5 4.259 3.4 0 6.9-1.384 9.5-4.152l188.2-199.649c24.7-26.3 38.3-61.226 38.3-98.387.1-37.161-13.4-72.086-38.1-98.387Zm-19.2 176.436-178.7 189.533-178.3-189.852C37.8 211.307 27 183.622 27 154.128c0-29.495 10.7-57.18 30.3-77.943 19.5-20.764 45.5-32.263 73.1-32.263 27.7 0 53.8 11.5 73.4 32.37l22.6 24.064c5.3 5.643 13.8 5.643 19.1 0l22.4-23.852c19.6-20.87 45.7-32.37 73.3-32.37 27.6 0 53.6 11.5 73.2 32.264 19.6 20.87 30.3 48.554 30.3 78.049.1 29.495-10.7 57.179-30.3 78.049Z"
        />
      </g>
    </svg>
  );
}
