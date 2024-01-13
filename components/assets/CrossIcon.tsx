export default function CrossIcon({ className = "", color }: ImageIconProps) {
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
      aria-label="Close pop-up"
    >
      <g fill={color || undefined} className={color ? "" : "fill-primary"}>
        <path d="M91.972 931.032c-23.724-23.724-23.724-62.187 0-85.911L845.12 91.971c23.724-23.723 62.187-23.723 85.911 0l.996.997c23.724 23.724 23.724 62.187 0 85.911L178.879 932.028c-23.724 23.724-62.187 23.724-85.911 0l-.996-.996Z" />
        <path d="M92.968 91.972c23.724-23.724 62.187-23.724 85.911 0L932.028 845.12c23.724 23.724 23.724 62.187 0 85.911l-.996.996c-23.724 23.724-62.187 23.724-85.911 0L91.971 178.879c-23.723-23.724-23.723-62.187 0-85.911l.997-.996Z" />
      </g>
    </svg>
  );
}
