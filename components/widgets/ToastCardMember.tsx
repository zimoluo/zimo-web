import { useState, useEffect, ReactNode, useRef } from "react";
import ToastCardContainer from "./ToastCardContainer";

interface Props {
  children: ReactNode;
  dismissDirection?: "up" | "down" | "left" | "right";
  isActive: boolean;
  deactivateToast: () => void;
}

export default function ToastCardMember({
  children,
  dismissDirection = "left",
  isActive,
  deactivateToast,
}: Props) {
  const [maxHeight, setMaxHeight] = useState("0px");
  const memberRef = useRef<HTMLDivElement>(null);
  const [toastMounted, setToastMounted] = useState(false);

  useEffect(() => {
    if (!memberRef.current) {
      return;
    }

    if (!isActive) {
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
  }, [isActive]);

  const unmountThisEntry = () => {
    if (!memberRef.current) {
      return;
    }

    setToastMounted(false);
    setMaxHeight("0px");

    const handleTransitionEnd = () => {
      if (!memberRef.current) {
        return;
      }

      deactivateToast();

      memberRef.current.removeEventListener(
        "transitionend",
        handleTransitionEnd
      );
    };

    memberRef.current.addEventListener("transitionend", () => {
      handleTransitionEnd();
    });
  };

  return (
    <div
      style={{
        maxHeight: maxHeight,
        transition: "max-height 0.15s ease-out",
      }}
      className="overflow-hidden"
      ref={memberRef}
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
