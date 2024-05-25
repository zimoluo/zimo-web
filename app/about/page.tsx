import HeaderText from "@/components/mainPage/HeaderText";
import SocialMediaButtons from "@/components/mainPage/SocialMediaButtons";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import Image from "next/image";
import AboutQuestionList from "./AboutQuestionsList";
import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";
import { Metadata } from "next";
import TextBoxMainPageLocator from "@/components/mainPage/textBox/TextBoxMainPageLocator";
import TextBox from "@/components/mainPage/textBox/TextBox";
import SectionTextTitle from "@/components/mainPage/textBox/SectionTextTitle";

export const metadata: Metadata = {
  title: "About - Zimo Web",
  description: "Information regarding Zimo and Zimo Web.",
};

async function getIntroData() {
  const rawIntro = await fetchEntryBySlug("intro", "about/aboutpage", "json", [
    "intro",
  ]);
  return rawIntro.intro.join("\n");
}

export default async function AboutPage() {
  const zimoIntro = await getIntroData();

  return (
    <>
      <HeaderText
        title="Trinitas Ingenii Humani."
        subtitle="Thank you for the gaze of my crafts."
      >
        <SocialMediaButtons />
      </HeaderText>
      <TextBoxMainPageLocator>
        <TextBox>
          <section className="mb-16">
            <Image
              src="/util/zimo-face-profile.svg"
              className="w-28 md:w-36 h-auto aspect-square float-right ml-1.5 mb-1.5"
              height={144}
              width={144}
              alt="Zimo's Profile"
            />
            <SectionTextTitle>About me</SectionTextTitle>
            {zimoIntro
              .split(/\n\s*\n/)
              .map((paragraph: string, index: number) => (
                <p className="my-5 md:my-6" key={index}>
                  {enrichTextContent(paragraph)}
                </p>
              ))}
          </section>
          <section>
            <SectionTextTitle>If you have questions...</SectionTextTitle>
            <AboutQuestionList />
          </section>
        </TextBox>
      </TextBoxMainPageLocator>
    </>
  );
}

export const revalidate = 30;
