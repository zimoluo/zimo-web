import EntryLikeButtonInitializer from "@/components/comments/EntryLikeButtonInitializer";
import BlogIcon from "@/components/assets/navigation/BlogIcon";
import DownloadIcon from "@/components/assets/sharing/DownloadIcon";
import GitHubLogo from "@/components/assets/sharing/GitHubLogo";
import WebsiteIcon from "@/components/assets/sharing/WebsiteIcon";
import { formatDate } from "@/lib/dateUtil";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import { getProjectFavicon } from "@/lib/projects/helper";
import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  links: { [key: string]: string };
  date: string;
  authors: string[];
  slug: string;
  faviconFormat: string;
};

const keyToIconMap: Record<string, typeof GitHubLogo> = {
  github: GitHubLogo,
  "zimo-blog": BlogIcon,
  website: WebsiteIcon,
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
}: Props) {
  return (
    <div className="my-10">
      <div className="mb-2">
        <div className="flex items-center">
          <h1 className="font-bold text-4xl text-primary leading-relaxed flex-grow">
            {title}
          </h1>
          <EntryLikeButtonInitializer
            resourceLocation={`projects/likedBy/${slug}.json`}
          />
        </div>
        <p className="text-xl text-saturated opacity-80 mt-4 mb-10 leading-relaxed">
          {enrichTextContent(description)}
        </p>
      </div>
      <div className="flex h-16">
        <div className="flex justify-start items-center">
          <div className="flex items-center justify-center h-14 w-auto mr-5">
            <Image
              className="h-full w-auto"
              height={56}
              width={56}
              alt="Project Favicon"
              src={getProjectFavicon(slug, faviconFormat)}
            />
          </div>
          <div className="flex flex-col">
            <div className="text-xl font-bold items-end justify-start flex">
              {authors.join(", ")}
            </div>
            <div className="text-saturated text-md opacity-80 items-end justify-start flex">
              {formatDate(date)}
            </div>
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
      <hr className="my-2 border-saturated border-t opacity-50" />
    </div>
  );
}
