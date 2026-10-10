import HeaderText from "../../shell/ui/HeaderText";
import SocialMediaButtons from "../../shell/ui/SocialMediaButtons";
import { InlineMarks } from "../../document";
import Image from "next/image";
import { objects } from "../../../server/storage/object";
import { z } from "zod";
import TextBoxMainPageLocator from "../../shell/ui/textBox/TextBoxMainPageLocator";
import TextBox from "../../shell/ui/textBox/TextBox";
import SectionTextTitle from "../../shell/ui/textBox/SectionTextTitle";
import AboutZimoText from "./AboutZimoText";

async function getIntroData() {
  const record = await objects().readJson("about/intro.json", (value) => z.object({ intro: z.array(z.string()) }).parse(value));
  return record?.value.intro.join("\n") ?? "";
}

export async function AboutContent() {
  const zimoIntro = await getIntroData();

  return (
    <>
      <AboutZimoText />
      <HeaderText
        title={"Who\u2019s Been Looking."}
        subtitle="What brings me here."
      >
        <SocialMediaButtons />
      </HeaderText>
      <TextBoxMainPageLocator>
        <TextBox>
          <section>
            <Image
              src="/util/zimo-face-profile.svg" width={1024} height={1024}
              className="w-28 md:w-36 h-auto aspect-square float-right ml-1.5 mb-1.5"
              alt="Zimo's Profile"
            />
            <SectionTextTitle>About me</SectionTextTitle>
            {zimoIntro
              .split(/\n\s*\n/)
              .map((paragraph: string, index: number) => (
                <p className="mt-5 md:mt-6" key={index}>
                  <InlineMarks>{paragraph}</InlineMarks>
                </p>
              ))}
          </section>
        </TextBox>
      </TextBoxMainPageLocator>
    </>
  );
}
