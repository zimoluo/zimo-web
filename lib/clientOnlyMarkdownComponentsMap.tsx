import BlogCardClientReader from "@/app/blog/BlogCardClientReader";
import ArticleCardClientReader from "@/components/widgets/ArticleCardClientReader";

const clientOnlyMarkdownComponentsMap: { [key: string]: React.FC<any> } = {
  ArticleCardFetcher: ArticleCardClientReader,
  BlogCardFetcher: BlogCardClientReader,
};

export default clientOnlyMarkdownComponentsMap;
