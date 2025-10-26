import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  sections: TOCSection[];
  className?: string;
  mode?: "flat" | "shadow";
}

const renderSections = (
  sections: TOCSection[],
  numberPrefix: string = ""
): ReactNode => {
  return (
    <ul className="leading-relaxed">
      {sections.map((section, index) => {
        const sectionNumber = `${numberPrefix}${numberPrefix ? "." : ""}${
          index + 1
        }`;

        return (
          <li key={section.id}>
            <Link
              href={`#${section.id}`}
              className="hover:underline underline-offset-2"
            >
              <div className="flex">
                <div className="font-tabular mr-2">{`${sectionNumber}`}</div>
                {`${section.title}`}
              </div>
            </Link>
            {section.children && (
              <div className="ml-4 text-sm">
                {renderSections(section.children, sectionNumber)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default function TableOfContents({
  sections,
  className = "",
  mode = "flat",
}: Props) {
  return (
    <div
      className={`inline-block max-w-full ${
        mode === "flat"
          ? "border-reflect-light px-4 pt-2 bg-light/65 rounded-3xl shadow-lg"
          : "shadow-lg px-4 pt-3 bg-light/65 border-reflect-light rounded-[2rem]"
      }`}
    >
      <p className="font-bold mb-0.5 text-base">Contents</p>
      <div
        className={`overflow-auto ${
          mode === "flat" ? "pb-2" : "pb-3"
        } ${className}`}
      >
        {renderSections(sections)}
      </div>
    </div>
  );
}
