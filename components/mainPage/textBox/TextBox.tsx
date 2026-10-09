import type { ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
}

export default function TextBox({ children, className = "" }: Props) {
  return (
    <article
      className={`shadow-lg rounded-[1.75rem] surface-widget surface-widget-70 backdrop-blur-[6px] px-4 py-4 text-base outline-1 outline-edge/15 ${className}`}
    >
      {children}
    </article>
  );
}
