"id random";

export default function MagnifyingGlassIcon({
  className = "",
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
      viewBox="0 0 492.456 494.456"
      className={className}
      aria-label="Show full image"
    >
      <clipPath id="a_a1fd38d6466b70760ddc">
        <path d="M0 0h492.456v494.456H0z" />
      </clipPath>
      <g clipPath="url(#a_a1fd38d6466b70760ddc)">
        <path
          fill="none"
          stroke="#efefef"
          strokeLinejoin="miter"
          strokeWidth={36}
          d="M280 278c59.002-60.103 58.333-156.59-1.497-215.869-59.829-59.28-156.318-59.056-215.873.499-59.555 59.555-59.778 156.044-.499 215.873C121.41 338.333 217.897 339.002 278 280l170 170m-91-117 110 110-26 26-110-110"
        />
        <g fill="#efefef">
          <path d="M105.698 175.054c0-8.411 6.818-15.229 15.229-15.229H227.18c8.411 0 15.229 6.818 15.229 15.229 0 8.41-6.818 15.228-15.229 15.228H120.927c-8.411 0-15.229-6.818-15.229-15.228Z" />
          <path d="M174.054 106.698c8.41 0 15.228 6.818 15.228 15.229V228.18c0 8.411-6.818 15.229-15.228 15.229-8.411 0-15.229-6.818-15.229-15.229V121.927c0-8.411 6.818-15.229 15.229-15.229Z" />
        </g>
      </g>
    </svg>
  );
}
