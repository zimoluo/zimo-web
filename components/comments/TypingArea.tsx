"use client";

import { useRef } from "react";
import { useUser } from "../contexts/UserContext";
import SendCommentIcon from "../assets/comment/SendCommentIcon";
import LoginIcon from "../assets/user/LoginIcon";
import { useMenuControl } from "../contexts/MenuControlContext";

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
  const { openSideMenu } = useMenuControl();

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
  const columnStyle = {
    height: isExpanded ? "180px" : "0px",
    transition: "height 0.3s ease-in-out",
  };

  return (
    <div
      style={columnStyle}
      ref={columnRef}
      className={`${isSmall ? "px-4" : "px-2"} relative overflow-hidden`}
    >
      <textarea
        className={`w-full px-3 pt-2 ${
          isSmall ? "text-sm pb-7 h-[150px]" : "text-base pb-8 h-[164px]"
        } rounded-2xl shadow-xs outline outline-1 outline-highlight-light/15 bg-light/65 bg-none resize-none ${
          isSending ? "cursor-wait" : ""
        } placeholder:text-saturated placeholder:text-opacity-70 ${
          isSmall ? "mb-2 mt-4" : "mt-2 mb-2"
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
        <button
          onClick={openSideMenu}
          className={`z-10 absolute ${
            isSmall ? "right-7 bottom-5" : "right-4 bottom-5"
          }`}
          disabled={!!user}
        >
          <LoginIcon
            className={`${
              isSmall ? "h-5" : "h-6"
            } w-auto aspect-square opacity-80 cursor-pointer transition-transform duration-300 hover:scale-110`}
          />
        </button>
      )}
      {user && user.state !== "banned" && (
        <div
          className={`absolute ${isSmall ? "right-[20px] bottom-[18px]" : "right-[12px] bottom-[12px]"} w-[36px] h-[25px] transition-[opacity,filter,transform] duration-200 ease-out ${inputValue.trim() ? "opacity-100 scale-100" : "opacity-0 scale-50 blur-[4px] pointer-events-none select-none"}`}
        >
          <button
            onClick={sendComment}
            className="z-10 w-full h-full flex items-center justify-center bg-saturated/80 rounded-full shadow-xs"
            disabled={isSending}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 400 437"
              className="h-[15px] w-auto"
            >
              <path
                className="stroke-light"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={66.667}
                d="M200.001 33.332v369.5m0-369.5L33.334 199.999M200.001 33.332l166.666 166.667"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
