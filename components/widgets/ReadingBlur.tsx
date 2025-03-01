interface Props {
  className?: string;
}

export default function ReadingBlur({ className = "" }: Props) {
  return (
    <div
      className={`fixed inset-0 -z-[5] backdrop-blur-reading pointer-events-none h-screen w-screen select-none ${className}`}
      aria-hidden="true"
    />
  );
}
