import { ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
}

export default function ColorBlock({ className = "", children }: Props) {
  return (
    <div
      className={`flex items-center justify-center text-2xl leading-10 font-bold text-center ${className} group`}
    >
      <p className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {children}
      </p>
    </div>
  );
}
