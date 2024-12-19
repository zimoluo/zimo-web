import SectionTextTitle from "@/components/mainPage/textBox/SectionTextTitle";
import ThemeProfileSelector from "./ThemeProfileSelector";
import AccentColorEditor from "./AccentColorEditor";
import GradientEditor from "./GradientEditor";
import ThemeMiscEditor from "./ThemeMiscEditor";
import FaviconEditorArea from "./FaviconEditorArea";

export default function ThemeEditorFrame() {
  return (
    <div className="md:flex-grow md:overflow-y-auto px-4 md:px-6 py-8 md:py-6">
      <SectionTextTitle>Profiles</SectionTextTitle>
      <div className="my-3">
        <ThemeProfileSelector
          hasAddProfileButton={true}
          allowRemoveProfile={true}
          allowImportProfile={true}
        />
      </div>
      <hr className="h-0 border-t-0.8 border-t-saturated my-4" />
      <SectionTextTitle>Accent Color</SectionTextTitle>
      <AccentColorEditor />
      <div className="h-6 select-none pointer-events-none" aria-hidden="true" />
      <SectionTextTitle>Widget & Backdrop</SectionTextTitle>
      <GradientEditor />
      <div className="h-6 select-none pointer-events-none" aria-hidden="true" />
      <SectionTextTitle>Favicon</SectionTextTitle>
      <FaviconEditorArea />
      <div className="h-6 select-none pointer-events-none" aria-hidden="true" />
      <SectionTextTitle>Miscellaneous</SectionTextTitle>
      <ThemeMiscEditor />
    </div>
  );
}
