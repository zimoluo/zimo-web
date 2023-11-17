import HeaderText from "@/components/mainPage/HeaderText";
import SocialMediaButtons from "@/components/mainPage/SocialMediaButtons";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import Image from "next/image";
import AboutQuestionList from "./AboutQuestionsList";
import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";

async function getIntroData() {
  const rawIntro = await fetchEntryBySlug("intro", "about/aboutpage", "json", [
    "intro",
  ]);
  return rawIntro.intro.join("\n");
}

async function getQuestionsData() {
  return await fetchEntryBySlug("questions", "about/aboutpage", "json", [
    "question",
    "description",
  ]);
}

export default async function Home() {
  const zimoIntro = await getIntroData();
  const { question, description } = await getQuestionsData();

  return (
    <>
      <HeaderText
        title="Trinitas Ingenii Humani."
        subtitle="Thank you for the gaze of my crafts."
      >
        <SocialMediaButtons />
      </HeaderText>
      <div className="w-full px-6 md:px-14 mb-24 flex justify-center items-center">
        <article
          className="bg-widget-90 rounded-xl overflow-hidden shadow-lg px-6 py-4 text-base md:text-lg"
          style={{ maxWidth: "50rem" }}
        >
          <section className="mb-16">
            <Image
              src="/util/profile-fallback.svg"
              className="w-28 md:w-36 h-auto aspect-square float-right ml-1.5 mb-1.5"
              height={144}
              width={144}
              alt="Zimo's Profile"
            />
            <h2 className="text-lg md:text-xl font-bold">About me</h2>
            {zimoIntro
              .split(/\n\s*\n/)
              .map((paragraph: string, index: number) => (
                <p className="my-5 md:my-6" key={index}>
                  {enrichTextContent(paragraph)}
                </p>
              ))}
          </section>
          <section>
            <h2 className="py-4 font-bold text-lg md:text-xl">
              If you have questions...
            </h2>
            <AboutQuestionList
              questions={question}
              descriptions={description}
            />
          </section>
        </article>
      </div>
    </>
  );
}

export const revalidate = 30;
