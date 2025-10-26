"use client";

import { useRef } from "react";
import { useUser } from "../contexts/UserContext";
import SendCommentIcon from "../assets/comment/SendCommentIcon";
import LoginIcon from "../assets/user/LoginIcon";
import {
  maxCommentCharacterCount,
  maxReplyCharacterCount,
} from "@/lib/constants/security";
import useSiteLogin from "@/lib/helperHooks";

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
          onClick={login}
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
          className={`flex absolute py-0.5 px-1.5 rounded-full border-0.8 border-saturated border-opacity-80 bg-light bg-opacity-80 ${
            isSmall ? "right-[21px] bottom-[19px]" : "right-3 bottom-3"
          }`}
        >
          <div
            className={`${
              isSmall ? "text-xs mr-2.5" : "text-sm mr-3.5"
            } font-tabular text-end opacity-80`}
          >{`${inputValue.trim().length} / ${
            isSmall ? maxReplyCharacterCount : maxCommentCharacterCount
          }`}</div>
          <button onClick={sendComment} className="z-10" disabled={isSending}>
            <SendCommentIcon
              className={`${
                isSmall ? "h-4" : "h-[18px]"
              } w-auto aspect-square opacity-80 cursor-pointer transition-transform duration-300 hover:scale-110 ${
                isSending ? "cursor-wait" : ""
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
