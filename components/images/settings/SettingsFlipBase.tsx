"id random";

interface Props {
  className?: string;
}

const identifier = "flipBase";

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
          id={`${identifier}-b`}
          d="M0 450C0 201.472 201.472 0 450 0h700c248.53 0 450 201.472 450 450s-201.47 450-450 450H450C201.472 900 0 698.528 0 450Z"
        />
      </defs>
      <clipPath id={`${identifier}-a`}>
        <path d="M0 0h1600v900H0z" />
      </clipPath>
      <g clipPath={`url(#${identifier}-a)`} opacity={0.095}>
        <use xlinkHref={`#${identifier}-b`} fill="#aaa" />
        <mask
          id={`${identifier}-c`}
          width={1600}
          height={900}
          x={0}
          y={0}
          maskUnits="userSpaceOnUse"
        >
          <path d="M0 0h1600v900H0z" />
          <use xlinkHref={`#${identifier}-b`} fill="#fff" fillRule="evenodd" />
        </mask>
        <use
          xlinkHref={`#${identifier}-b`}
          fill="none"
          stroke="#a2a2a2"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeWidth={72}
          mask={`url(#${identifier}-c)`}
        />
      </g>
    </svg>
  );
}
