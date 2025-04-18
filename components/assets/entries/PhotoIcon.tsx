export default function PhotoIcon({
  color = null,
  className = "",
  height,
  width,
  strokeWidth = 76,
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
      aria-label="Single photo"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <path
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={strokeWidth}
        d="m641.042 736.437-95.081-94.283c-45.88-45.503-68.822-68.252-95.145-76.568a114 114 0 0 0-71.028.769c-26.14 8.886-48.584 32.125-93.469 78.603L58.514 869.965m582.528-133.528 19.46-19.294c45.936-45.555 68.901-68.332 95.258-76.648a113.97 113.97 0 0 1 71.084.821c26.152 8.914 48.593 32.216 93.469 78.813l47.686 47.994m-326.957-31.686 228.632 229.082m0 0c-20.372 2.48-46.78 2.48-84.075 2.48H238.401c-63.846 0-95.769 0-120.155-12.426a114 114 0 0 1-49.82-49.818c-5.131-10.072-8.143-21.426-9.912-35.79m811.16 95.554c14.495-1.761 25.941-4.776 36.081-9.946a113.98 113.98 0 0 0 49.818-49.818c12.426-24.384 12.426-56.31 12.426-120.156v-17.476M58.514 869.965c-2.513-20.406-2.513-46.888-2.513-84.366V238.401c0-63.846 0-95.769 12.425-120.155a114 114 0 0 1 49.82-49.82c24.386-12.425 56.309-12.425 120.155-12.425h547.198c63.846 0 95.772 0 120.156 12.425a114 114 0 0 1 49.818 49.82c12.426 24.386 12.426 56.309 12.426 120.155v529.722m-171-427.129c0 62.963-51.037 114-113.999 114s-114-51.037-114-114c0-62.96 51.038-114 114-114s113.999 51.04 113.999 114"
      />
    </svg>
  );
}
