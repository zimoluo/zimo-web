interface PostData {
  slug: string;
  title: string;
  date: string; // data published
  coverImage: string;
  author: string;
  authorId: string;
  description: string;
  content: string;
  tags?: string[];
  lastEditedDate?: string;
}

type PostEntry = PostData & {
  displayCover: boolean;
  compatibleCover?: string;
};
