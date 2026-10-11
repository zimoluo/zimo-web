"use client";

import navbarStyle from "./navbar.module.css";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export default function NavbarExpandWrapper({
  children,
  className = "",
}: Props) {
  return (
    <div
      data-navigation-destinations
      className={`${navbarStyle.scrollExpansion} ${className}`}
    >
      {children}
    </div>
  );
}
