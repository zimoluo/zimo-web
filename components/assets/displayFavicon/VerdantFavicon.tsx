"id random";

export default function VerdantFavicon({
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
        <path
          id="a_9acee3a99b4e43bba446"
          d="M22.27 530.27c0-280.561 227.439-508 508-508s508 227.439 508 508-227.439 508-508 508-508-227.439-508-508"
        />
      </defs>
      <use
        xlinkHref="#a_9acee3a99b4e43bba446"
        fill="none"
        stroke="#87ae19"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth={40}
      />
      <clipPath id="b_069d124087bd9aece1c9" clipRule="nonzero">
        <use xlinkHref="#a_9acee3a99b4e43bba446" />
      </clipPath>
      <g clipPath="url(#b_069d124087bd9aece1c9)">
        <path fill="#8edf22" d="M1038.27 22.27h-1016v1016h1016z" />
        <path
          fill="#fff656"
          d="M1038.27 530.27c0-280.561-227.439-508-508-508s-508 227.439-508 508 227.439 508 508 508 508-227.439 508-508"
        />
        <path
          fill="#8edf22"
          d="M918.959 530.27c0-214.667-174.022-388.69-388.689-388.69S141.58 315.603 141.58 530.27s174.023 388.689 388.69 388.689S918.959 744.937 918.959 530.27"
        />
        <path
          fill="#fff656"
          d="M784.27 530.27c0-140.28-113.72-254-254-254s-254 113.72-254 254 113.72 254 254 254 254-113.72 254-254"
        />
        <path
          fill="#8edf22"
          d="M657.27 530.27c0-70.14-56.86-127-127-127s-127 56.86-127 127 56.86 127 127 127 127-56.86 127-127"
        />
        <g
          fill="none"
          stroke="#87ae19"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeWidth={40}
        >
          <path d="M781.5 462.562c-97.777.427-189.09 27.863-267 75.157-78.321-46.615-169.876-73.27-267.656-72.844-287.031 1.251-518.72 234.968-517.469 522 1.251 287.025 234.97 518.685 522 517.435 97.786-.42 189.116-27.85 267.031-75.15 78.314 46.6 169.858 73.24 267.625 72.81 287.039-1.25 518.719-234.93 517.469-521.97-1.25-287.031-234.97-518.688-522-517.438Z" />
          <path d="M264.061 984.533c-1.25-287.031 230.421-520.729 517.452-521.981 287.027-1.25 520.737 230.421 521.987 517.452 1.25 287.036-230.42 520.726-517.456 521.976-287.033 1.26-520.731-230.42-521.983-517.447Z" />
        </g>
      </g>
      <path
        fill="none"
        stroke="#87ae19"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth={40}
        d="M22.27 530.27c0-280.561 227.439-508 508-508s508 227.439 508 508-227.439 508-508 508-508-227.439-508-508Z"
      />
    </svg>
  );
}
