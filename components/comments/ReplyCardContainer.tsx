"use client";

import { useRef, useEffect, useState } from "react";
import { useComments } from "../contexts/CommentContext";
import { useReply } from "../contexts/ReplyContext";
import ReplyCard from "./ReplyCard";

interface Props {
  commentIndex: number;
}

export default function ReplyCardContainer({ commentIndex }: Props) {
  const { comments } = useComments();
  const { isReplyContainerExpanded } = useReply();

  const columnRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  useEffect(() => {
    if (columnRef.current) {
      const height = columnRef.current.scrollHeight;
      setMaxHeight(`${height}px`);
    }
  }, [comments![commentIndex].replies]);

  const columnStyle = {
    overflow: "hidden",
    maxHeight: isReplyContainerExpanded ? maxHeight : "0px",
    transition: "max-height 0.3s ease-in-out",
  };

  return (
    <div style={columnStyle} ref={columnRef} className="pl-6">
      {comments![commentIndex].replies!.map((reply, index) => (
        <ReplyCard key={index} index={index} commentIndex={commentIndex} />
      ))}
    </div>
  );
}
