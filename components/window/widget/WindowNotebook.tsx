import NotebookPage from "./NotebookPage";
import NotebookTopBar from "./NotebookTopBar";
import NotebookMenu from "./NotebookMenu";
import { NotebookProvider } from "@/components/contexts/NotebookContext";
import NotebookGridWrapper from "./NotebookGridWrapper";

export default function WindowNotebook() {
  return (
    <NotebookProvider>
      <NotebookGridWrapper>
        <NotebookTopBar />
        <NotebookMenu />
        <NotebookPage />
      </NotebookGridWrapper>
    </NotebookProvider>
  );
}
