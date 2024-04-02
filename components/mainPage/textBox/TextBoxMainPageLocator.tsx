import { ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
  maxWidth?: string;
}

export default function TextBoxMainPageLocator({
  children,
  className = "",
  maxWidth = "50rem",
}: Props) {
  return (
    <div
      className={`w-full px-6 md:px-14 mb-24 flex justify-center items-center ${className}`}
    >
      <div style={{ maxWidth: maxWidth }}>{children}</div>
    </div>
  );
}
