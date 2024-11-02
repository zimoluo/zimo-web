"use client";

import { createContext, useContext, ReactNode, useRef } from "react";

interface Props {
  slug: string;
  setSlug: React.Dispatch<React.SetStateAction<string>>;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}

const EntryWindowContext = createContext<
  | {
      slug: string;
      setSlug: React.Dispatch<React.SetStateAction<string>>;
      isMenuOpen: boolean;
      setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
      contentRef: React.RefObject<HTMLDivElement | null>;
    }
  | undefined
>(undefined);

export function EntryWindowProvider({
  children,
  slug,
  setSlug,
  isMenuOpen,
  setIsMenuOpen,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <EntryWindowContext.Provider
      value={{
        slug,
        setSlug,
        isMenuOpen,
        setIsMenuOpen,
        contentRef,
      }}
    >
      {children}
    </EntryWindowContext.Provider>
  );
}

export const useEntryWindow = () => {
  const context = useContext(EntryWindowContext);
  if (context === undefined) {
    throw new Error("useEntryWindow must be used within a EntryWindowProdiver");
  }
  return context;
};
