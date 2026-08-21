"use client";

import type { AccentColors } from "@/src/features/theme/model/v10-types";
import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AccentColorContext = createContext<
  | {
      selectedAccent: AccentColors;
      setSelectedAccent: React.Dispatch<React.SetStateAction<AccentColors>>;
    }
  | undefined
>(undefined);

export function AccentColorProvider({ children }: Props) {
  const [selectedAccent, setSelectedAccent] = useState<AccentColors>("primary");

  return (
    <AccentColorContext.Provider
      value={{
        selectedAccent,
        setSelectedAccent,
      }}
    >
      {children}
    </AccentColorContext.Provider>
  );
}

export const useAccentColor = () => {
  const context = useContext(AccentColorContext);
  if (context === undefined) {
    throw new Error("useAccentColor must be used within a AccentColorProvider");
  }
  return context;
};
