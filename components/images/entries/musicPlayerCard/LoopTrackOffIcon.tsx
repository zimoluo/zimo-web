export default function LoopTrackOffIcon({
  className = "",
  color,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
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
      aria-label="Loop track is off"
    >
      <defs>
        <path
          id="a"
          className={color ? "" : "fill-saturated"}
          fill={color || undefined}
          d="M9.812 21.386a2.188 2.188 0 1 1 4.376 0 2.188 2.188 0 0 1-4.376 0Z"
        />
      </defs>
      <path
        fill="none"
        className={color ? "" : "stroke-saturated"}
        stroke={color || undefined}
        strokeWidth={2}
        d="m17.706 3.12 2.853 2.853m0 0-2.853 2.853m2.853-2.853H7.245a3.804 3.804 0 0 0-3.804 3.804m2.853 8.559-2.853-2.853m0 0 2.853-2.853m-2.853 2.853h13.314c2.1 0 3.804-1.703 3.804-3.804"
      />
      <mask
        id="b"
        width={4.376}
        height={4.376}
        x={9.812}
        y={19.198}
        maskUnits="userSpaceOnUse"
      >
        <path d="M9.812 19.198h4.376v4.376H9.812z" />
        <use xlinkHref="#a" fill="#fff" fillRule="evenodd" />
      </mask>
      <use
        xlinkHref="#a"
        fill="none"
        className={color ? "" : "stroke-saturated"}
        stroke={color || undefined}
        strokeWidth={1.2}
        mask="url(#b)"
      />
    </svg>
  );
}
