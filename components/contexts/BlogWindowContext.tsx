"use client";

import { createContext, useContext, ReactNode, useRef } from "react";

interface Props {
  slug: string;
  setSlug: React.Dispatch<React.SetStateAction<string>>;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}

const BlogWindowContext = createContext<
  | {
      slug: string;
      setSlug: React.Dispatch<React.SetStateAction<string>>;
      isMenuOpen: boolean;
      setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
      contentRef: React.RefObject<HTMLDivElement>;
    }
  | undefined
>(undefined);

export function BlogWindowProvider({
  children,
  slug,
  setSlug,
  isMenuOpen,
  setIsMenuOpen,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <BlogWindowContext.Provider
      value={{
        slug,
        setSlug,
        isMenuOpen,
        setIsMenuOpen,
        contentRef,
      }}
    >
      {children}
    </BlogWindowContext.Provider>
  );
}

export const useBlogWindow = () => {
  const context = useContext(BlogWindowContext);
  if (context === undefined) {
    throw new Error("useBlogWindow must be used within a BlogWindowProdiver");
  }
  return context;
};
