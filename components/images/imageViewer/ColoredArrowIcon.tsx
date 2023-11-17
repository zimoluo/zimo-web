export default function ColoredArrowIcon({
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
      viewBox="0 0 1024 1024"
      className={className}
      aria-label="Colored arrow"
    >
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        d="M512 0C229.23 0 0 229.23 0 512s229.23 512 512 512 512-229.23 512-512S794.77 0 512 0Zm51.906 303.656c11.265 0 22.531 4.312 31.125 12.906l1.25 1.25c17.189 17.19 17.189 45.061 0 62.25l-133 133 128.157 128.157c18.44 18.441 19.739 47.506 3.937 67.469a51.502 51.502 0 0 0 4.5-3.969l-8.437 8.437c1.42-1.421 2.719-2.93 3.937-4.468-19.962 15.775-49.007 14.462-67.437-3.969L372.562 549.344c-1.563-1.564-2.963-3.233-4.281-4.938l-.562-.562c-16.005-16.005-16.893-41.157-3.094-58.438-.159.156-.342.28-.5.438l.719-.719c.958-1.18 1.776-2.433 2.875-3.531l165.062-165.032a43.9 43.9 0 0 1 31.125-12.906Z"
        opacity={0.8}
      />
    </svg>
  );
}
