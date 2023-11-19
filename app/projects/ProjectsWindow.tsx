import WindowDisplay from "@/components/widgets/WindowDisplay";
import ProjectsArticle from "./ProjectsArticle";
import windowStyle from "./projects-window.module.css";

export default function ProjectsWindow(entry: ProjectsEntry) {
  return (
    <div className="w-screen h-screen inset-0 flex items-center justify-center">
      <div className={`${windowStyle.size}`}>
        <WindowDisplay
          imageData={entry.images}
          display={<ProjectsArticle {...entry} />}
        />
      </div>
    </div>
  );
}
