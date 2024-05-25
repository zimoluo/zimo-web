import Timeline from "@/components/widgets/Timeline";
import Link from "next/link";
import HomeCommentSection from "./HomeCommentSection";
import { CommentProvider } from "@/components/contexts/CommentContext";
import { getComments } from "@/lib/dataLayer/server/commentManager";
import CommentCardContainer from "@/components/comments/CommentCardContainer";
import CommentTypingArea from "@/components/comments/CommentTypingArea";
import ArticleCardFetcher from "@/components/widgets/ArticleCardFetcher";
import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";
import TextBoxMainPageLocator from "@/components/mainPage/textBox/TextBoxMainPageLocator";
import TextBox from "@/components/mainPage/textBox/TextBox";
import SectionTextTitle from "@/components/mainPage/textBox/SectionTextTitle";

const homeCommentLocation = "about/homepage/messages.json";

interface TimelineData {
  time: string;
  content: string;
}

async function getSlideData() {
  return ((await fetchEntryBySlug("slide", "about/homepage", "json", [
    "featured",
    "timeline",
  ])) || { featured: [], timeline: [] }) as {
    featured: ArticleCardData[];
    timeline: TimelineData[];
  };
}

export default async function HomeContent() {
  const { featured: featuredData, timeline: timelineData } =
    await getSlideData();

  return (
    <TextBoxMainPageLocator>
      <TextBox>
        <SectionTextTitle>Welcome to Zimo Web!</SectionTextTitle>
        This is my website: lab, personal playground, of frontend connecting to
        backend, of design meeting functionality. Explore the{" "}
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
        page for more on me and this website. You might also be interested in
        the{" "}
        <Link href="/design" className="underline underline-offset-2">
          themes and design
        </Link>{" "}
        of Zimo Web, or even{" "}
        <Link
          href="/design/theme-maker"
          className="underline underline-offset-2"
        >
          make a theme of your own
        </Link>
        . Feel free to come back anytime and leave a message below, whether you
        wish to share a feedback or just drop a hello. Relax. Chill. Enjoy.
      </TextBox>
      <div className="md:grid md:grid-cols-2 mt-6 md:gap-x-6">
        <TextBox>
          <SectionTextTitle>Featured</SectionTextTitle>
          <div>
            {featuredData.map((data, index) => (
              <ArticleCardFetcher
                key={index}
                {...data}
                className={index !== 0 ? "mt-4" : ""}
              />
            ))}
          </div>
        </TextBox>
        <TextBox className="mt-6 md:mt-0">
          <SectionTextTitle>Timeline</SectionTextTitle>
          <Timeline
            events={timelineData.reduce((acc: Record<string, string>, item) => {
              acc[item.time] = item.content;
              return acc;
            }, {})}
          />
        </TextBox>
      </div>
      <Link href="/management">
        <TextBox className="mt-6">
          <SectionTextTitle>Website Management</SectionTextTitle>
          <p>
            Articles regarding the management and policies of Zimo Web can be
            found{" "}
            <span className="underline-offset-2 hover:underline">here</span>.
          </p>
        </TextBox>
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
    </TextBoxMainPageLocator>
  );
}
