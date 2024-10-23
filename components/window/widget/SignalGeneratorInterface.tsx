"use client";

import { useToast } from "@/components/contexts/ToastContext";
import { useEffect, useMemo, useRef, useState } from "react";
import signalStyle from "./signal-generator.module.css";
import { toastIconMap } from "@/components/widgets/ToastCard";
import SendCommentIcon from "@/components/assets/comment/SendCommentIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import { clampValue } from "@/lib/generalHelper";
import { useWindow } from "@/components/contexts/WindowContext";
import { useWindowAction } from "@/components/contexts/WindowActionContext";
import { useTheme } from "@/components/contexts/ThemeContext";
import { generateShadeMap } from "@/lib/themeMaker/colorHelper";
import { rgb } from "color-convert";

const availableIcons: ToastIcon[] = [
  "generic",
  "settings",
  "window",
  "navigator",
  "signal",
  "themeMaker",
  "faviconOutline",
  "photo",
  "management",
  "calculator",
  "comment",
  "link",
  "pin",
  "search",
  "trashCan",
  "notebook",
  "blank",
];

export default function SignalGeneratorInterface(preset: Partial<ToastEntry>) {
  const { appendToast } = useToast();
  const listRef = useRef<HTMLDivElement>(null);
  const [toastEntry, setToastEntry] = useState<ToastEntry>({
    title: "",
    icon: "generic",
    description: "",
    ...preset,
  });
  const [itemStyles, setItemStyles] = useState<
    { opacity: number; transform: string }[]
  >(
    availableIcons.map(() => ({
      opacity: 0,
      transform: "scale(0)",
    }))
  );

  const { settings } = useSettings();
  const { modifyWindowSaveProps } = useWindowAction();
  const { saveWindows } = useWindow();
  const { themeConfig } = useTheme();

  const itemHeight = 80;
  const gapHeight = 10;
  const totalItemHeight = itemHeight + gapHeight;

  const [textColor, bgColor]: HexColor[] = useMemo(() => {
    if (settings.notificationStyle !== "toast") {
      return ["#", "#"];
    }

    const shadeMap = generateShadeMap(
      `#${rgb.hex(themeConfig.palette.primary).toLowerCase()}`,
      24
    ).shadeMap;

    return [shadeMap[0], shadeMap[21]];
  }, [themeConfig.palette.primary, settings.notificationStyle]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop =
        totalItemHeight *
        Math.max(availableIcons.indexOf(toastEntry.icon ?? "generic"), 0);

      handleScroll();
    }
  }, [settings.notificationStyle]);

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, clientHeight } = listRef.current;

      const centerPosition = clientHeight / 2;
      const maxDistance = 360;
      const fillerHeight = clientHeight / 2 - itemHeight / 2;

      const newStyles = availableIcons.map((_, index) => {
        const itemPosition =
          index * totalItemHeight + itemHeight / 2 + fillerHeight - scrollTop;
        const distance = centerPosition - itemPosition;

        const { scale, opacity, translation } = calculateTransform(
          distance,
          maxDistance
        );

        return {
          transform: `translateY(${translation * 24}rem) scale(${scale})`,
          opacity: opacity,
        };
      });

      setItemStyles(newStyles);

      const newIndex = Math.abs(
        Math.round(scrollTop / (itemHeight + gapHeight))
      );

      setToastEntry((prev) => {
        if (!availableIcons[newIndex]) return prev;
        if (availableIcons[newIndex] === prev.icon) return prev;

        return {
          ...prev,
          icon: availableIcons[newIndex],
        };
      });
    }
  };

  const handleClick = (index: number) => {
    if (!listRef.current) {
      return;
    }

    listRef.current.scrollTo({
      top: index * totalItemHeight,
      behavior: "smooth",
    });
  };

  const bezierCurve = (x: number) => 1 - 3 * x ** 2 + 2 * x ** 3;

  const calculateTransform = (distance: number, maxDistance: number) => {
    const normalizedDistance = distance / maxDistance;
    const clampedAbsDistance = clampValue(0, Math.abs(normalizedDistance), 1);

    const scale = bezierCurve(clampedAbsDistance);
    const opacity = bezierCurve(clampedAbsDistance) ** 1.5;
    const translation =
      Math.abs(normalizedDistance) > 1 ? 0 : normalizedDistance ** 3;

    return { scale, opacity, translation };
  };

  if (settings.notificationStyle === "disabled") {
    return (
      <div className="w-full h-full flex items-center justify-center px-8 py-4">
        <p className="font-bold text-2xl">
          Enable notifications in the settings to use this widget!
        </p>
      </div>
    );
  }

  if (settings.notificationStyle === "toast") {
    return (
      <div className="w-full h-full flex items-center justify-center gap-3 px-6 py-3">
        <span className={`relative h-9 ${signalStyle.toastInput} shrink-0`}>
          <span className="opacity-0 select-none pointer-events-none touch-none relative invisible px-4">
            {toastEntry.description}
          </span>
          <input
            style={{ color: `${textColor}e6`, backgroundColor: `${bgColor}b3` }}
            className="placeholder:opacity-50 placeholder-current absolute left-0 top-0 w-full h-full px-4 py-1.5 rounded-3xl overflow-hidden inline-block flex-grow"
            value={toastEntry.description}
            placeholder="Content..."
            onChange={(e) =>
              setToastEntry((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </span>
        <button
          style={{ backgroundColor: `${bgColor}b3` }}
          className="w-9 h-9 aspect-square p-2 rounded-full shrink-0"
          disabled={!toastEntry.description}
          onClick={() => {
            appendToast({ ...toastEntry, title: "Zimo Web", icon: "generic" });
            modifyWindowSaveProps(structuredClone(toastEntry));
            saveWindows();
          }}
        >
          <SendCommentIcon
            className={`w-full h-full aspect-square transition-opacity duration-300 ease-out translate-x-[0.08rem] ${
              toastEntry.description ? "opacity-100" : "opacity-50"
            }`}
            color={`${textColor}e6`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${signalStyle.grid}`}>
      <div className="grid px-6 py-0 rounded-lg bg-light bg-opacity-80 h-full overflow-hidden items-center shadow-lg">
        <div
          className={`${signalStyle.selector}`}
          ref={listRef}
          onScroll={handleScroll}
        >
          <div className={`${signalStyle.filler}`} />
          {availableIcons.map((icon, index) => {
            const Icon = toastIconMap[icon];
            return (
              <div key={index} className="w-20 h-20 aspect-square">
                <button
                  onClick={() => handleClick(index)}
                  disabled={
                    (itemStyles?.[index]?.opacity ?? 0) < 0.2 ||
                    !listRef.current ||
                    (itemStyles?.[index]?.opacity ?? 0) >= 1
                  }
                  className={`w-full h-full aspect-square drop-shadow-md ${
                    (itemStyles?.[index]?.opacity ?? 0) < 0.2
                      ? "pointer-events-none"
                      : ""
                  }`}
                  style={itemStyles?.[index] ?? {}}
                >
                  <Icon className="w-full h-full aspect-square" />
                </button>
              </div>
            );
          })}
          <div className={`${signalStyle.filler}`} />
        </div>
      </div>
      <div className={`w-full h-full ${signalStyle.textboxGrid}`}>
        <input
          className="bg-light bg-opacity-80 w-full h-12 bg-none py-1.5 px-4 font-bold text-xl rounded-lg placeholder:text-saturated placeholder:text-opacity-75 shadow-lg"
          placeholder="Title"
          value={toastEntry.title}
          onChange={(e) =>
            setToastEntry((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <textarea
          className="bg-light bg-opacity-80 resize-none bg-none px-4 py-3 text-lg rounded-lg w-full h-full placeholder:text-saturated placeholder:text-opacity-75 shadow-lg"
          placeholder="Content..."
          value={toastEntry.description}
          onChange={(e) =>
            setToastEntry((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>
      <button
        className="bg-light bg-opacity-80 w-24 h-full rounded-lg flex items-center justify-center shadow-lg"
        onClick={() => {
          appendToast(toastEntry);
          modifyWindowSaveProps(structuredClone(toastEntry));
          saveWindows();
        }}
        disabled={!toastEntry.title}
      >
        <SendCommentIcon
          className={`w-10 h-auto aspect-square transition-opacity duration-300 ease-out ${
            toastEntry.title ? "opacity-100" : "opacity-50"
          }`}
        />
      </button>
    </div>
  );
}
