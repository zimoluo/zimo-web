"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const ReplyContext = createContext<
  | {
      replyBoxContent: ReplyBoxProps | null;
      setReplyBoxContent: React.Dispatch<
        React.SetStateAction<ReplyBoxProps | null>
      >;
      isTypingBoxExpanded: boolean;
      setIsTypingBoxExpanded: React.Dispatch<React.SetStateAction<boolean>>;
      isReplyContainerExpanded: boolean;
      setIsReplyContainerExpanded: React.Dispatch<
        React.SetStateAction<boolean>
      >;
    }
  | undefined
>(undefined);

export function ReplyProvider({ children }: Props) {
  const [replyBoxContent, setReplyBoxContent] = useState<ReplyBoxProps | null>(
    null
  );

  const [isTypingBoxExpanded, setIsTypingBoxExpanded] = useState(false);
  const [isReplyContainerExpanded, setIsReplyContainerExpanded] =
    useState(false);

  return (
    <ReplyContext.Provider
      value={{
        replyBoxContent,
        setReplyBoxContent,
        isTypingBoxExpanded,
        setIsTypingBoxExpanded,
        isReplyContainerExpanded,
        setIsReplyContainerExpanded,
      }}
    >
      {children}
    </ReplyContext.Provider>
  );
}

export const useReply = () => {
  const context = useContext(ReplyContext);
  if (context === undefined) {
    throw new Error("useReply must be used within a ReplyProvider");
  }
  return context;
};
