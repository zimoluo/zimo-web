import { ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
}

export default function TextBox({ children, className = "" }: Props) {
  return (
    <article
      className={`shadow-lg rounded-3xl bg-widget-70 backdrop-blur-sm px-4 py-4 text-base ${className}`}
    >
      {children}
    </article>
  );
}
