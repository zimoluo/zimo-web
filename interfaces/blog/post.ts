interface PostData {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: string;
  authorId: string;
  description: string;
  content: string;
  tags?: string[];
}

type PostEntry = PostData & {
  displayCover: boolean;
  originalContent: string;
  compatibleCover?: string;
};
