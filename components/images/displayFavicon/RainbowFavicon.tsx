"id random";

export default function RainbowFavicon({
  className = "",
  height,
  width,
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
      viewBox="0 0 1060 1060"
      aria-label="The website's favicon used for display purposes"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <defs>
        <linearGradient
          id="c_6d951c4296b651db2865"
          x1={455.467}
          x2={670.281}
          y1={210.65}
          y2={391.7}
          gradientTransform="matrix(3.87227 0 0 4.62462 -1671.77 -870.642)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#f99" />
          <stop offset={0.2} stopColor="#ffb380" />
          <stop offset={0.4} stopColor="#ffff80" />
          <stop offset={0.6} stopColor="#80ff80" />
          <stop offset={0.8} stopColor="#80b3ff" />
          <stop offset={1} stopColor="#96c" />
        </linearGradient>
        <path
          id="a_50f2c8b70e3f3dbde321"
          d="M22 530C22 249.439 249.439 22 530 22c280.561 0 508 227.439 508 508 0 280.561-227.439 508-508 508-280.561 0-508-227.439-508-508Z"
        />
      </defs>
      <g>
        <g>
          <g>
            <use
              xlinkHref="#a_50f2c8b70e3f3dbde321"
              fill="none"
              stroke="#475569"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              strokeWidth={40}
            />
            <clipPath id="b_22ff6c662cecc8f5b5c6" clipRule="nonzero">
              <use xlinkHref="#a_50f2c8b70e3f3dbde321" />
            </clipPath>
            <g
              stroke="#475569"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              strokeWidth={40}
              clipPath="url(#b_22ff6c662cecc8f5b5c6)"
            >
              <path fill="url(#c_6d951c4296b651db2865)" d="M0 0h1060v1060H0V0Z" />
              <g fill="none">
                <path d="M781.23 462.293c-97.777.426-189.09 27.863-267 75.156-78.321-46.615-169.876-73.27-267.656-72.844-287.031 1.251-518.72 234.968-517.469 522 1.251 287.025 234.97 518.685 522 517.435 97.786-.42 189.116-27.85 267.031-75.15 78.314 46.6 169.858 73.24 267.625 72.81 287.039-1.25 518.719-234.93 517.469-521.97-1.25-287.031-234.97-518.687-522-517.437Z" />
                <path d="M263.791 984.263c-1.25-287.031 230.421-520.729 517.452-521.981 287.027-1.25 520.737 230.421 521.987 517.452 1.25 287.036-230.42 520.726-517.456 521.976-287.033 1.26-520.731-230.42-521.983-517.447Z" />
              </g>
            </g>
          </g>
          <path
            fill="none"
            stroke="#475569"
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeWidth={40}
            d="M22 530C22 249.439 249.439 22 530 22c280.561 0 508 227.439 508 508 0 280.561-227.439 508-508 508-280.561 0-508-227.439-508-508Z"
          />
        </g>
      </g>
    </svg>
  );
}
