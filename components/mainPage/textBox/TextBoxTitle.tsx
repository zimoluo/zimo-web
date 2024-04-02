import { ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
}

export default function TextBoxTitle({ children, className = "" }: Props) {
  return <h2 className={`text-xl font-bold mb-2 ${className}`}>{children}</h2>;
}
