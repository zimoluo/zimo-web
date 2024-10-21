import { useToast } from "@/components/contexts/ToastContext";
import { useEffect, useRef, useState } from "react";
import signalStyle from "./signal-generator.module.css";
import { toastIconMap } from "@/components/widgets/ToastCard";
import SendCommentIcon from "@/components/assets/comment/SendCommentIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import { clampValue } from "@/lib/generalHelper";

const availableIcons: ToastIcon[] = [
  "generic",
  "settings",
  "window",
  "themeMaker",
  "photo",
  "management",
  "comment",
  "notebook",
  "blank",
];

export default function SignalGeneratorWindow(preset: Partial<ToastEntry>) {
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

  const itemHeight = 80;
  const gapHeight = 10;
  const totalItemHeight = itemHeight + gapHeight;

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
      handleScroll();
    }
  }, []);

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, clientHeight } = listRef.current;

      const centerPosition = clientHeight / 2;
      const maxDistance = 280;
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
          transform: `translateY(${translation * 15}rem) scale(${scale})`,
          opacity: opacity,
        };
      });

      setItemStyles(newStyles);

      const newIndex = Math.abs(
        Math.round((scrollTop - gapHeight / 2) / (itemHeight + gapHeight))
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

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (listRef.current) {
      const { clientHeight, scrollTop } = listRef.current;
      const clickY = e.clientY - listRef.current.getBoundingClientRect().top;

      const thirdHeight = clientHeight / 3;

      if (clickY < thirdHeight) {
        listRef.current.scrollTo({
          top: scrollTop - totalItemHeight,
          behavior: "smooth",
        });
      } else if (clickY > 2 * thirdHeight) {
        listRef.current.scrollTo({
          top: scrollTop + totalItemHeight,
          behavior: "smooth",
        });
      }
    }
  };

  const bezierCurve = (x: number) => 1 - 3 * x ** 2 + 2 * x ** 3;

  const calculateTransform = (distance: number, maxDistance: number) => {
    const normalizedDistance = distance / maxDistance;
    const clampedAbsDistance = clampValue(0, Math.abs(normalizedDistance), 1);

    const scale = bezierCurve(clampedAbsDistance);
    const opacity = bezierCurve(clampedAbsDistance);
    const translation =
      Math.abs(normalizedDistance) > 1 ? 0 : normalizedDistance ** 3;

    return { scale, opacity, translation };
  };

  if (settings.notificationStyle === "disabled") {
    return (
      <div className="w-full h-full bg-widget-80 flex items-center justify-center px-8 py-4">
        <p className="font-bold text-2xl">
          Enable notifications in the settings to use this widget!
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-widget-80 ${signalStyle.grid}`}>
      <div className="grid px-6 py-0 rounded-lg bg-pastel bg-opacity-75 h-full overflow-hidden items-center">
        <div
          className={`${signalStyle.selector}`}
          ref={listRef}
          onScroll={handleScroll}
          onClick={handleClick}
        >
          <div className={`${signalStyle.filler}`} />
          {availableIcons.map((icon, index) => {
            const Icon = toastIconMap[icon];
            return (
              <div key={index} className="w-20 h-20 aspect-square">
                <div
                  className="w-full h-full aspect-square"
                  style={itemStyles?.[index] ?? {}}
                >
                  <Icon className="w-full h-full aspect-square" />
                </div>
              </div>
            );
          })}
          <div className={`${signalStyle.filler}`} />
        </div>
      </div>
      <div className={`w-full h-full ${signalStyle.textboxGrid}`}>
        <input
          className="bg-pastel bg-opacity-75 w-full h-12 bg-none py-1.5 px-4 font-bold text-xl rounded-lg placeholder:text-saturated placeholder:text-opacity-75"
          placeholder="Title"
          value={toastEntry.title}
          onChange={(e) =>
            setToastEntry((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <textarea
          className="bg-pastel bg-opacity-75 resize-none bg-none px-4 py-3 text-lg rounded-lg w-full h-full placeholder:text-saturated placeholder:text-opacity-75"
          placeholder="Content..."
          value={toastEntry.description}
          onChange={(e) =>
            setToastEntry((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>
      <button
        className="bg-pastel bg-opacity-75 w-24 h-full rounded-lg flex items-center justify-center"
        onClick={() => appendToast(toastEntry)}
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
