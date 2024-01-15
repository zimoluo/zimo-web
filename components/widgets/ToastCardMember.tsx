import { useState, useEffect, ReactNode, useRef } from "react";
import ToastCardContainer from "./ToastCardContainer";

interface Props {
  children: ReactNode;
  dismissDirection?: "up" | "down" | "left" | "right";
  onDismiss: () => void;
}

export default function ToastCardMember({
  children,
  dismissDirection = "left",
  onDismiss,
}: Props) {
  const [maxHeight, setMaxHeight] = useState("0px");
  const memberRef = useRef<HTMLDivElement>(null);
  const [toastMounted, setToastMounted] = useState(false);

  useEffect(() => {
    if (!memberRef.current) {
      return;
    }

    const handleTransitionEnd = () => {
      if (!memberRef.current) {
        return;
      }

      setToastMounted(true);

      memberRef.current.removeEventListener(
        "transitionend",
        handleTransitionEnd
      );
    };

    setMaxHeight(`${memberRef.current.scrollHeight}px`);
    memberRef.current.addEventListener("transitionend", () => {
      handleTransitionEnd();
    });
  }, []);

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
      <div className="my-2">
        <ToastCardContainer
          dismissDirection={dismissDirection}
          mounted={toastMounted}
          onDismiss={unmountThisEntry}
        >
          {children}
        </ToastCardContainer>
      </div>
    </div>
  );
}
