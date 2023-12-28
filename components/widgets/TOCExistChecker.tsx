import { hasTopHeader } from "@/lib/markdownParser";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  markdown: string;
}

export default function TOCExistChecker({ children, markdown }: Props) {
  return hasTopHeader(markdown) ? children : null;
}
