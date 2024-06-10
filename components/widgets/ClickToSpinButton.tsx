"use client";

import { ReactNode, useState } from "react";
import buttonStyle from "./click-to-spin-button.module.css";

interface Props {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function ClickToSpinButton({
  children,
  onClick = () => {},
  className = "",
}: Props) {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    if (isSpinning) {
      return;
    }

    setIsSpinning(true);

    setTimeout(() => {
      onClick();
    }, 300);

    setTimeout(() => {
      setIsSpinning(false);
    }, 600);
  };

  return (
    <button
      className={`transition-transform duration-300 ease-in-out rotate-0 ${
        isSpinning ? buttonStyle.spin : ""
      } ${className}`}
      onClick={handleClick}
      disabled={isSpinning}
    >
      {children}
    </button>
  );
}
