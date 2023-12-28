import { needTOC } from "@/lib/markdownParser";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  markdown: string;
}

export default function TOCExistChecker({ children, markdown }: Props) {
  return needTOC(markdown) ? children : null;
}
