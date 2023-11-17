export default function FacebookLogo({
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
      aria-label="Facebook logo"
    >
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        d="M1023.47 511.736C1023.47 229.254 794.217 0 511.735 0S0 229.254 0 511.736c0 255.605 187.092 467.467 432.155 505.414V659.302h-130.7V511.736h130.7V398.954c0-128.066 75.891-199.213 192.889-199.213 55.864 0 113.836 10.54 113.836 10.54v124.904h-64.296c-63.77 0-83.796 40.053-83.796 80.107v95.917h142.295l-22.662 147.566H590.788v357.845c245.59-37.417 432.682-249.279 432.682-504.884Z"
      />
    </svg>
  );
}
