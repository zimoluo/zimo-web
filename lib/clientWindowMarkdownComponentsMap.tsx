import ArticleCardClientReader from "@/components/widgets/ArticleCardClientReader";
import BlogWindowCard from "@/components/window/blog/BlogWindowCard";
import BlogWindowCardFetcher from "@/components/window/blog/BlogWindowCardFetcher";

const clientWindowMarkdownComponentsMap: { [key: string]: React.FC<any> } = {
  ArticleCardFetcher: ArticleCardClientReader,
  BlogCardFetcher: BlogWindowCardFetcher,
  BlogCard: BlogWindowCard,
};

export default clientWindowMarkdownComponentsMap;
