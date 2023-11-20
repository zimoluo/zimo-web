export default function PlayTrackIcon({
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
      viewBox="0 0 24 24"
      className={className}
      aria-label="Play track"
    >
      <path
        fill="none"
        className={color ? "" : "stroke-saturated"}
        stroke={color || undefined}
        strokeLinecap="butt"
        strokeWidth={2.25}
        d="M17.37 9.286c1.44.9 2.16 1.35 2.407 1.926a2 2 0 0 1 0 1.576c-.247.576-.966 1.026-2.406 1.926l-6.762 4.226c-1.598.999-2.397 1.498-3.057 1.445a2 2 0 0 1-1.445-.801c-.394-.531-.394-1.473-.394-3.358V7.774c0-1.885 0-2.827.394-3.358a2 2 0 0 1 1.445-.801c.66-.053 1.459.446 3.057 1.445l6.762 4.226Z"
      />
    </svg>
  );
}
