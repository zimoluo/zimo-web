"use client";

import {
  createContext,
  useContext,
  ReactNode,
  SetStateAction,
  useState,
  Dispatch,
} from "react";

type Props = {
  children?: ReactNode;
};

const NotebookContext = createContext<
  | {
      isMenuOpen: boolean;
      setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export function NotebookProvider({ children }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  return (
    <NotebookContext.Provider
      value={{
        isMenuOpen,
        setIsMenuOpen,
      }}
    >
      {children}
    </NotebookContext.Provider>
  );
}

export const useNotebook = () => {
  const context = useContext(NotebookContext);
  if (context === undefined) {
    throw new Error("useNotebook must be used within a NotebookProvider");
  }
  return context;
};
