import adaptiveStyles from "./adaptive.module.css";

interface Props {
  className?: string;
}

export default function AdaptiveFavicon({ className = "" }: Props) {
  return (
    <div
      className={`${adaptiveStyles.container} ${adaptiveStyles.draw} ${className}`}
      aria-label="The website's favicon used for display purposes"
    >
      <div className={`${adaptiveStyles.draw} ${adaptiveStyles.arc}`} />
      <div
        className={`${adaptiveStyles.draw} ${adaptiveStyles.arc} ${adaptiveStyles.small}`}
      />
    </div>
  );
}
