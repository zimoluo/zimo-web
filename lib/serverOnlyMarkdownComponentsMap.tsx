import "server-only";
import BlogCardFetcher from "@/app/blog/BlogCardFetcher";
import ArticleCardFetcher from "@/components/widgets/ArticleCardFetcher";

const serverOnlyMarkdownComponentsMap: { [key: string]: React.FC<any> } = {
  ArticleCardFetcher,
  BlogCardFetcher,
};

export default serverOnlyMarkdownComponentsMap;
