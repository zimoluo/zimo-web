"id random";

export default function PlainDarkFavicon({
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
          id="a_fb938987_0e2d822e370a16da4247"
          d="M22.27 530.27c0-280.561 227.439-508 508-508 280.561 0 508 227.439 508 508 0 280.561-227.439 508-508 508-280.561 0-508-227.439-508-508Z"
        />
        <path
          id="c_ef7ab927_8a45f6f47f4cf1f597bc"
          d="M526.89-56.031c-219.954.959-407.267 138.433-482.3 331.777-19.167 73.108-30.761 149.294-33.456 227.768.468 6.099.886 12.215 1.559 18.255-.64.327-1.247.709-1.886 1.04-.09 5.673-.259 11.324-.259 17.02 0 378.406 202.39 709.271 504.649 891.061 1.04-.62 2.15-1.13 3.184-1.75 5.094 3.03 10.387 5.71 15.592 8.57 308.563-180.26 516.017-514.735 516.017-897.881 0-1.24-.06-2.465-.07-3.702-1.93-1.155-3.76-2.445-5.71-3.575 2.25-17.002 3.43-34.321 4.03-51.777-3.53-62.833-12.57-124.171-26.77-183.525C951.81 91.061 756.488-57.032 526.89-56.031Z"
        />
      </defs>
      <use
        xlinkHref="#a_fb938987_0e2d822e370a16da4247"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth={40}
      />
      <clipPath id="b_799eb507_8374471bb528abb7709e" clipRule="nonzero">
        <use xlinkHref="#a_fb938987_0e2d822e370a16da4247" />
      </clipPath>
      <g clipPath="url(#b_799eb507_8374471bb528abb7709e)">
        <path
          fill="none"
          stroke="#ffffff"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeWidth={40}
          d="M526.89-56.031c-219.954.959-407.267 138.433-482.3 331.777-19.167 73.108-30.761 149.294-33.456 227.768.468 6.099.886 12.215 1.559 18.255-.64.327-1.247.709-1.886 1.04-.09 5.673-.259 11.324-.259 17.02 0 378.406 202.39 709.271 504.649 891.061 1.04-.62 2.15-1.13 3.184-1.75 5.094 3.03 10.387 5.71 15.592 8.57 308.563-180.26 516.017-514.735 516.017-897.881 0-1.24-.06-2.465-.07-3.702-1.93-1.155-3.76-2.445-5.71-3.575 2.25-17.002 3.43-34.321 4.03-51.777-3.53-62.833-12.57-124.171-26.77-183.525C951.81 91.061 756.488-57.032 526.89-56.031Z"
          opacity={0.332}
        />
        <use
          xlinkHref="#c_ef7ab927_8a45f6f47f4cf1f597bc"
          fill="none"
          stroke="#ffffff"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeWidth={40}
        />
        <clipPath id="d_a9a40a75_d28b8402381014043d94" clipRule="nonzero">
          <use xlinkHref="#c_ef7ab927_8a45f6f47f4cf1f597bc" />
        </clipPath>
        <g
          fill="none"
          stroke="#ffffff"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeWidth={40}
          clipPath="url(#d_a9a40a75_d28b8402381014043d94)"
        >
          <path d="M264.061 984.533c-1.25-287.031 230.421-520.729 517.452-521.981 287.027-1.25 520.737 230.421 521.987 517.452 1.25 287.036-230.42 520.726-517.456 521.976-287.033 1.26-520.731-230.42-521.983-517.447Z" />
          <path d="M246.844 464.875c-287.031 1.252-518.72 234.969-517.469 522 1.251 287.035 234.969 518.685 522 517.435 97.786-.42 189.116-27.85 267.031-75.15-151.605-90.22-253.518-255.36-254.344-444.629-.824-189.254 99.638-355.273 250.438-446.812-78.322-46.617-169.875-73.27-267.656-72.844Z" />
        </g>
      </g>
      <path
        fill="none"
        stroke="#ffffff"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth={40}
        d="M22.27 530.27c0-280.561 227.439-508 508-508 280.561 0 508 227.439 508 508 0 280.561-227.439 508-508 508-280.561 0-508-227.439-508-508Z"
      />
    </svg>
  );
}
