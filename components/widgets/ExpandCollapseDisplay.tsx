import { ReactNode } from "react";
import ExpandCollapseEntry from "./ExpandCollapseEntry";

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
            index !== 0 ? "border-t border-saturated border-opacity-20" : ""
          }`}
          key={index}
        />
      ))}
    </>
  );
}
