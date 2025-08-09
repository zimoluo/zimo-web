import HeaderText from "@/components/mainPage/HeaderText";
import BlogEntries from "./BlogEntries";
import { FilterSearchProvider } from "@/components/contexts/FilterSearchContext";
import SearchBar from "@/components/widgets/SearchBar";
import cardStyle from "./blog-card.module.css";
import { Metadata } from "next";
import entriesStyle from "./blog-entries.module.css";
import Link from "next/link";
import RSSIcon from "@/components/assets/entries/RSSIcon";

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
              <div
                className={`w-full ${cardStyle.searchBarLength} flex gap-3.5`}
              >
                <Link
                  className="w-[2.625rem] h-[2.625rem] shrink-0 bg-transparent bg-widget-70 backdrop-blur-lg border-saturated border-opacity-25 border shadow-lg rounded-full grid items-center justify-center group"
                  href="/blog/feed.rss"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <RSSIcon
                    className="h-5 w-5 aspect-square group-hover:scale-100 transition-transform duration-300 ease-out"
                    isSaturated={true}
                  />
                </Link>
                <div className="flex-grow">
                  <SearchBar />
                </div>
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
