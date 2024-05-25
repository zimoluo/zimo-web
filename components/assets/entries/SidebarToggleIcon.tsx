export default function SidebarToggleIcon({
  color = null,
  className = "",
  height,
  width,
  isLight = false,
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
      aria-label="Toggle sidebar"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <path
        className={color ? "" : isLight ? "fill-light" : "fill-primary"}
        fill={color || undefined}
        d="M136.302 911.571h751.396c90.722 0 136.302-45.144 136.302-134.564V246.993c0-89.42-45.58-134.564-136.302-134.564H136.302C46.013 112.429 0 157.138 0 246.993v530.014c0 89.855 46.013 134.564 136.302 134.564m1.302-69.886c-43.41 0-67.718-23.007-67.718-68.151V250.466c0-45.144 24.309-68.151 67.718-68.151h488.341v659.37zm748.788-659.37c42.974 0 67.714 23.007 67.714 68.151v523.068c0 45.144-24.74 68.151-67.714 68.151H694.095v-659.37zM777.438 343.359h92.899c13.449 0 24.74-11.72 24.74-24.309 0-13.022-11.291-24.306-24.74-24.306h-92.899c-13.022 0-24.742 11.284-24.742 24.306 0 12.589 11.72 24.309 24.742 24.309m0 112.429h92.899c13.449 0 24.74-11.722 24.74-24.744s-11.291-23.875-24.74-23.875h-92.899c-13.022 0-24.742 10.853-24.742 23.875s11.72 24.744 24.742 24.744m0 111.993h92.899c13.449 0 24.74-10.853 24.74-23.875s-11.291-24.309-24.74-24.309h-92.899c-13.022 0-24.742 11.287-24.742 24.309s11.72 23.875 24.742 23.875"
      />
    </svg>
  );
}
