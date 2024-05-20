"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ColorPanelContext = createContext<
  | {
      colorPickerMode: ColorPickerMode;
      setColorPickerMode: React.Dispatch<React.SetStateAction<ColorPickerMode>>;
    }
  | undefined
>(undefined);

export function ColorPanelProvider({ children }: Props) {
  const [colorPickerMode, setColorPickerMode] =
    useState<ColorPickerMode>("palette");

  return (
    <ColorPanelContext.Provider
      value={{
        colorPickerMode,
        setColorPickerMode,
      }}
    >
      {children}
    </ColorPanelContext.Provider>
  );
}

export const useColorPanel = () => {
  const context = useContext(ColorPanelContext);
  if (context === undefined) {
    throw new Error("useColorPanel must be used within a ColorPanelProvider");
  }
  return context;
};
