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
  const { isNavbarExpanded, isSideMenuExpanded } = useMenuControl();

  return (
    <div
      style={{
        transition:
          "opacity 0.24s ease-out, transform 0.24s cubic-bezier(.37,.01,.11,.93), filter 0.2s ease-out",
      }}
      className={`${
        isNavbarExpanded ? navbarStyle.expanded : navbarStyle.collapsed
      } ${
        isSideMenuExpanded ? navbarStyle.squeezeNavWhenMenuOpen : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
