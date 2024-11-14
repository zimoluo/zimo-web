"use client";

import { useWindow } from "@/components/contexts/WindowContext";
import { ReactNode, useRef, useState } from "react";

interface Props {
  children?: ReactNode;
  additionalWindowData?: Partial<WindowData>;
  initialClassName?: string;
  defaultDimension?: boolean;
  customWindowWrapperStyles?: Record<string, string>;
}

const toCamelCase = (property: string) =>
  property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

export default function WindowTransformer({
  children,
  additionalWindowData = {},
  initialClassName = "",
  defaultDimension = false,
  customWindowWrapperStyles = {},
}: Props) {
  const { appendWindow } = useWindow();
  const [hasTransformed, setHasTransformed] = useState(false);
  const childRef = useRef<HTMLDivElement | null>(null);

  const triggerTransform = () => {
    if (!childRef.current) {
      return;
    }

    const rect = childRef.current.getBoundingClientRect();
    const computedStyles = window.getComputedStyle(childRef.current);

    const stylesToApply = Array.from(computedStyles).reduce(
      (styleObj, property) => {
        const camelCasedProperty = toCamelCase(property);
        styleObj[camelCasedProperty] =
          computedStyles.getPropertyValue(property);
        return styleObj;
      },
      {} as Record<string, string>
    );

    appendWindow({
      content: (
        <div
          className="w-min h-min"
          style={{
            ...stylesToApply,
            ...customWindowWrapperStyles,
          }}
        >
          {children}
        </div>
      ),
      defaultHeight: rect.height,
      defaultWidth: rect.width,
      defaultCenterX: rect.left + rect.width / 2,
      defaultCenterY: rect.top + rect.height / 2,
      disableHeightAdjustment: true,
      disableWidthAdjustment: true,
      reducedStartingAnimation: true,
      disableBlur: true,
      ...additionalWindowData,
    });

    setHasTransformed(true);
  };

  return (
    <div
      ref={childRef}
      className={`${
        defaultDimension ? "w-min h-min" : ""
      } transition-opacity delay-300 duration-300 ease-out ${
        hasTransformed
          ? "opacity-0 pointer-events-none select-none touch-none"
          : initialClassName
      }`}
      aria-hidden={hasTransformed}
      onClick={triggerTransform}
    >
      {children}
    </div>
  );
}
