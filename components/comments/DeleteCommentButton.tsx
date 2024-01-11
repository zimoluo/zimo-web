"use client";

import { useState } from "react";
import ConfirmDeleteIcon from "../assets/comment/ConfirmDeleteIcon";
import DeleteCommentIcon from "../assets/comment/DeleteCommentIcon";

interface Props {
  isShown: boolean;
  deleteComment: () => Promise<void>;
}

export default function DeleteCommentButton({ isShown, deleteComment }: Props) {
  const [showMore, setShowMore] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    width: showMore ? "3.08rem" : "1.5rem",
    transition: "width 0.2s ease-in-out",
  };

  if (!isShown) return null;

  return (
    <div
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
