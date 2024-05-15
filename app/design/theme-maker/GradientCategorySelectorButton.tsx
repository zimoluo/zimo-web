"use client";

import { useGradientData } from "./GradientDataContext";
import selectorStyle from "./category-selector.module.css";

interface Props {
  index: number;
  category: GradientCategory;
}

const categoryIndexMap: Record<GradientCategory, number> = {
  widget: 0,
  page: 1,
  pageMinimal: 2,
};

const categoryNameMap: Record<GradientCategory, string> = {
  widget: "Widget",
  page: "Backdrop",
  pageMinimal: "Backdrop Minimal",
};

export default function GradientCategorySelectorButton({
  index,
  category,
}: Props) {
  const { selectedGradientCategory, setSelectedGradientCategory } =
    useGradientData();

  const isSelected = category === selectedGradientCategory;

  return (
    <button
      className={`rounded-xl relative ${selectorStyle.button} bg-light bg-opacity-80 shadow-md flex items-center justify-center overflow-hidden`}
      onClick={() => {
        setSelectedGradientCategory(category);
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full h-full">
        <div
          style={
            {
              "--selector-translate-value": `calc(${
                categoryIndexMap[selectedGradientCategory] - index
              } * (100% + var(--button-translate-gap)))`,
            } as Record<string, string>
          }
          className={`w-full h-full rounded-xl bg-saturated ${
            isSelected ? selectorStyle.buttonOn : selectorStyle.buttonOff
          } transition-transform duration-500 ease-out`}
        />
      </div>
      <p
        className={`relative max-w-full text-center p-2 transition-colors duration-500 ease-out ${
          isSelected ? "text-light" : "text-primary"
        } ${selectorStyle.buttonText}`}
      >
        {categoryNameMap[category]}
      </p>
    </button>
  );
}
