import HeaderText from "@/components/mainPage/HeaderText";
import BlogEntries from "./BlogEntries";
import { FilterSearchProvider } from "@/components/contexts/FilterSearchContext";
import cardStyle from "./blog-card.module.css";
import { Metadata } from "next";
import entriesStyle from "./blog-entries.module.css";
import SearchBarUrlParameter from "@/components/widgets/SearchBarUrlParameter";

export const metadata: Metadata = {
  title: "Blog - Zimo Web",
  description: "The personal blog of Zimo.",
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
                <SearchBarUrlParameter />
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
