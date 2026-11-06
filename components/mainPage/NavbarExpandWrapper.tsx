"use client";

import { useMenuControl } from "../contexts/MenuControlContext";
import navbarStyle from "./navbar.module.css";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export default function NavbarExpandWrapper({
  children,
  className = "",
}: Props) {
  const { isNavbarExpanded } = useMenuControl();

  return (
    <div
      data-navbar-destinations
      inert={!isNavbarExpanded}
      aria-hidden={!isNavbarExpanded}
      className={`${navbarStyle.destinations} ${className}`}
    >
      {children}
    </div>
  );
}
