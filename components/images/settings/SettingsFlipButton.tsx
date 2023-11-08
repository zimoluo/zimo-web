interface Props {
  className?: string;
}

export default function SettingsFlipButton({ className = "" }: Props) {
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
      aria-hidden="true"
    >
      <path
        fill="#fafafa"
        d="M49.013 512C49.013 256.299 256.299 49.013 512 49.013c255.701 0 462.987 207.286 462.987 462.987 0 255.701-207.286 462.987-462.987 462.987-255.701 0-462.987-207.286-462.987-462.987Z"
      />
    </svg>
  );
}
