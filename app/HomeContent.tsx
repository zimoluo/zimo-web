import Timeline from "@/components/widgets/Timeline";
import Link from "next/link";
import HomeCommentSection from "./HomeCommentSection";
import { CommentProvider } from "@/components/contexts/CommentContext";
import { getComments } from "@/lib/dataLayer/server/commentManager";
import CommentCardContainer from "@/components/comments/CommentCardContainer";
import CommentTypingArea from "@/components/comments/CommentTypingArea";
import ArticleCardFetcher from "@/components/widgets/ArticleCardFetcher";
import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";

const homeCommentLocation = "about/homepage/messages.json";

async function getFeaturedData() {
  return (await fetchEntryBySlug("featured", "about/homepage", "json", [
    "featured",
  ])) as { featured: ArticleCardData[] };
}

export default async function HomeContent() {
  const { featured: featuredData } = await getFeaturedData();

  return (
    <div className="w-full px-6 md:px-14 mb-24 flex justify-center items-center">
      <div style={{ maxWidth: "50rem" }}>
        <article className="shadow-lg rounded-xl bg-widget-70 backdrop-blur-lg px-4 py-4">
          <h3 className="text-xl font-bold mb-2">Welcome to Zimo Web!</h3>
          This is my website: lab, personal playground, of frontend connecting
          to backend, of design meeting functionality. Explore the{" "}
          <Link href="/photos" className="underline underline-offset-2">
            Album
          </Link>
          ,{" "}
          <Link href="/blog" className="underline underline-offset-2">
            Blog
          </Link>
          , and{" "}
          <Link href="/projects" className="underline underline-offset-2">
            Projects
          </Link>{" "}
          page; you&apos;ll find things I&apos;ve done. Mostly. Or go to the{" "}
          <Link href="/about" className="underline underline-offset-2">
            About
          </Link>{" "}
          page for more on me and this website. Feel free to come back anytime
          and leave a message below, whether you wish to share a feedback or
          just drop a hello. Relax. Chill. Enjoy.
        </article>
        <div className="md:grid md:grid-cols-2 mt-6 md:gap-x-6">
          <section className="shadow-lg rounded-xl bg-widget-70 backdrop-blur-lg px-4 py-4 text-lg">
            <h3 className="text-xl font-bold mb-2">Featured</h3>
            <div>
              {featuredData.map((data, index) => (
                <ArticleCardFetcher
                  key={index}
                  {...data}
                  className={index !== 0 ? "mt-4" : ""}
                />
              ))}
            </div>
          </section>
          <section className="shadow-lg rounded-xl bg-widget-70 backdrop-blur-lg px-4 py-4 text-lg mt-6 md:mt-0">
            <h3 className="text-xl font-bold mb-2">Timeline</h3>
            <Timeline
              events={{
                "2023-8-19": "The construction of Zimo Web begins.",
                "2023-10-27":
                  "Zimo Web is released – exactly one month before my birthday.",
                "2023-10-29": "The Spooky Halloween Update is released.",
                "2023-11-21": "The All-New Zimo Web Update is released.",
              }}
            />
          </section>
        </div>
        <Link href="/management">
          <article className="shadow-lg rounded-xl bg-widget-70 backdrop-blur-lg px-4 py-4 text-base mt-6">
            <h3 className="text-xl font-bold mb-2">Website Management</h3>
            <p>
              Articles regarding the management and policies of Zimo Web can be
              found{" "}
              <span className="underline-offset-2 hover:underline">here</span>.
            </p>
          </article>
        </Link>
        <HomeCommentSection>
          <CommentProvider
            location={homeCommentLocation}
            initialComments={await getComments(homeCommentLocation)}
          >
            <div className="mb-6 mt-3">
              <CommentTypingArea messageWord="message" />
            </div>
            <div className="px-3 mb-2">
              <CommentCardContainer />
            </div>
          </CommentProvider>
        </HomeCommentSection>
      </div>
    </div>
  );
}
