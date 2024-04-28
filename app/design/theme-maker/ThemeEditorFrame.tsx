import SectionTextTitle from "@/components/mainPage/textBox/SectionTextTitle";
import ThemeProfileSelector from "./ThemeProfileSelector";
import AccentColorEditor from "./AccentColorEditor";

export default function ThemeEditorFrame() {
  return (
    <div className="md:flex-grow md:overflow-y-auto px-4 md:px-6 py-8 md:py-4">
      <SectionTextTitle>Profiles</SectionTextTitle>
      <div className="my-3">
        <ThemeProfileSelector />
      </div>
      <hr className="h-0 border-t-0.8 border-t-saturated my-4" />
      <SectionTextTitle>Section</SectionTextTitle>i ll make a separate selector
      but leave it here now
      <SectionTextTitle></SectionTextTitle>
      <div className="flex items-center justify-center">
        <AccentColorEditor />
      </div>
    </div>
  );
}
