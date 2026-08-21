"use client";

import type { InputParserData } from "@/src/features/entries/model/entry";
import codeStyle from "./editor-code.module.css";
import { useInputParser } from "@/lib/helperHooks";

export default function ColorCodeInputParser({
  value,
  setValue,
  isValid,
  formatValue,
}: InputParserData<string | number>) {
  const [storedValue, handleChange] = useInputParser({
    value,
    setValue,
    isValid,
    formatValue,
  });

  return (
    <input
      className={`rounded-md bg-fill/80 shadow-xs ${codeStyle.inputLine} px-1.5 w-full text-center`}
      value={storedValue}
      onChange={handleChange}
    />
  );
}
