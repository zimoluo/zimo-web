"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface ColorPanelContextProps {
  sidebarConfig: EditorSelectorButtonMode[];
  randomFunction: () => void;
  palettePicker: ReactNode;
  shadePickerConfig: ShadePickerConfig;
}

const ColorPanelContext = createContext<
  | ({
      colorPickerMode: ColorPickerMode;
      setColorPickerMode: React.Dispatch<React.SetStateAction<ColorPickerMode>>;
    } & ColorPanelContextProps)
  | undefined
>(undefined);

export function ColorPanelProvider({
  children,
  sidebarConfig,
  randomFunction,
  palettePicker,
  shadePickerConfig,
}: ColorPanelContextProps & { children: ReactNode }) {
  const [colorPickerMode, setColorPickerMode] =
    useState<ColorPickerMode>("palette");

  return (
    <ColorPanelContext.Provider
      value={{
        colorPickerMode,
        setColorPickerMode,
        sidebarConfig,
        randomFunction,
        palettePicker,
        shadePickerConfig,
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
