"use client";
import { useState, useEffect } from "react";
import { useToast } from "../contexts/ToastContext";
import toastStyle from "./toast.module.css";

export default function ToastDisplay() {
  const { toast, removeFirstToast } = useToast();
  const [currentToast, setCurrentToast] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toast.length > 0 && currentToast === null) {
      setCurrentToast(toast[0]);
      setIsVisible(true);
    } else if (toast.length === 0) {
      setIsVisible(false);
    }
  }, [toast, currentToast]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isVisible && currentToast) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 2400);
    } else if (!isVisible && currentToast) {
      timer = setTimeout(() => {
        removeFirstToast();
        setCurrentToast(null);
      }, 300);
    }

    return () => clearTimeout(timer);
  }, [isVisible, currentToast, removeFirstToast]);

  useEffect(() => {
    if (currentToast === null && toast.length > 0) {
      const timer = setTimeout(() => {
        setCurrentToast(toast[0]);
        setIsVisible(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentToast, toast]);

  return (
    <div
      className={`fixed flex justify-center items-end w-screen ${toastStyle.position}`}
    >
      <p
        className={`${
          toastStyle.length
        } z-60 text-neutral-50 text-opacity-90 bg-neutral-800 bg-opacity-70 px-3.5 py-1 rounded-3xl overflow-hidden transition-opacity ease-out duration-300 pointer-events-none select-none ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {currentToast}
      </p>
    </div>
  );
}
