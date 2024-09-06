import { ReactNode } from "react";
import headerStyle from "./header-text.module.css";

interface Props {
  title: string | ReactNode;
  subtitle: string | ReactNode;
  className?: string;
  children?: ReactNode;
  isGradient?: boolean;
}

export default function HeaderText({
  title,
  subtitle,
  className = "",
  children,
  isGradient = false,
}: Props) {
  return (
    <header
      className={`${headerStyle.title} ${headerStyle.shadow} flex items-center justify-center px-12 md:px-16 ${className}`}
    >
      <h1
        className={`text-left font-bold text-5xl md:text-6xl ${
          isGradient ? headerStyle.gradient : ""
        }`}
      >
        {title}
        <div className="text-lg md:text-xl font-normal mt-4">{subtitle}</div>
        {children}
      </h1>
    </header>
  );
}
