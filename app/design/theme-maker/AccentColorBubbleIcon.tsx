export default function AccentColorBubbleIcon({
  className = "",
  accentType,
}: ImageIconProps & { accentType: AccentColors }) {
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
      aria-label="Accent color"
    >
      <path
        style={{
          fill: `color-mix(in srgb, rgba(230, 230, 230, 1) 50%, rgb(var(--color-${accentType})))`,
        }}
        d="M103.787 512c0-225.45 182.763-408.213 408.213-408.213S920.213 286.55 920.213 512 737.45 920.213 512 920.213 103.787 737.45 103.787 512"
      />
      <path
        style={{
          fill: `rgb(var(--color-${accentType}))`,
        }}
        d="M511.886 0C229.6 0 0 229.605 0 511.886 0 794.172 229.6 1024 511.886 1024c282.281 0 512.104-229.828 512.114-512.114C1024 229.606 794.172 0 511.886 0m0 141.179c204.41 0 370.708 166.297 370.708 370.707 0 21.941-17.686 39.849-39.621 39.849-21.936.001-39.621-17.908-39.621-39.849-.001-160.608-130.858-291.238-291.466-291.238-21.935.001-39.621-17.68-39.621-39.621 0-21.94 17.686-39.848 39.621-39.848"
      />
    </svg>
  );
}
