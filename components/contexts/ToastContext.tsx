"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useSettings } from "./SettingsContext";

interface Props {
  children?: ReactNode;
}

interface ToastContextType {
  toast: string[];
  appendToast: (message: string) => void;
  clearToast: () => void;
  removeFirstToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: Props) {
  const [toast, setToast] = useState<string[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    if (settings.disableToast) {
      clearToast();
    }
  }, [settings.disableToast]);

  const appendToast = (message: string) => {
    const processedMessage = message.trim();

    if (!processedMessage) {
      return;
    }

    if (toast.length > 0 && toast[toast.length - 1] === processedMessage) {
      return;
    }

    if (!(toast.length < 3) || settings.disableToast) {
      return;
    }

    setToast([...toast, processedMessage]);
  };

  const clearToast = () => {
    setToast([]);
  };

  const removeFirstToast = () => {
    if (toast.length > 0) {
      setToast(toast.slice(1));
    }
  };

  return (
    <ToastContext.Provider
      value={{ toast, appendToast, clearToast, removeFirstToast }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
