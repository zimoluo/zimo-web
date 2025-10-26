"use client";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "../contexts/ToastContext";
import toastStyle from "./toast.module.css";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import { generateShadeMap } from "@/lib/themeMaker/colorHelper";
import colorConvert from "color-convert";
import { useTheme } from "../contexts/ThemeContext";

const { rgb } = colorConvert;

export default function ToastDisplayLegacy() {
  const { toast, removeFirstToast } = useToast();
  const [currentToast, setCurrentToast] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { themeConfig } = useTheme();

  const [textColor, bgColor] = useMemo(() => {
    const shadeMap = generateShadeMap(
      `#${rgb.hex(themeConfig.palette.primary).toLowerCase()}`,
      24
    ).shadeMap;

    return [shadeMap[0], shadeMap[21]];
  }, [themeConfig.palette.primary]);

  useEffect(() => {
    if (toast.length > 0 && currentToast === null) {
      setCurrentToast(toast[0].description || toast[0].title);
      setIsVisible(true);
      removeFirstToast();
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
        setCurrentToast(null);
      }, 300);
    }

    return () => clearTimeout(timer);
  }, [isVisible, currentToast, removeFirstToast]);

  useEffect(() => {
    if (currentToast === null && toast.length > 0) {
      const timer = setTimeout(() => {
        setCurrentToast(toast[0].description || toast[0].title);
        setIsVisible(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentToast, toast]);

  return (
    <div
      className={`fixed flex justify-center items-end w-screen z-80 ${toastStyle.legacyPosition} pointer-events-none select-none`}
    >
      <p
        style={{ color: `${textColor}e6`, backgroundColor: `${bgColor}b3` }}
        className={`${
          toastStyle.legacyLength
        } px-4 py-1.5 rounded-3xl overflow-hidden transition-[opacity,filter,transform] ease-out duration-300 ${
          isVisible
            ? "opacity-100 blur-0 scale-100"
            : "opacity-0 blur-sm scale-110"
        }`}
      >
        {enrichTextContent(currentToast || "")}
      </p>
    </div>
  );
}
