"use client";

import { useEffect, useState } from "react";
import { baseUrl } from "@/lib/constants/navigationFinder";
import ShareButton from "./ShareButton";

type Props = {
  title: string;
  description: string;
  slug: string;
  section: EntrySection;
  platforms?: SharingPlatform[];
  useMobileShare?: boolean;
  requiresPlaceholder?: boolean;
};

const defaultPlatforms: SharingPlatform[] = [
  "twitter",
  "bsky",
  "facebook",
  "reddit",
  "linkedin",
];

export default function ShareButtonArray({
  title,
  description,
  slug,
  section,
  platforms = defaultPlatforms,
  useMobileShare = true,
  requiresPlaceholder = false,
}: Props) {
  const url = new URL(`${section}/${slug}`, baseUrl).href;
  const [isMobileShareAvailable, setIsMobileShareAvailable] = useState(false);
  const [isBarHidden, setIsBarHidden] = useState(true);

  useEffect(() => {
    setIsMobileShareAvailable("share" in navigator);
    setIsBarHidden(false);
  }, []);

  return (
    <div
      className={`${
        isBarHidden ? "hidden" : "flex"
      } gap-3 px-3 py-2.5 rounded-full border-reflect-light shadow-lg`}
    >
      {platforms.map((platform) => (
        <ShareButton
          key={platform}
          title={title}
          description={description}
          url={url}
          platform={platform as SharingPlatform}
        />
      ))}
      {useMobileShare && isMobileShareAvailable && (
        <ShareButton
          title={title}
          description={description}
          url={url}
          platform="mobile"
        />
      )}
      <ShareButton
        title={title}
        description={description}
        url={url}
        platform="copy"
      />
      {requiresPlaceholder && (
        // special accommodation for project window
        <div
          className="w-5 h-6 pointer-events-none select-none invisible"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
