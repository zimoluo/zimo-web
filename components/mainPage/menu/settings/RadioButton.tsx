"use client";

import radioButtonStyle from "./radio-button.module.css";

interface Props {
  onClick: () => void;
  state: boolean;
  className?: string;
}

export default function RadioButton({ state, onClick, className = "" }: Props) {
  return (
    <button
      className={`w-4 h-auto aspect-square rounded-full bg-saturated relative ${className}`}
      onClick={() => {
        if (!state) {
          onClick();
        }
      }}
    >
      <div
        className={`bg-light rounded-full ${radioButtonStyle.position} ${radioButtonStyle.filling}`}
      />
      <div
        className={`${radioButtonStyle.inner} ${
          radioButtonStyle.position
        } bg-saturated rounded-full transition-opacity duration-150 ease-out ${
          state ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
}
