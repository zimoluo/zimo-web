import SectionTextTitle from "@/components/mainPage/textBox/SectionTextTitle";
import ThemeProfileSelector from "./ThemeProfileSelector";

export default function ThemeEditorFrame() {
  return (
    <div className="md:flex-grow md:overflow-y-auto px-4 md:px-6 py-8 md:py-4">
      <SectionTextTitle>Profiles</SectionTextTitle>
      <div className="my-3">
        <ThemeProfileSelector />
      </div>
      where the main editing will take place. yea
    </div>
  );
}
