import { useState, useEffect, ReactNode, useRef } from "react";
import ToastCardSwiper from "./ToastCardSwiper";

interface Props {
  children: ReactNode;
  dismissDirection?: Direction;
  onDismiss: () => void;
}

export default function ToastCardColumnMember({
  children,
  dismissDirection = "left",
  onDismiss,
}: Props) {
  const [maxHeight, setMaxHeight] = useState("0px");
  const memberRef = useRef<HTMLDivElement>(null);
  const [toastMounted, setToastMounted] = useState(false);

  useEffect(() => {
    const member = memberRef.current;
    if (!member) return;

    const handleTransitionEnd = () => {
      setToastMounted(true);
    };

    member.addEventListener("transitionend", handleTransitionEnd);
    setMaxHeight(`${member.scrollHeight / 16}rem`);

    return () => {
      member.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [memberRef.current]);

  const unmountThisEntry = () => {
    if (!memberRef.current) {
      return;
    }

    setToastMounted(false);

    if (maxHeight === "0px") {
      onDismiss();
      return;
    }

    setMaxHeight("0px");
  };

  return (
    <div
      style={{
        maxHeight: maxHeight,
        transition: "max-height 0.1s ease-in-out",
      }}
      className="overflow-hidden"
      ref={memberRef}
      onTransitionEnd={() => {
        if (maxHeight === "0px") {
          onDismiss();
        }
      }}
    >
      <div className="mt-6 md:my-2 ml-1 md:ml-4 mr-1 pointer-events-auto">
        <ToastCardSwiper
          dismissDirection={dismissDirection}
          mounted={toastMounted}
          onDismiss={unmountThisEntry}
        >
          {children}
        </ToastCardSwiper>
      </div>
    </div>
  );
}
