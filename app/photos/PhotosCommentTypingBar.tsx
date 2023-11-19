"use client";

import CommentTypingArea from "@/components/comments/CommentTypingArea";
import { Dispatch, ReactNode, SetStateAction } from "react";
import ExpandCollapseIcon from "@/components/images/comment/ExpandCollapseIcon";

type Props = {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
  inMiddle?: boolean;
  likeButton: ReactNode;
};

export default function PhotosCommentTypingBar({
  isExpanded,
  setIsExpanded,
  inMiddle = false,
  likeButton,
}: Props) {
  return (
    <div className="border-y-0.8 md:border-b-0 border-saturated border-opacity-80 px-5 bg-widget-50 backdrop-blur-md">
      <div className="flex items-center py-3">
        {likeButton}
        <div
          className="flex-grow select-none pointer-events-none"
          aria-hidden="true"
        />
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          <ExpandCollapseIcon
            className={`h-6 w-auto aspect-square transition-transform duration-300 hover:scale-110 ${
              Number(isExpanded) ^ Number(inMiddle) ? "rotate-0" : "-rotate-180"
            }`}
          />
        </button>
      </div>
      <CommentTypingArea isExpanded={isExpanded} />
    </div>
  );
}
