export interface PostData {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: string;
  authorId: string;
  description: string;
  content: string;
  tags?: string[];
  lastEditedDate?: string;
}

export type PostEntry = PostData & {
  displayCover: boolean;
  compatibleCover?: string;
};
