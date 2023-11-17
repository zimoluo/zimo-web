"id random";

export default function ShowSubtitleIcon({ className = "" }: ImageIconProps) {
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
      viewBox="0 0 24 24"
      className={className}
      aria-label="Show subtitle"
    >
      <clipPath id="a_3399aed57858f94ab37b">
        <path d="M0 0h24v24H0z" />
      </clipPath>
      <g clipPath="url(#a_3399aed57858f94ab37b)">
        <path
          fill="#efefef"
          d="M6.969 0C2.599 0 0 2.6 0 6.969V17.03C0 21.412 2.6 24 6.969 24H17.03c4.371 0 6.97-2.6 6.97-6.969V6.97C24.012 2.599 21.4 0 17.031 0H6.97ZM5.625 13.156h3.219c.476 0 .844.4.844.875a.831.831 0 0 1-.844.844H5.625c-.476 0-.875-.368-.875-.844s.399-.875.875-.875Zm6.344 0h6.406c.476 0 .875.4.875.875 0 .476-.399.844-.875.844h-6.406c-.476 0-.875-.368-.875-.844s.399-.875.875-.875ZM5.625 17.5h7.5c.476 0 .875.399.875.875a.877.877 0 0 1-.875.875h-7.5a.884.884 0 0 1-.875-.875c0-.476.399-.875.875-.875Zm10.625 0h2.125c.476 0 .875.399.875.875a.884.884 0 0 1-.875.875H16.25a.884.884 0 0 1-.875-.875c0-.476.399-.875.875-.875Z"
        />
      </g>
    </svg>
  );
}
