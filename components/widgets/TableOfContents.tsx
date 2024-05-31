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
      className={`inline-block max-w-full px-3 py-2 rounded-xl bg-widget-90 ${
        mode === "flat"
          ? "border border-opacity-50 border-saturated"
          : "shadow-lg"
      }`}
    >
      <p className="font-bold mb-0.5 text-lg">Contents</p>
      <div className={`overflow-auto ${className}`}>
        {renderSections(sections)}
      </div>
    </div>
  );
}
