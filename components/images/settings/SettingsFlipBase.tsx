interface Props {
  className?: string;
}

export default function SettingsFlipBase({ className = "" }: Props) {
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
      viewBox="0 0 1600 900"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <path
          id="b"
          d="M0 450C0 201.472 201.472 0 450 0h700c248.53 0 450 201.472 450 450s-201.47 450-450 450H450C201.472 900 0 698.528 0 450Z"
        />
      </defs>
      <clipPath id="a">
        <path d="M0 0h1600v900H0z" />
      </clipPath>
      <g clipPath="url(#a)" opacity={0.095}>
        <use xlinkHref="#b" fill="#aaa" />
        <mask
          id="c"
          width={1600}
          height={900}
          x={0}
          y={0}
          maskUnits="userSpaceOnUse"
        >
          <path d="M0 0h1600v900H0z" />
          <use xlinkHref="#b" fill="#fff" fillRule="evenodd" />
        </mask>
        <use
          xlinkHref="#b"
          fill="none"
          stroke="#a2a2a2"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeWidth={72}
          mask="url(#c)"
        />
      </g>
    </svg>
  );
}
