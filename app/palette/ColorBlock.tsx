interface Props {
  className?: string;
  text?: string;
}

export default function ColorBlock({ className = "", text = "" }: Props) {
  return (
    <div
      className={`flex items-center justify-center text-2xl font-bold ${className}`}
    >
      <p>{text}</p>
    </div>
  );
}
