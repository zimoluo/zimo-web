import { awsBucketAddress } from "../constants/awsConfig";

export const getAuthorImageSrc = (authorId: string): string => {
  if (authorId === "zimo") {
    return "/util/zimo-default-profile.svg";
  }

  return `${awsBucketAddress}/blog/author/${authorId}`;
};

export const getCoverSrc = (coverImage: string, slug: string): string => {
  if (!coverImage) {
    return "";
  }

  if (!coverImage.startsWith("/")) {
    return coverImage;
  }

  const strippedPath = coverImage.substring(1);
  const newPath = `${awsBucketAddress}/blog/posts/${slug}/${strippedPath}`;

  return newPath;
};

export const readingTime = (content: string) => {
  const cleanedContent = content
    .replace(/&&[^&&]*&&|&&[^&&]*\n/g, "")
    .replace(/@@[a-zA-Z0-9]+@@/g, "asset");

  const words = cleanedContent.split(/\b\S+\b/g).filter(Boolean);

  const wordCount = words.length;
  const totalMinutes = Math.ceil(wordCount / 238); // 238 words per minute according to some research

  if (totalMinutes >= 1440) {
    // 1440 minutes in a day
    return "You don't wanna read this";
  }

  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) {
      return `${hours} hr${hours === 1 ? "" : "s"} read`;
    }

    return `${hours} hr${hours === 1 ? "" : "s"} ${minutes} min read`;
  }

  return `${totalMinutes} min read`;
};
