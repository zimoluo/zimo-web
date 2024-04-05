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
      className={`w-4 aspect-square h-auto rounded-full border-0.4 bg-light border-saturated flex justify-center items-center ${className}`}
      onClick={() => {
        if (!state) {
          onClick();
        }
      }}
    >
      {state && <div className={`${radioButtonStyle.inner} bg-saturated`} />}
    </button>
  );
}
