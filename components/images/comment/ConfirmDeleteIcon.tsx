export default function ConfirmDeleteIcon({
  className = "",
  color,
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
      viewBox="0 0 492 492"
      className={className}
      aria-label="Confirm delete comment"
    >
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        d="m444.575 127.985-13.439-13.44c-4.223-4.226-9.853-6.551-15.864-6.551-6.011 0-11.645 2.325-15.867 6.551L210.566 303.381 92.582 185.394c-4.223-4.22-9.857-6.548-15.867-6.548-6.008 0-11.638 2.328-15.865 6.548L47.408 198.83c-4.226 4.232-6.548 9.87-6.548 15.874 0 6.007 2.322 11.641 6.548 15.867l133.211 133.204c.177.25.363.484.58.697l13.443 13.219c4.222 4.21 9.856 6.315 15.914 6.315h.07c6.014 0 11.648-2.105 15.864-6.315l13.446-13.335c.217-.214.4-.391.51-.571l204.126-204.106c8.756-8.735 8.756-22.949.003-31.694Z"
      />
    </svg>
  );
}
