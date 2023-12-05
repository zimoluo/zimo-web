"id random";

export default function GridViewIcon({ className = "" }: ImageIconProps) {
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
      aria-label="Grid view"
    >
      <clipPath id="a_d2fc37e2e3f6524c42cf">
        <path d="M0 0h1024v1024H0z" />
      </clipPath>
      <g fill="#efefef" clipPath="url(#a_d2fc37e2e3f6524c42cf)">
        <path d="M550 120C550 53.726 603.726 0 670 0h234c66.274 0 120 53.726 120 120v234c0 66.274-53.726 120-120 120H670c-66.274 0-120-53.726-120-120V120Zm0 550c0-66.274 53.726-120 120-120h234c66.274 0 120 53.726 120 120v234c0 66.274-53.726 120-120 120H670c-66.274 0-120-53.726-120-120V670ZM0 120C0 53.726 53.726 0 120 0h234c66.274 0 120 53.726 120 120v784c0 66.274-53.726 120-120 120H120C53.726 1024 0 970.274 0 904V120Z" />
      </g>
    </svg>
  );
}
