import ReadingBlur from "@/components/widgets/ReadingBlur";
import ThemeMakerWindow from "./ThemeMakerWindow";

export default function ThemeMakerLayout() {
  return (
    <>
      <ReadingBlur className="md:hidden" />
      <ThemeMakerWindow />
    </>
  );
}
