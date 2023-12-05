export default function BanUserIcon({ className = "", color }: ImageIconProps) {
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
      aria-label="Ban user"
    >
      <path
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={2.1}
        d="M19.65 19.65A10.784 10.784 0 0 0 22.818 12c0-5.975-4.843-10.818-10.818-10.818-2.987 0-5.692 1.21-7.65 3.168m15.3 15.3A10.784 10.784 0 0 1 12 22.818C6.025 22.818 1.182 17.975 1.182 12c0-2.987 1.21-5.692 3.168-7.65m15.3 15.3L4.35 4.35"
      />
    </svg>
  );
}
