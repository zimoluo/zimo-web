interface Props {
  className?: string;
  children?: React.ReactNode;
}

export default function BlogTitle({ className = "", children }: Props) {
  return (
    <h1
      className={`font-bold text-4xl text-primary leading-relaxed ${className}`}
    >
      {children}
    </h1>
  );
}
