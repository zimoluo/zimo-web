"use client";

import { useNavigationUi } from "@/src/features/navigation";
import navbarStyle from "./navbar.module.css";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export default function NavbarExpandWrapper({
  children,
  className = "",
}: Props) {
  const isSideMenuExpanded = useNavigationUi((state) => state.sideMenuExpanded);

  return (
    <div
      style={{
        transition:
          "opacity var(--zw-duration-transition) var(--zw-ease-enter), transform var(--zw-duration-transition) var(--zw-ease-enter), filter var(--zw-duration-state) var(--zw-ease-enter)",
      }}
      className={`${
        navbarStyle.scrollExpansion
      }  ${
        isSideMenuExpanded ? navbarStyle.squeezeNavWhenMenuOpen : ""
      }  ${className}`}
    >
      {children}
    </div>
  );
}
