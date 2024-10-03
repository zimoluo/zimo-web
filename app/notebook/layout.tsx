import WindowNotebook from "@/components/window/widget/WindowNotebook";
import { ReactNode } from "react";
import notebookPageStyle from "./notebook-page.module.css";

interface Props {
  children: ReactNode;
}

export default function NotebookLayout({ children }: Props) {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div
        className={`${notebookPageStyle.container} shadow-lg rounded-xl backdrop-blur-2xl`}
      >
        <WindowNotebook />
      </div>
    </div>
  );
}
