"id random";

export default function LinkedinLogo({
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
      viewBox="0 0 1024 1024"
      className={className}
      aria-label="Linkedin logo"
    >
      <clipPath id="a_98fa31a78263402a6a0f">
        <path d="M0 0h1024v1024H0z" />
      </clipPath>
      <g clipPath="url(#a_98fa31a78263402a6a0f)">
        <path
          className={color ? "" : "fill-primary"}
          fill={color || undefined}
          d="M810.667 0H213.333C95.531 0 0 95.53 0 213.333v597.334C0 928.469 95.53 1024 213.333 1024h597.334C928.512 1024 1024 928.469 1024 810.667V213.333C1024 95.531 928.512 0 810.667 0ZM341.333 810.667h-128V341.333h128v469.334Zm-64-523.435c-41.216 0-74.666-33.707-74.666-75.264 0-41.557 33.45-75.264 74.666-75.264 41.216 0 74.667 33.707 74.667 75.264 0 41.557-33.408 75.264-74.667 75.264Zm576 523.435h-128V571.563c0-143.702-170.666-132.822-170.666 0v239.104h-128V341.333h128v75.307c59.562-110.336 298.666-118.485 298.666 105.643v288.384Z"
        />
      </g>
    </svg>
  );
}
