"id random";

export default function SettingsPanelIcon({
  color = null,
  className = "",
  height,
  width,
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
      aria-label="Settings panel button"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        d="M170.873 509.835c0-13.586 11.013-24.6 24.6-24.6h633.054c13.587 0 24.6 11.014 24.6 24.6v4.33c0 13.586-11.013 24.6-24.6 24.6H195.473c-13.587 0-24.6-11.014-24.6-24.6v-4.33z"
      />
    </svg>
  );
}
