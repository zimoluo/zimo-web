"use client";

import {
  addActivePopup,
  isActivePopup,
  removeActivePopup,
} from "@/lib/popUpUtil";
import { useState, useEffect, useRef, ReactNode } from "react";
import CrossIcon from "@/components/assets/CrossIcon";
import Link from "next/link";
import EnterFullPageIcon from "../assets/entries/EnterFullPageIcon";

interface Props {
  children?: ReactNode;
  linkToPage?: string;
  onClose: () => void;
  desktopOnly?: boolean;
}

export default function PopUpDisplay({
  children,
  onClose,
  linkToPage = "",
  desktopOnly = false,
}: Props) {
  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: 0,
    transform: "scale(1.25)",
  });

  const instanceRef = useRef({});

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && desktopOnly) {
        onClose();
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onClose]);

  useEffect(() => {
    addActivePopup(instanceRef.current);

    const currentRef = instanceRef.current;

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        if (isActivePopup(currentRef)) {
          e.preventDefault();
          removeActivePopup(currentRef);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      removeActivePopup(currentRef);
    };
  }, [onClose]);

  useEffect(() => {
    setStyle({
      opacity: 1,
      transform: "scale(1)",
      transition: "opacity 200ms ease-out, transform 200ms ease-out",
    });
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-60 px-12 py-12">
      <div style={style}>{children}</div>
      <div className="absolute top-3 right-3 z-70 flex items-center justify-center">
        {linkToPage && (
          <Link href={linkToPage}>
            <EnterFullPageIcon
              color="#efefef"
              className="h-4 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110"
            />
          </Link>
        )}
        <button className="ml-4" onClick={onClose}>
          <CrossIcon
            color="#efefef"
            className="h-4 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110"
          />
        </button>
      </div>
    </div>
  );
}
