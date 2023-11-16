"use client";

import { useRef, useState } from "react";
import ConfirmDeleteIcon from "../images/comment/ConfirmDeleteIcon";
import DeleteCommentIcon from "../images/comment/DeleteCommentIcon";

interface Props {
  isShown: boolean;
  deleteComment: () => void;
  isReply?: boolean;
}

export default function DeleteCommentButton({
  isShown,
  deleteComment,
  isReply = false,
}: Props) {
  const [showMore, setShowMore] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const divRef = useRef<HTMLDivElement>(null);

  async function evaluateDelete() {
    if (isDeleting || !showMore) return;
    setIsDeleting(true);
    setShowMore(false);
    await deleteComment();
    setIsDeleting(false);
  }

  function evaluateGarbageCan() {
    if (isDeleting) return;
    setShowMore(!showMore);
  }

  const divStyle = {
    overflow: "hidden",
    width: showMore ? "3.08rem" : "1.5rem", // Replace minWidth with the actual min-width
    transition: "width 0.2s ease-in-out",
  };

  if (!isShown) return null;

  return (
    <div
      ref={divRef}
      style={divStyle}
      className={`relative mr-3 h-6 flex items-center rounded-md border-saturated border-0.8 ${
        showMore ? "border-opacity-60" : "border-opacity-0"
      } justify-end`}
    >
      <button onClick={evaluateDelete} className="absolute right-7">
        <ConfirmDeleteIcon className="h-4 w-auto aspect-square transition-transform duration-300 hover:scale-110" />
      </button>
      <div
        className={`h-4 w-0 border-saturated border-0.4 border-opacity-60 absolute right-6`}
      />
      <button
        onClick={evaluateGarbageCan}
        className={`absolute right-1 ${isDeleting ? "cursor-wait" : ""}`}
        disabled={isDeleting}
      >
        <DeleteCommentIcon className="h-4 w-auto aspect-square transition-transform duration-300 hover:scale-110" />
      </button>
    </div>
  );
}
