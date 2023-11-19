import HeaderText from "@/components/mainPage/HeaderText";
import BlogEntries from "./BlogEntries";
import { FilterSearchProvider } from "@/components/contexts/FilterSearchContext";
import SearchBar from "@/components/widgets/SearchBar";
import cardStyle from "./blog-card.module.css";

export default function BlogPage() {
  return (
    <>
      <HeaderText
        title="State and Flow of Mind."
        subtitle="Welcome, my friend. I have been expecting you."
      />
      <FilterSearchProvider>
        <div className="mb-24 px-8 md:px-36">
          <nav className="mb-8 flex items-center md:justify-end">
            <div className={`w-full ${cardStyle["search-bar-length"]}`}>
              <SearchBar />
            </div>
          </nav>
          <BlogEntries />
        </div>
      </FilterSearchProvider>
    </>
  );
}

export const revalidate = 24;
