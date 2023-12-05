"id random";

export default function BirthdayFavicon({
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
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <defs>
        <linearGradient
          id="b_96a2ceb21e59cd1f6f28"
          x1={363.811}
          x2={1091.83}
          y1={321.948}
          y2={1093.51}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#fb71a2" />
          <stop offset={1} stopColor="#fbe671" />
        </linearGradient>
        <path
          id="a_f677d05c947a3aa5a5cc"
          d="M22.27 530.27c0-280.561 227.439-508 508-508 280.561 0 508 227.439 508 508 0 280.561-227.439 508-508 508-280.561 0-508-227.439-508-508Z"
        />
      </defs>
      <use xlinkHref="#a_f677d05c947a3aa5a5cc" fill="url(#b_96a2ceb21e59cd1f6f28)" />
      <clipPath id="c_da98d58da1b60290c8aa" clipRule="nonzero">
        <use xlinkHref="#a_f677d05c947a3aa5a5cc" />
      </clipPath>
      <g
        fill="none"
        stroke="#be185d"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth={40}
        clipPath="url(#c_da98d58da1b60290c8aa)"
      >
        <path d="M781.5 462.562c-97.777.427-189.09 27.863-267 75.157-78.321-46.615-169.876-73.27-267.656-72.844-287.031 1.251-518.72 234.968-517.469 522 1.251 287.025 234.97 518.685 522 517.435 97.786-.42 189.116-27.85 267.031-75.15 78.314 46.6 169.858 73.24 267.625 72.81 287.039-1.25 518.719-234.93 517.469-521.97-1.25-287.031-234.97-518.688-522-517.438Z" />
        <path d="M264.061 984.533c-1.25-287.031 230.421-520.729 517.452-521.981 287.027-1.25 520.737 230.421 521.987 517.452 1.25 287.036-230.42 520.726-517.456 521.976-287.033 1.26-520.731-230.42-521.983-517.447Z" />
      </g>
      <path
        fill="none"
        stroke="#be185d"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth={40}
        d="M22.27 530.27c0-280.561 227.439-508 508-508 280.561 0 508 227.439 508 508 0 280.561-227.439 508-508 508-280.561 0-508-227.439-508-508Z"
      />
    </svg>
  );
}
