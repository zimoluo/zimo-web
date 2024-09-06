import CrossIcon from "@/components/assets/CrossIcon";
import { useState, useRef, useEffect } from "react";

interface WindowData {
  content: React.ReactNode;
  defaultHeight: number;
  defaultWidth: number;
  minHeight?: number;
  minWidth?: number;
  maxHeight?: number;
  maxWidth?: number;
  widthAdjustible?: boolean;
  heightAdjustible?: boolean;
  canBeClosed?: boolean;
  canBeMoved?: boolean;
  layer?: number;
  uniqueKey?: string;
}

interface WindowState {
  width: number;
  height: number;
  data: WindowData;
  x: number;
  y: number;
}

interface Props {
  initialState: WindowState;
  onClose?: () => void;
}

export default function WindowInstance({ initialState, onClose }: Props) {
  const [state, setState] = useState<WindowState>(initialState);
  const windowRef = useRef<HTMLDivElement>(null);

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
        state.data.widthAdjustible
      ) {
        const newWidth = `${startWidth + e.clientX - startX}px`;
        setState((prev) => ({ ...prev, width: newWidth }));
      }
      if (
        (direction === "height" || direction === "both") &&
        state.data.heightAdjustible
      ) {
        const newHeight = `${startHeight + e.clientY - startY}px`;
        setState((prev) => ({ ...prev, height: newHeight }));
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
      const newX = `${startLeft + e.clientX - startX}px`;
      const newY = `${startTop + e.clientY - startY}px`;
      setState((prev) => ({ ...prev, x: newX, y: newY }));
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
      windowRef.current.style.width = state.width;
      windowRef.current.style.height = state.height;
      windowRef.current.style.left = state.x;
      windowRef.current.style.top = state.y;
    }
  }, [state]);

  return (
    <div
      ref={windowRef}
      className="absolute bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
      style={{
        zIndex: state.data.layer || "auto",
        minWidth: state.data.minWidth,
        minHeight: state.data.minHeight,
        maxWidth: state.data.maxWidth,
        maxHeight: state.data.maxHeight,
      }}
    >
      <div
        className="flex justify-between items-center p-2 bg-gray-100 cursor-move"
        onMouseDown={state.data.canBeMoved ? handleMove : undefined}
      >
        <div className="text-sm font-semibold">Window Title</div>
        <div className="flex items-center space-x-2">
          {state.data.canBeClosed && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <CrossIcon className="w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="p-4">{state.data.content}</div>
      {(state.data.widthAdjustible || state.data.heightAdjustible) && (
        <>
          {state.data.widthAdjustible && (
            <div
              className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-transparent hover:bg-gray-300"
              onMouseDown={(e) => handleResize(e, "width")}
            />
          )}
          {state.data.heightAdjustible && (
            <div
              className="absolute bottom-0 left-0 w-full h-1 cursor-ns-resize bg-transparent hover:bg-gray-300"
              onMouseDown={(e) => handleResize(e, "height")}
            />
          )}
          {state.data.widthAdjustible && state.data.heightAdjustible && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-200 hover:bg-gray-300"
              onMouseDown={(e) => handleResize(e, "both")}
            />
          )}
        </>
      )}
    </div>
  );
}
