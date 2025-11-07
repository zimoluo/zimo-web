import WindowDisplay from "@/components/widgets/WindowDisplay";
import ProjectsArticle from "./ProjectsArticle";

export default function ProjectsWindow(entry: ProjectsEntry) {
  const [widthRatio, heightRatio] = entry.images.aspectRatio
    .split(":")
    .map(Number);

  return (
    <div className="w-screen h-screen inset-0 flex items-center justify-center">
      <div
        style={{
          height: `clamp(20vh, ${
            (42 / widthRatio) * heightRatio
          }vw, min(calc(100vh - 144px), ${(58 / widthRatio) * heightRatio}vh))`,
          width: "clamp(10rem, 90vw, 150vh)",
        }}
      >
        <WindowDisplay
          imageData={entry.images}
          display={<ProjectsArticle {...entry} />}
          className="bg-widget-90"
        />
      </div>
    </div>
  );
}
