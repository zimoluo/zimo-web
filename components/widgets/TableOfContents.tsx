import Link from "next/link";

interface Props {
  sections: TOCSection[];
  className?: string;
}

const renderSections = (sections: TOCSection[], numberPrefix: string = "") => {
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

export default function TableOfContents({ sections, className = "" }: Props) {
  return (
    <div className="inline-block max-w-full px-3 py-2 rounded-xl bg-widget-90 border border-opacity-50 border-saturated">
      <p className="font-bold mb-0.5 text-lg">Contents</p>
      <div className={`overflow-auto ${className}`}>
        {renderSections(sections)}
      </div>
    </div>
  );
}
