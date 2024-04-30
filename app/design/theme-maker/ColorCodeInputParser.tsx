"use client";

import { useEffect, useState } from "react";
import codeStyle from "./editor-code.module.css";

interface Props<T> {
  value: T;
  setValue: (newValue: T) => void;
  isValid: (rawInput: string) => boolean;
  formatValue: (rawInput: string) => T;
}

export default function ColorCodeInputParser({
  value,
  setValue,
  isValid,
  formatValue,
}: Props<string | number>) {
  const [storedValue, setStoredValue] = useState<string>(
    `${formatValue(`${value}`)}`
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventValue = event.target.value;
    setStoredValue(eventValue);

    if (!isValid(eventValue)) {
      return;
    }

    const formattedVaue = formatValue(eventValue);

    setValue(formattedVaue);
  };

  useEffect(() => {
    setStoredValue(`${formatValue(`${value}`)}`);
  }, [value]);

  return (
    <input
      className={`rounded-md bg-pastel bg-opacity-80 ${codeStyle.inputLine} px-1.5 w-full text-center`}
      value={storedValue}
      onChange={handleChange}
    />
  );
}