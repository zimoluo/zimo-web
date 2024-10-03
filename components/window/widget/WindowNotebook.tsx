import NotebookPage from "./NotebookPage";
import NotebookTopBar from "./NotebookTopBar";
import NotebookMenu from "./NotebookMenu";
import { NotebookProvider } from "@/components/contexts/NotebookContext";
import NotebookGridWrapper from "./NotebookGridWrapper";
import notebookStyle from "./notebook.module.css";

export default function WindowNotebook() {
  return (
    <NotebookProvider>
      <div className={`w-full h-full ${notebookStyle.container} bg-widget-80`}>
        <NotebookGridWrapper>
          <NotebookTopBar />
          <NotebookMenu />
          <NotebookPage />
        </NotebookGridWrapper>
      </div>
    </NotebookProvider>
  );
}
