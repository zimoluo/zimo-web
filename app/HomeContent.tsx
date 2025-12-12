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
        <SectionTextTitle>Hello there!</SectionTextTitle>
        This is my website where I document work and explore ideas. Navigate to
        the{" "}
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
        pages to see what I{"\u2019"}ve been working on. For more about me and
        the site, visit the{" "}
        <Link href="/about" className="underline underline-offset-2">
          About
        </Link>{" "}
        page. You can also explore the{" "}
        <Link href="/design" className="underline underline-offset-2">
          Design
        </Link>{" "}
        of Zimo Web, or create a theme with the{" "}
        <Link
          href="/design/theme-maker"
          className="underline underline-offset-2"
        >
          Theme&nbsp;Maker
        </Link>
        . Use windows to browse any section at any time, and try out the{" "}
        <Link href="/notebook" className="underline underline-offset-2">
          Notebook
        </Link>{" "}
        to capture thoughts. Feel free to come back anytime and leave a message
        below.
      </TextBox>
      <Link href="/design/theme-maker">
        <TextBox className="mt-6">
          <SectionTextTitle>Theme Maker</SectionTextTitle>
          Zimo Web{"\u2019"}s appearance is yours to define. Enter the{" "}
          <span className="underline underline-offset-2">Theme Maker</span> and
          infuse every corner of the site with your personal style, customizing
          colors and design to your heart{"\u2019"}s content.
        </TextBox>
      </Link>
      <div className="md:grid md:grid-cols-2 mt-6 md:gap-x-6">
        <TextBox className="max-h-[500px] overflow-y-auto pb-4">
          <SectionTextTitle>Featured</SectionTextTitle>
          <div>
            {featuredData.map((data, index) => (
              <ArticleCardFetcher
                key={index}
                {...data}
                className={index !== 0 ? "mt-4" : ""}
                isLessRounded={true}
              />
            ))}
          </div>
        </TextBox>
        <TextBox className="mt-6 md:mt-0 max-h-[500px] overflow-y-auto">
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
            found <span className="underline-offset-2 underline">here</span>.
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
          <div className="px-3 mb-2 max-h-[1000px] overflow-y-auto">
            <CommentCardContainer />
          </div>
        </CommentProvider>
      </HomeCommentSection>
    </TextBoxMainPageLocator>
  );
}
