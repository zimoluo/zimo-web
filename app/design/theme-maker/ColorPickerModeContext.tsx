"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ColorPickerModeContext = createContext<
  | {
      colorPickerMode: ColorPickerMode;
      setColorPickerMode: React.Dispatch<React.SetStateAction<ColorPickerMode>>;
    }
  | undefined
>(undefined);

export function ColorPickerModeProvider({ children }: Props) {
  const [colorPickerMode, setColorPickerMode] =
    useState<ColorPickerMode>("palette");

  return (
    <ColorPickerModeContext.Provider
      value={{
        colorPickerMode,
        setColorPickerMode,
      }}
    >
      {children}
    </ColorPickerModeContext.Provider>
  );
}

export const useColorPickerMode = () => {
  const context = useContext(ColorPickerModeContext);
  if (context === undefined) {
    throw new Error(
      "useColorPickerMode must be used within a ColorPickerModeProvider"
    );
  }
  return context;
};
