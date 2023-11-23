import WindowDisplay from "@/components/widgets/WindowDisplay";
import ProjectsArticle from "./ProjectsArticle";
import windowStyle from "./projects-window.module.css";

export default function ProjectsWindow(entry: ProjectsEntry) {
  const [widthRatio, heightRatio] = entry.images.aspectRatio
    .split(":")
    .map(Number);

  return (
    <div className="w-screen h-screen inset-0 flex items-center justify-center">
      <div
        className={`${windowStyle.size}`}
        style={{
          height: `clamp(20vh, ${
            (42 / widthRatio) * heightRatio
          }vw, min(calc(100vh - 6rem), ${(58 / widthRatio) * heightRatio}vh))`,
        }}
      >
        <WindowDisplay
          imageData={entry.images}
          display={<ProjectsArticle {...entry} />}
        />
      </div>
    </div>
  );
}
