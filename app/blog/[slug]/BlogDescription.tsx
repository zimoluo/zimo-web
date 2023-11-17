interface Props {
  className?: string;
  children?: React.ReactNode;
}

export default function BlogDescription({ className = "", children }: Props) {
  return (
    <div className={`text-xl text-saturated opacity-80 mt-4 ${className}`}>
      {children}
    </div>
  );
}
