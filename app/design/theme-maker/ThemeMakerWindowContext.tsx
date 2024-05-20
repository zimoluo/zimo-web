"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ThemeMakerWindowContext = createContext<
  | {
      isFullscreen: boolean;
      setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export function ThemeMakerWindowProvider({ children }: Props) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  return (
    <ThemeMakerWindowContext.Provider
      value={{
        isFullscreen,
        setIsFullscreen,
      }}
    >
      {children}
    </ThemeMakerWindowContext.Provider>
  );
}

export const useThemeMakerWindow = () => {
  const context = useContext(ThemeMakerWindowContext);
  if (context === undefined) {
    throw new Error(
      "useThemeMakerWindow must be used within a ThemeMakerWindowProvider"
    );
  }
  return context;
};
