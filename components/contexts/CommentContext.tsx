"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  location?: string | null;
  initialComments?: CommentEntry[] | null;
}

const CommentContext = createContext<
  | {
      comments: CommentEntry[] | null;
      setComments: React.Dispatch<React.SetStateAction<CommentEntry[] | null>>;
      resourceLocation: string | null;
      setResourceLocation: React.Dispatch<React.SetStateAction<string | null>>;
    }
  | undefined
>(undefined);

export function CommentProvider({
  children,
  location = null,
  initialComments = null,
}: Props) {
  const [comments, setComments] = useState<CommentEntry[] | null>(
    initialComments
  );
  const [resourceLocation, setResourceLocation] = useState<string | null>(
    location
  );

  return (
    <CommentContext.Provider
      value={{ comments, setComments, resourceLocation, setResourceLocation }}
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
