import { useState, useRef, useEffect } from "react";

interface Props {
  data: WindowData;
}

const parseWindowDimension = (dimension: WindowDimension): string => {
  if (typeof dimension === "number") {
    return `${dimension}px`;
  }

  if (dimension === "fit") {
    return "fit-content";
  }

  if (dimension === "screen") {
    return "80%";
  }

  return "auto";
};

const parseWindowPosition = (position: WindowPosition): string => {
  if (typeof position === "number") {
    return `${position}px`;
  }

  if (position === "center") {
    return "50%";
  }

  return "0px";
};

export default function WindowInstance({ data }: Props) {
  const [windowState, setWindowState] = useState<WindowState>({
    x: 20,
    y: 20,
    height: data.defaultHeight,
    width: data.defaultWidth,
    data,
  });
  const windowRef = useRef<HTMLDivElement>(null);

  const canBeMoved =
    data.canBeMoved &&
    typeof windowState.x === "number" &&
    typeof windowState.y === "number";

  const handleResize = (
    e: React.MouseEvent,
    direction: "width" | "height" | "both"
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = windowRef.current?.offsetWidth || 0;
    const startHeight = windowRef.current?.offsetHeight || 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (
        (direction === "width" || direction === "both") &&
        windowState.data.widthAdjustible
      ) {
        const newWidth = startWidth + e.clientX - startX;
        setWindowState((prev) => ({ ...prev, width: newWidth }));
      }
      if (
        (direction === "height" || direction === "both") &&
        windowState.data.heightAdjustible
      ) {
        const newHeight = startHeight + e.clientY - startY;
        setWindowState((prev) => ({ ...prev, height: newHeight }));
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMove = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = windowRef.current?.offsetLeft || 0;
    const startTop = windowRef.current?.offsetTop || 0;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = startLeft + e.clientX - startX;
      const newY = startTop + e.clientY - startY;
      setWindowState((prev) => ({ ...prev, x: newX, y: newY }));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.style.width = parseWindowDimension(windowState.width);
      windowRef.current.style.height = parseWindowDimension(windowState.height);
      windowRef.current.style.left = parseWindowPosition(windowState.x);
      windowRef.current.style.top = parseWindowPosition(windowState.y);
    }
  }, [windowState]);

  return (
    <div
      ref={windowRef}
      className="rounded-xl shadow-lg overflow-hidden fixed"
      style={{
        zIndex: (data.layer || 0) + 11,
      }}
      onMouseDown={handleMove}
    >
      <div>{data.content}</div>
    </div>
  );
}
