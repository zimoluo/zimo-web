import type { ReactNode } from "react";
import ExpandCollapseEntry from "./Disclosure";

interface ExpandCollapseData {
  title: string;
  content: ReactNode;
}

interface Props {
  entries: ExpandCollapseData[];
}

export default function ExpandCollapseDisplay({ entries }: Props) {
  return (
    <>
      {entries.map((entry, index) => (
        <ExpandCollapseEntry
          {...entry}
          className={`${
            index !== 0 ? "border-t/20 border-text-muted/20" : ""
          }`}
          key={index}
        />
      ))}
    </>
  );
}
