import SearchBarIcon from "@/components/assets/entries/SearchBarIcon";
import BlogIcon from "@/components/assets/navigation/BlogIcon";
import DownloadIcon from "@/components/assets/sharing/DownloadIcon";
import GitHubLogo from "@/components/assets/sharing/GitHubLogo";
import { formatDate } from "@/lib/dateUtil";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import { getProjectFavicon } from "@/lib/projects/helper";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  links: { [key: string]: string };
  date: string;
  authors: string[];
  slug: string;
  faviconFormat: string;
  children?: ReactNode;
};

const keyToIconMap: Record<string, typeof GitHubLogo> = {
  github: GitHubLogo,
  "zimo-blog": BlogIcon,
  website: (props: ImageIconProps) => (
    <SearchBarIcon strokeWidth={1.3125} isSaturated={false} {...props} />
  ),
  download: DownloadIcon,
};

export default function ProjectsHeader({
  title,
  description,
  links,
  date,
  authors,
  slug,
  faviconFormat,
  children,
}: Props) {
  return (
    <div className="mt-13 mb-10">
      <div className="mb-2">
        <div className="flex items-center">
          <div className="flex items-center justify-center h-12 w-auto mr-4 shrink-0">
            <Image
              className="h-full w-auto"
              height={48}
              width={48}
              alt="Project Favicon"
              src={getProjectFavicon(slug, faviconFormat)}
            />
          </div>
          <h1 className="font-bold text-3xl md:text-4xl text-primary leading-tight flex-grow mr-2">
            {title}
          </h1>
          {children}
        </div>
        <p className="text-xl text-saturated opacity-80 mt-4 mb-10 leading-relaxed">
          {enrichTextContent(description)}
        </p>
      </div>
      <div className="flex h-20 p-4 bg-light/65 border border-highlight-light/15 rounded-3xl shadow-lg">
        <div className="flex flex-col justify-end gap-1.5">
          <div className="text-xl font-bold items-end justify-start flex flex-grow">
            {authors.join(", ")}
          </div>
          <div className="text-saturated text-md opacity-80 items-end justify-start flex align-text-bottom leading-none">
            {formatDate(date)}
          </div>
        </div>
        <div className="flex-col flex-grow">
          <div className="flex-grow" />
          <div className="flex items-end justify-end h-full">
            {Object.keys(links).map((key, index) => {
              const IconComponent = keyToIconMap[key];
              return (
                <Link
                  key={index}
                  href={
                    key === "zimo-blog"
                      ? `/blog/${links[key]}`
                      : key === "download"
                      ? links[key]
                      : key === "github"
                      ? `https://github.com/${links[key]}`
                      : links[key]
                  }
                  target="_blank"
                  download={key === "download" ? true : undefined}
                >
                  <IconComponent className="h-7 w-auto ml-3.5 transition-transform duration-300 ease-in-out hover:scale-110" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
