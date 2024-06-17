"use client";

import CircledEllipsisIcon from "@/components/assets/entries/CircledEllipsisIcon";
import { Fragment, useEffect, useRef, useState } from "react";
import DropdownMenuWrapper from "./DropdownMenuWrapper";

interface Props<T> {
  optionsList: T[];
  namesList: string[];
  currentValue: T;
  setValue: (newValue: T) => void;
  fallbackName?: string;
}

export default function EditorDropdownMenu<T>({
  optionsList,
  namesList,
  currentValue,
  setValue,
  fallbackName = "Unknown",
}: Props<T>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const expandMenu = () => {
    if (isExpanded) {
      return;
    }

    setIsExpanded(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        isExpanded
      ) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isExpanded) {
        event.preventDefault();
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  const currentValueIndex = optionsList.indexOf(currentValue);

  return (
    <div
      className="rounded-xl bg-light bg-opacity-80 shadow-lg px-3 py-2 h-10 flex items-center relative cursor-pointer"
      ref={dropdownRef}
      onClick={expandMenu}
    >
      <p className="flex-grow shrink-0">
        {namesList[currentValueIndex] ?? fallbackName}
      </p>
      <button
        className={`${
          isExpanded ? "pointer-events-none" : ""
        } transition-transform duration-300 ease-out hover:scale-110 shrink-0`}
        onClick={expandMenu}
      >
        <CircledEllipsisIcon className="h-5 w-auto aspect-square" />
      </button>
      {isExpanded && (
        <DropdownMenuWrapper>
          <div
            className={`absolute z-5 w-full left-0 overflow-hidden rounded-xl cursor-auto shadow-lg top-0 ${
              isExpanded ? "" : "pointer-events-none select-none"
            }`}
            style={{
              maxHeight: isExpanded ? "max-content" : "2.5rem",
              transform: `translate(0%, calc(${
                currentValueIndex * -1
              } * (2.5rem + 1px)))`,
            }}
          >
            <div className="w-full flex-col flex gap-2 px-3 py-2 justify-center items-start bg-pastel">
              {optionsList.map((option, index) => {
                return (
                  <Fragment key={index}>
                    {index !== 0 && (
                      <hr className="border-t w-full border-soft border-opacity-90" />
                    )}
                    <button
                      onClick={() => {
                        setValue(option);
                        setIsExpanded(false);
                      }}
                      className="w-full text-left"
                    >
                      {namesList[index]}
                    </button>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </DropdownMenuWrapper>
      )}
    </div>
  );
}
