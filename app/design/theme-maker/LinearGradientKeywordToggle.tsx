"use client";

import { useGradientData } from "./GradientDataContext";

export default function LinearGradientKeywordToggle() {
  const { selectedLayer, updateGradientProperty } = useGradientData();
  const isKeyword = !!selectedLayer.linearGradientKeyword;

  const handleClick = () => {
    updateGradientProperty("linearGradientKeyword", !isKeyword);
  };

  return (
    <div className="h-10 w-10 p-2 shrink-0 rounded-lg bg-pastel bg-opacity-80 shadow-sm">
      <button
        className="w-full h-auto aspect-square relative"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          fill="none"
          className={`w-full h-auto transition-opacity duration-150 ease-in-out ${
            isKeyword ? "opacity-100" : "opacity-0"
          }`}
        >
          <path
            className="fill-primary transition-all"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M108.575 233H0l226.798 278.652L0 790.316h108.575l226.798-278.664zm86.489 0h108.575L530.45 511.652 303.639 790.316H195.064l226.811-278.664zm196.298 0H499.95l226.798 278.652L499.95 790.316H391.362l226.811-278.664zM1024 511.65 797.176 233H589.958l226.798 278.652-226.798 278.664h207.215z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          fill="none"
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto transition-opacity duration-150 ease-in-out ${
            isKeyword ? "opacity-0" : "opacity-100"
          }`}
        >
          <path
            className="fill-primary transition-all"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M48.18 849.054c-17.573-17.575-17.573-46.067 0-63.641l610.233-610.232c17.574-17.575 46.066-17.575 63.64 0s17.574 46.066 0 63.638L463.686 497.187c63.316 75.941 104.52 170.96 113.719 275.173H943.36c24.853 0 45 20.147 45 45s-20.147 45-45 45h-863c-5.4 0-10.578-.951-15.376-2.695a44.8 44.8 0 0 1-16.804-10.611m439.797-76.694c-8.591-79.695-39.991-152.558-87.539-211.925L188.513 772.36z"
          />
        </svg>
      </button>
      <p className="sr-only">
        {isKeyword ? "Change to angle" : "Change to orientation"}
      </p>
    </div>
  );
}
