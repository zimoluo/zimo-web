export default function HeartIcon({ className = "", color }: ImageIconProps) {
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
      aria-label="Like this"
    >
      <path
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={1.6}
        d="M16.59 2.076c3.932 0 6.575 3.697 6.575 7.145 0 6.984-10.966 12.703-11.165 12.703-.198 0-11.164-5.719-11.164-12.703 0-3.448 2.642-7.145 6.574-7.145 2.258 0 3.734 1.129 4.59 2.121.856-.992 2.332-2.121 4.59-2.121Z"
      />
    </svg>
  );
}
