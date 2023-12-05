export default function TwitterLogo({ className = "", color }: ImageIconProps) {
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
      viewBox="0 0 1200 1227"
      className={className}
      aria-label="Twitter logo"
    >
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        d="M934.941 87.075h178.609L723.346 533.05l459.044 606.879H822.961L541.445 771.86l-322.118 368.07H40.612l417.361-477.027L17.612 87.075h368.551L640.629 423.5 934.941 87.075Zm-62.685 945.945h98.968L332.387 188.364H226.184l646.072 844.656Z"
      />
    </svg>
  );
}
