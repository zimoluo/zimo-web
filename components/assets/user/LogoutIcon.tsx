export default function LogoutIcon({
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
      aria-label="Log out."
      className={className}
    >
      <g className={color ? "" : "fill-primary"} fill={color || undefined}>
        <path d="M990.831 491.683c10.809 15.44 7.041 36.732-8.412 47.556L795.183 670.397c-15.452 10.825-36.74 7.083-47.547-8.357-10.807-15.44-7.041-36.732 8.412-47.557l187.236-131.158c15.452-10.824 36.74-7.083 47.547 8.358z" />
        <path d="M226.239 512.925c.011-18.857 15.306-34.152 34.162-34.162l703.7-.401c18.857-.011 34.135 15.267 34.124 34.123-.011 18.857-15.306 34.152-34.163 34.162l-703.7.401c-18.856.011-34.134-15.266-34.123-34.123z" />
        <path d="M992.031 532.072c-10.825 15.453-32.116 19.219-47.557 8.412L757.388 409.539c-15.44-10.807-19.182-32.094-8.358-47.547 10.825-15.453 32.117-19.219 47.557-8.412l187.086 130.945c15.441 10.807 19.187 32.095 8.358 47.547zM70.275 142.719c-24.57 0-44.5 19.93-44.5 44.5v408.625h90.25V276.281c0-24.569 19.931-44.5 44.5-44.5h475.938c24.569 0 44.5-19.93 44.5-44.5v-.062c0-24.57-19.931-44.5-44.5-44.5H70.275z" />
        <path d="M25.775 310.406v526.375c0 24.57 19.93 44.5 44.5 44.5h566.188c24.569 0 44.5-19.93 44.5-44.5v-.062c0-24.57-19.931-44.5-44.5-44.5H160.525c-24.569 0-44.5-19.931-44.5-44.5V310.406h-90.25z" />
      </g>
    </svg>
  );
}