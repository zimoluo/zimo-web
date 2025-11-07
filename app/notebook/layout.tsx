import WindowNotebook from "@/components/window/widget/WindowNotebook";
import { ReactNode } from "react";
import notebookPageStyle from "./notebook-page.module.css";
import { Metadata } from "next";

interface Props {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Notebook - Zimo Web",
  description: "Lightweight notebook built into Zimo Web.",
  keywords:
    "Zimo Web, Zimo Luo, Personal Website, Editor, Web app, Interactive, Responsive, Online editor, Notebook, Note taking, Note-taking, Productivity",
};

export default function NotebookLayout({ children }: Props) {
  return (
    <div className="w-screen h-screen min-h-[25rem] flex justify-center">
      <div
        className={`${notebookPageStyle.container} mt-[68px] sm:mt-[72px] shadow-xl md:rounded-[2rem] backdrop-blur-reading overflow-hidden outline outline-1 outline-highlight-light/15`}
      >
        <WindowNotebook />
      </div>
    </div>
  );
}
