import HeaderText from "@/components/mainPage/HeaderText";
import SocialMediaButtons from "@/components/mainPage/SocialMediaButtons";
import HomeContent from "./HomeContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zimo Web",
  description: "The personal website of Zimo.",
};

export default function Home() {
  return (
    <>
      <HeaderText
        title={"Welcome to Zimo Web."}
        subtitle={"I\u2019m glad you made it here."}
      >
        <SocialMediaButtons />
      </HeaderText>
      <HomeContent />
    </>
  );
}

export const revalidate = 30;
