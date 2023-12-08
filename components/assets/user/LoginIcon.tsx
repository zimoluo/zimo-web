export default function LoginIcon({
  color = null,
  className = "",
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
      aria-label="Log in."
      className={className}
    >
      <g className={color ? "" : "fill-primary"} fill={color || undefined}>
        <path d="M801.967 491.678c10.807 15.44 7.041 36.732-8.412 47.556L606.32 670.393c-15.453 10.824-36.741 7.082-47.547-8.358-10.807-15.44-7.041-36.732 8.411-47.556L754.42 483.32c15.453-10.824 36.74-7.082 47.547 8.358Z" />
        <path d="M37.375 512.92c.011-18.856 15.306-34.151 34.163-34.162l703.7-.401c18.856-.011 34.134 15.267 34.123 34.123-.011 18.857-15.306 34.152-34.162 34.163l-703.7.401c-18.857.01-34.134-15.267-34.124-34.124Z" />
        <path d="M803.167 532.067c-10.824 15.453-32.116 19.219-47.556 8.412L568.524 409.534c-15.44-10.807-19.182-32.094-8.357-47.547 10.824-15.452 32.116-19.218 47.556-8.411L794.81 484.52c15.44 10.807 19.182 32.095 8.357 47.547Z" />
        <path d="M942.144 142.719c24.569 0 44.5 19.93 44.5 44.5v408.625h-90.25V276.281c0-24.569-19.931-44.5-44.5-44.5H375.957c-24.57 0-44.5-19.93-44.5-44.5v-.062c0-24.57 19.93-44.5 44.5-44.5h566.187Z" />
        <path d="M986.644 310.406v526.375c0 24.57-19.931 44.5-44.5 44.5H375.957c-24.57 0-44.5-19.93-44.5-44.5v-.062c0-24.57 19.93-44.5 44.5-44.5h475.937c24.569 0 44.5-19.931 44.5-44.5V310.406h90.25Z" />
      </g>
    </svg>
  );
}
