import ArticleCardClientReader from "@/components/widgets/ArticleCardClientReader";
import BlogWindowCardFetcher from "@/components/window/blog/BlogWindowCardFetcher";

const clientWindowMarkdownComponentsMap: { [key: string]: React.FC<any> } = {
  ArticleCardFetcher: ArticleCardClientReader,
  BlogCardFetcher: BlogWindowCardFetcher,
};

export default clientWindowMarkdownComponentsMap;
