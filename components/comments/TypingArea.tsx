"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import SendCommentIcon from "../assets/comment/SendCommentIcon";
import useSiteLogin from "@/lib/siteLoginHook";
import LoginIcon from "../assets/user/LoginIcon";

interface Props {
  isExpanded?: boolean;
  setInputValue: (value: React.SetStateAction<string>) => void;
  sendComment: () => void;
  isSmall?: boolean;
  placeholderText: string;
  isSending: boolean;
  inputValue: string;
}

export default function TypingArea({
  isExpanded = true,
  isSmall = false,
  sendComment,
  placeholderText,
  isSending,
  inputValue,
  setInputValue,
}: Props) {
  const { user } = useUser();
  const { login } = useSiteLogin();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      sendComment();
    }
  };

  const columnRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>(
    isExpanded ? "31.25rem" : "0rem"
  );
  const columnStyle = {
    maxHeight: isExpanded ? maxHeight : "0rem",
    transition: "max-height 0.3s ease-in-out",
  };

  useEffect(() => {
    if (columnRef.current) {
      const height = columnRef.current.scrollHeight;
      setMaxHeight(`${height / 16}rem`);
    }
  }, []);

  return (
    <div
      style={columnStyle}
      ref={columnRef}
      className={`${isSmall ? "px-4" : "px-1.5"} relative overflow-hidden`}
    >
      <textarea
        className={`w-full px-3 py-2 ${
          isSmall ? "h-24 text-sm" : "h-32 text-base"
        } my-1.5 rounded-xl shadow-sm border-0.4 border-primary border-opacity-20 bg-transparent bg-widget-70 resize-none ${
          isSending ? "cursor-wait" : ""
        } placeholder:text-saturated placeholder:text-opacity-70 ${
          isSmall ? "mb-2 mt-4" : "my-2"
        }`}
        value={inputValue}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          setInputValue(event.target.value);
        }}
        placeholder={placeholderText}
        disabled={!user || user.state === "banned" || isSending}
        onKeyDown={handleKeyDown}
      />
      {!user && (
        <button onClick={login} className="z-10" disabled={!!user}>
          <LoginIcon
            className={`${
              isSmall ? "h-4 right-6" : "h-5 right-3.5"
            } absolute w-auto aspect-square bottom-5 opacity-80 cursor-pointer transition-transform duration-300 hover:scale-110`}
          />
        </button>
      )}
      {user && user.state !== "banned" && (
        <button onClick={sendComment} className="z-10" disabled={isSending}>
          <SendCommentIcon
            className={`${
              isSmall ? "h-4 right-6" : "h-5 right-3.5"
            } absolute w-auto aspect-square bottom-5 opacity-80 cursor-pointer transition-transform duration-300 hover:scale-110 ${
              isSending ? "cursor-wait" : ""
            }`}
          />
        </button>
      )}
    </div>
  );
}
