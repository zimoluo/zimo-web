"use client";

import CommentTypingArea from "@/components/comments/CommentTypingArea";
import { ReactNode, useState } from "react";
import UpDownSwitchIcon from "@/components/assets/entries/UpDownSwitchIcon";
import CommentAreaWrapper from "@/components/comments/CommentAreaWrapper";

type Props = {
  inMiddle?: boolean;
  likeButton: ReactNode;
};

export default function PhotosCommentTypingBar({
  inMiddle = false,
  likeButton,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-3xl border border-highlight-pastel/15 bg-pastel/65 shadow backdrop-blur-sm overflow-hidden">
      <div className="flex items-center h-12 px-4">
        {likeButton}
        <div
          className="flex-grow select-none pointer-events-none"
          aria-hidden="true"
        />
        <CommentAreaWrapper>
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            <UpDownSwitchIcon
              className={`h-6 w-auto aspect-square transition-transform duration-300 hover:scale-110 ${
                Number(isExpanded) ^ Number(inMiddle)
                  ? "rotate-180"
                  : "rotate-0"
              }`}
            />
          </button>
        </CommentAreaWrapper>
      </div>
      <CommentAreaWrapper>
        <CommentTypingArea isExpanded={isExpanded} />
      </CommentAreaWrapper>
    </div>
  );
}
