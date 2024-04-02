import FaviconOutline from "./FaviconOutline";
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
      <FaviconOutline color={color} className="relative" />
    </div>
  );
}
