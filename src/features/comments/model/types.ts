export interface ReplyProps {
  from: string;
  to?: string;
  content: string;
  date: string;
}

export interface ReplyBoxProps {
  from: string;
  to?: string;
}

export interface CommentEntry {
  author: string;
  date: string;
  content: string;
  replies?: ReplyProps[];
  likedBy: string[];
}

export type LikeIconType = "generic" | "star" | "heart";
