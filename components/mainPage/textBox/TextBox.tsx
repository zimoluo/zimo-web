import { ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
}

export default function TextBox({ children, className = "" }: Props) {
  return (
    <article
      className={`shadow-lg rounded-xl bg-widget-70 backdrop-blur-2xl px-6 py-4 text-base ${className}`}
    >
      {children}
    </article>
  );
}
