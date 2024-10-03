"use client";

import { ReactNode } from "react";
import notebookStyle from "./notebook.module.css";
import { useNotebook } from "@/components/contexts/NotebookContext";

interface Props {
  children?: ReactNode;
}

export default function NotebookGridWrapper({ children }: Props) {
  const { isMenuOpen } = useNotebook();

  return (
    <div
      className={`w-full h-full p-4 ${notebookStyle.grid} ${
        isMenuOpen ? notebookStyle.menuOpen : ""
      }`}
    >
      {children}
    </div>
  );
}
