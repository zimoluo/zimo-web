import HeaderText from "@/components/mainPage/HeaderText";
import SocialMediaButtons from "@/components/mainPage/SocialMediaButtons";
import HomeSecretText from "./HomeSecretText";
import HomeContent from "./HomeContent";

export const revalidate = 0;

export default function Home() {
  return (
    <>
      <HeaderText
        title={
          <>
            {"Greetings, I\u2019m\u00A0"}
            <HomeSecretText />
          </>
        }
        subtitle="Hello there. I'm glad you made it here."
      >
        <SocialMediaButtons />
      </HeaderText>
      <HomeContent />
    </>
  );
}
