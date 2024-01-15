"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useSettings } from "./SettingsContext";
import _ from "lodash";

interface Props {
  children?: ReactNode;
}

interface ToastContextType {
  toast: ToastEntry[];
  appendToast: (toast: ToastEntry) => void;
  clearToast: () => void;
  removeFirstToast: () => void;
  removeGivenToast: (index: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: Props) {
  const [toast, setToast] = useState<ToastEntry[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    if (settings.notificationStyle === "disabled") {
      clearToast();
    }
  }, [settings.notificationStyle]);

  const appendToast = (newToast: ToastEntry) => {
    const processedToast: ToastEntry = {
      icon: newToast.icon,
      title: newToast.title.trim(),
      description: (newToast.description || "").trim(),
      id: _.uniqueId("toast_"),
    };

    if (!processedToast.title) {
      return;
    }

    if (!(toast.length < 9) || settings.notificationStyle === "disabled") {
      return;
    }

    setToast([...toast, processedToast]);
  };

  const clearToast = () => {
    setToast([]);
  };

  const removeFirstToast = () => {
    if (toast.length > 0) {
      setToast(toast.slice(1));
    }
  };

  const removeGivenToast = (index: number) => {
    if (index >= 0 && index < toast.length) {
      setToast([...toast.slice(0, index), ...toast.slice(index + 1)]);
    }
  };

  return (
    <ToastContext.Provider
      value={{
        toast,
        appendToast,
        clearToast,
        removeFirstToast,
        removeGivenToast,
      }}
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
