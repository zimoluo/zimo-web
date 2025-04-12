import HeaderText from "@/components/mainPage/HeaderText";
import BlogEntries from "./BlogEntries";
import { FilterSearchProvider } from "@/components/contexts/FilterSearchContext";
import SearchBar from "@/components/widgets/SearchBar";
import cardStyle from "./blog-card.module.css";
import { Metadata } from "next";
import entriesStyle from "./blog-entries.module.css";

export const metadata: Metadata = {
  title: "Blog - Zimo Web",
  description: "The personal blog of Zimo.",
  alternates: {
    types: {
      "application/rss+xml": "/blog/feed.rss",
    },
  },
};

export default function BlogPage() {
  return (
    <>
      <HeaderText
        title="State and Flow of Mind."
        subtitle="Welcome, my friend. I have been expecting you."
      />
      <FilterSearchProvider>
        <div className="inset-0 w-full flex justify-center items-start">
          <div className={`mb-24 mx-8 md:mx-36 w-full ${entriesStyle.length}`}>
            <nav className="mb-8 flex items-center md:justify-end">
              <div className={`w-full ${cardStyle.searchBarLength}`}>
                <SearchBar />
              </div>
            </nav>
            <BlogEntries />
          </div>
        </div>
      </FilterSearchProvider>
    </>
  );
}

export const revalidate = 24;
