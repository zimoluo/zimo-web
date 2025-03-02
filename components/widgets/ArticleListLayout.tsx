import { ReactNode } from "react";
import SearchBar from "./SearchBar";
import SearchCardColumn from "./SearchCardColumn";
import { FilterSearchProvider } from "../contexts/FilterSearchContext";
import articleListStyle from "./article-list.module.css";

interface Props {
  title: string;
  subtitle?: string;
  keywords: FilterSearchKeyword[];
  components: ReactNode[];
  searchBarPromptKeyword: string;
}

export default function ArticleListLayout({
  title,
  subtitle,
  keywords,
  components,
  searchBarPromptKeyword,
}: Props) {
  return (
    <div className="inset-0 w-full flex items-start justify-center">
      <section
        className={`my-20 mx-8 md:mx-36 w-full ${articleListStyle.length}`}
      >
        <h1
          className={`text-3xl font-bold ${
            subtitle ? "mb-2" : "mb-8"
          } text-center`}
        >
          {title}
        </h1>
        {subtitle && <h2 className="mb-8 text-center text-xl">{subtitle}</h2>}
        <FilterSearchProvider>
          <nav className="mb-4 flex items-center md:justify-end">
            <div className="w-full">
              <SearchBar promptKeyword={searchBarPromptKeyword} />
            </div>
          </nav>
          <SearchCardColumn components={components} keywords={keywords} />
        </FilterSearchProvider>
      </section>
    </div>
  );
}
