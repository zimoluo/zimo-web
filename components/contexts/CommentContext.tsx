"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  location?: string | null;
  initialComments?: CommentEntry[] | null;
  likeIconType?: LikeIconType;
}

const CommentContext = createContext<
  | {
      comments: CommentEntry[] | null;
      setComments: React.Dispatch<React.SetStateAction<CommentEntry[] | null>>;
      resourceLocation: string | null;
      likeIconType: LikeIconType;
    }
  | undefined
>(undefined);

export function CommentProvider({
  children,
  location = null,
  initialComments = null,
  likeIconType = "generic",
}: Props) {
  const [comments, setComments] = useState<CommentEntry[] | null>(
    initialComments
  );

  return (
    <CommentContext.Provider
      value={{
        comments,
        setComments,
        resourceLocation: location,
        likeIconType,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}

export const useComments = () => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentProvider");
  }
  return context;
};
