export default function ExpandCollapseIcon({
  className = "",
  color,
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
      viewBox="0 0 1024 1024"
      className={className}
      aria-label="Delete comment"
    >
      <defs>
        <path
          id="a"
          d="M118.375 204.469c-27.256 0-54.519 10.393-75.313 31.187l-3.03 3c-20.795 20.794-31.22 48.059-31.22 75.313 0 27.254 10.425 54.518 31.22 75.312l399.281 399.375c2.657 2.658 5.707 4.62 8.562 6.938l1.719 1.75c-.382-.382-.655-.833-1.031-1.219 41.809 33.386 102.652 31.253 141.375-7.469l1.343-1.375c4.125-3.188 8.185-6.591 11.969-10.375L979.156 401c44.594-44.592 47.794-114.859 9.625-163.156-1.562-1.237-3.206-2.319-4.812-3.469-.411-.28-1.11-.745-1.25-.844-.026-.018-.039-.043-.063-.062-47.974-33.408-114.339-28.88-157.125 13.906L515.469 557.438 193.688 235.656c-20.795-20.794-48.057-31.187-75.313-31.187Z"
        />
      </defs>
      <mask
        id="b"
        width={1006.38}
        height={615.082}
        x={8.813}
        y={204.469}
        maskUnits="userSpaceOnUse"
      >
        <path d="M8.813 204.469h1006.38v615.082H8.813z" />
        <use xlinkHref="#a" fill="#fff" fillRule="evenodd" />
      </mask>
      <use
        xlinkHref="#a"
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="butt"
        strokeWidth={160}
        mask="url(#b)"
      />
    </svg>
  );
}
