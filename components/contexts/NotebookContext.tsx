"use client";

import {
  createContext,
  useContext,
  ReactNode,
  SetStateAction,
  useState,
  Dispatch,
} from "react";
import { useSettings } from "./SettingsContext";
import { useToast } from "./ToastContext";

type Props = {
  children?: ReactNode;
};

const NotebookContext = createContext<
  | {
      isMenuOpen: boolean;
      setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
      shouldScrollToTop: boolean;
      setShouldScrollToTop: Dispatch<SetStateAction<boolean>>;
      addNewNotebook: () => void;
    }
  | undefined
>(undefined);

export const maximumNotebooks = 20;

export function NotebookProvider({ children }: Props) {
  const { settings, updateSettings } = useSettings();
  const { appendToast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  const { notebookData } = settings;

  const addNewNotebook = () => {
    if (notebookData.length >= 20) {
      appendToast({
        title: "Notebook",
        icon: "notebook",
        description: `Up to ${maximumNotebooks} notebook${
          maximumNotebooks > 1 ? "s" : ""
        } may exist.`,
      });
      return;
    }

    const newNotebookData = structuredClone(notebookData);
    newNotebookData.push({
      date: new Date().toISOString(),
      lastEditedDate: new Date().toISOString(),
      content: "",
      contentStyles: [],
    });
    updateSettings({
      ...settings,
      notebookData: newNotebookData,
      notebookIndex: newNotebookData.length - 1,
    });
    setIsMenuOpen(true);
    setShouldScrollToTop(true);
  };

  return (
    <NotebookContext.Provider
      value={{
        isMenuOpen,
        setIsMenuOpen,
        shouldScrollToTop,
        setShouldScrollToTop,
        addNewNotebook,
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
