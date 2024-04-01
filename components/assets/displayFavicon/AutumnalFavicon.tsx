"id random";

export default function AutumnalFavicon({
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
      viewBox="0 0 1060.54 1060.54"
      aria-label="The website's favicon used for display purposes"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <defs>
        <linearGradient
          id="c_2a0c3d9341db6b37c019"
          x1={0}
          x2={1}
          y1={0}
          y2={0}
          gradientTransform="rotate(45 -14.376 37.378) scale(1437.6)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#031d44" />
          <stop offset={0.2} stopColor="#031d44" />
          <stop offset={0.2} stopColor="#04395e" />
          <stop offset={0.4} stopColor="#04395e" />
          <stop offset={0.4} stopColor="#70a288" />
          <stop offset={0.6} stopColor="#70a288" />
          <stop offset={0.6} stopColor="#dab785" />
          <stop offset={0.8} stopColor="#dab785" />
          <stop offset={0.8} stopColor="#d5896f" />
          <stop offset={1} stopColor="#d5896f" />
        </linearGradient>
        <path
          id="a_98ca60e32bd28ab52153"
          d="M22 530C22 249.439 249.439 22 530 22s508 227.439 508 508-227.439 508-508 508S22 810.561 22 530"
        />
      </defs>
      <use
        xlinkHref="#a_98ca60e32bd28ab52153"
        fill="none"
        stroke="#fff1de"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth={40}
      />
      <clipPath id="b_de9a070016c31906c352" clipRule="nonzero">
        <use xlinkHref="#a_98ca60e32bd28ab52153" />
      </clipPath>
      <g clipPath="url(#b_de9a070016c31906c352)">
        <path fill="url(#c_2a0c3d9341db6b37c019)" d="M22 22h1016.54v1016.54H22z" />
        <g
          fill="none"
          stroke="#fff1de"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeWidth={40}
        >
          <path d="M781.23 462.293c-97.777.426-189.09 27.863-267 75.156-78.321-46.615-169.876-73.27-267.656-72.844-287.031 1.251-518.72 234.968-517.469 522 1.251 287.025 234.97 518.685 522 517.435 97.786-.42 189.116-27.85 267.031-75.15 78.314 46.6 169.858 73.24 267.625 72.81 287.039-1.25 518.719-234.93 517.469-521.97-1.25-287.031-234.97-518.687-522-517.437Z" />
          <path d="M263.791 984.263c-1.25-287.031 230.421-520.729 517.452-521.981 287.027-1.25 520.737 230.421 521.987 517.452 1.25 287.036-230.42 520.726-517.456 521.976-287.033 1.26-520.731-230.42-521.983-517.447Z" />
        </g>
      </g>
      <path
        fill="none"
        stroke="#fff1de"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth={40}
        d="M22 530C22 249.439 249.439 22 530 22s508 227.439 508 508-227.439 508-508 508S22 810.561 22 530Z"
      />
    </svg>
  );
}
