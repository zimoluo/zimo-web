import type { Section } from "@/src/features/entries";
import Link from "next/link";
import HomeCommentSection from "./HomeCommentSection";
import { Comments } from "@/src/features/comments";
import { objects } from "@/src/server/storage/object";
import { z } from "zod";
import TextBoxMainPageLocator from "@/components/mainPage/textBox/TextBoxMainPageLocator";
import TextBox from "@/components/mainPage/textBox/TextBox";
import SectionTextTitle from "@/components/mainPage/textBox/SectionTextTitle";
import { FeaturedCardFetcher } from "./FeaturedCardFetcher";


async function getSlideData() {
  const schema = z.object({ featured: z.array(z.object({ section: z.enum(["blog", "album", "projects", "management"]).default("blog"), slug: z.string(), title: z.string().optional(), description: z.string().optional() })).default([]), timeline: z.array(z.object({ time: z.string(), content: z.string() })).default([]) });
  const record = await objects().readJson("home/slide.json", (value) => schema.parse(value));
  return { featured: (record?.value.featured ?? []).map((entry) => ({ section: entry.section, slug: entry.slug })) as {section:Section;slug:string}[], timeline: record?.value.timeline ?? [] };

}

export default async function HomeContent() {
  const { featured: featuredData } =
    await getSlideData();

  return (
    <TextBoxMainPageLocator>
      <TextBox>
        <SectionTextTitle>Hello there!</SectionTextTitle>
        This is my website where I document work and explore ideas. Navigate to
        the{" "}
        <Link href="/album" className="underline underline-offset-2">
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
      <TextBox className="mt-6">
        <SectionTextTitle>Featured</SectionTextTitle>
        <div className="pt-1">
          {featuredData.map((data, index) => (
            <FeaturedCardFetcher
              key={index}
              {...data}
              className={index !== 0 ? "mt-4" : ""}
            />
          ))}
        </div>
      </TextBox>
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
        <Comments section="home" slug="home" />
      </HomeCommentSection>
    </TextBoxMainPageLocator>
  );
}
