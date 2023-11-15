interface ReplyProps {
  from: string;
  to?: string;
  content: string;
  date: string;
}

interface ReplyBoxProps {
  from: string;
  to?: string;
}

interface CommentEntry {
  author: string;
  date: string;
  content: string;
  replies?: ReplyProps[];
  likedBy: string[];
}
