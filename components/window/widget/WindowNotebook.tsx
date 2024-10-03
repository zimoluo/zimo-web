import NotebookPage from "./NotebookPage";
import NotebookTopBar from "./NotebookTopBar";
import NotebookMenu from "./NotebookMenu";
import notebookStyle from "./notebook.module.css";

export default function WindowNotebook() {
  return (
    <div className={`w-full h-full p-4 ${notebookStyle.grid}`}>
      <NotebookTopBar />
      <NotebookMenu />
      <NotebookPage />
    </div>
  );
}
