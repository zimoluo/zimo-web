"use client";

import buttonStyle from "./expand-menu-button.module.css";
import SettingsPanelIcon from "../assets/navigation/SettingsPanelIcon";
import { RefObject } from "react";

interface Props {
  onClick?: () => void;
  isOpen: boolean;
  className?: string;
  buttonRef?: RefObject<HTMLButtonElement | null>;
}

export default function ExpandMenuButton({
  onClick = () => {},
  isOpen,
  className = "",
  buttonRef,
}: Props) {
  return (
    <button
      className={`h-6 w-auto aspect-square hover:scale-110 transition-transform duration-300 ease-out ${className}`}
      onClick={onClick}
      ref={buttonRef}
    >
      <div
        className={`absolute pointer-events-none ${
          isOpen
            ? buttonStyle.menuButtonTranslationOpen
            : buttonStyle.menuButtonTranslationClosedUpper
        } ${buttonStyle.menuButton}`}
      >
        <SettingsPanelIcon
          className={`h-6 w-auto ${
            isOpen
              ? buttonStyle.menuButtonRotationOpenUpper
              : buttonStyle.menuButtonRotationClosed
          } aspect-square ${buttonStyle.menuButton}`}
        />
      </div>
      <div
        className={`absolute pointer-events-none ${
          isOpen
            ? buttonStyle.menuButtonTranslationOpen
            : buttonStyle.menuButtonTranslationClosedLower
        } ${buttonStyle.menuButton}`}
      >
        <SettingsPanelIcon
          className={`h-6 w-auto ${
            isOpen
              ? buttonStyle.menuButtonRotationOpenLower
              : buttonStyle.menuButtonRotationClosed
          } aspect-square ${buttonStyle.menuButton}`}
        />
      </div>
    </button>
  );
}
