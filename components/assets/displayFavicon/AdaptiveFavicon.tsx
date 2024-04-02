import adaptiveStyles from "./adaptive.module.css";

export default function AdaptiveFavicon({
  className = "",
  color,
}: ImageIconProps) {
  return (
    <div
      className={`${adaptiveStyles.container} ${className}`}
      aria-label="The website's favicon used for display purposes"
    >
      <div className={`${adaptiveStyles.backdrop}`} />
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
        viewBox="0 0 1060 1060"
        className="relative"
      >
        <g
          fill="none"
          className={color ? "" : "stroke-primary"}
          stroke={color || undefined}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeWidth={40}
        >
          <path d="M781.219 462.281c-97.777.427-189.09 27.863-267 75.157-78.321-46.616-169.876-73.27-267.657-72.844-80.384.35-156.415 18.963-224.218 51.844C22.225 520.955 22 525.454 22 530c0 280.561 227.439 508 508 508s508-227.439 508-508c0-.367-.03-.727-.03-1.094-75.877-42.705-163.462-67.031-256.751-66.625Z" />
          <path d="M781.25 462.281c-279.895 1.221-507.064 223.486-517.031 500.688C341.545 1010.54 432.552 1038 530 1038c280.561 0 508-227.439 508-508 0-.367-.03-.727-.03-1.094-75.872-42.702-163.437-67.031-256.72-66.625Z" />
          <path d="M22 530C22 249.439 249.439 22 530 22s508 227.439 508 508-227.439 508-508 508S22 810.561 22 530Z" />
        </g>
      </svg>
    </div>
  );
}
