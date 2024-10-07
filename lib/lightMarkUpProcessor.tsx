import Link from "next/link";
import { Fragment, ReactNode } from "react";

export const enrichTextContent = (content: string): ReactNode[] => {
  if (!content.trim()) {
    return [""];
  }

  const escapedContent = content.replace(/\\([*`|])/g, "%%ESCAPED_$1%%");

  const splitContent = escapedContent.split(
    /(\*\*[^*]+?\*\*|\*[^*]+?\*|~~\{.*?\}\{.*?\}~~|`[^`]+?`|@@\{.*?\}\{.*?\}@@|\*\*|\|[^|]+\|)/g
  );

  return splitContent.map((chunk, index) => {
    const restoredChunk = chunk.replace(/%%ESCAPED_([*`|])%%/g, "$1");

    if (restoredChunk === "**") {
      return <Fragment key={index}>**</Fragment>;
    }

    if (/^\*\*(.*?)\*\*$/.test(restoredChunk)) {
      return <strong key={index}>{restoredChunk.slice(2, -2)}</strong>;
    }
    if (/^\*(.*?)\*$/.test(restoredChunk)) {
      return <em key={index}>{restoredChunk.slice(1, -1)}</em>;
    }

    const linkMatch = restoredChunk.match(/^~~\{(.*?)\}\{(.*?)\}~~$/);
    if (linkMatch) {
      return (
        <Link
          key={index}
          href={linkMatch[2]}
          className="underline underline-offset-2"
          target="_blank"
        >
          {linkMatch[1]}
        </Link>
      );
    }

    const codeMatch = restoredChunk.match(/^`(.*?)`$/);
    if (codeMatch) {
      return <code key={index}>{codeMatch[1]}</code>;
    }

    const emailMatch = restoredChunk.match(/^@@\{(.*?)\}\{(.*?)\}@@$/);
    if (emailMatch) {
      return (
        <Link
          key={index}
          href={`mailto:${emailMatch[2]}`}
          className="underline underline-offset-2"
        >
          {emailMatch[1]}
        </Link>
      );
    }

    // Handle highlight with |text| format
    const highlightMatch = restoredChunk.match(/^\|(.*?)\|$/);
    if (highlightMatch) {
      return (
        <mark
          key={index}
          className="bg-light bg-opacity-50 py-0.5 px-0.25 text-primary"
        >
          {highlightMatch[1]}
        </mark>
      );
    }

    return <Fragment key={index}>{restoredChunk}</Fragment>;
  });
};

export const restoreDisplayText = (content: string): string => {
  if (!content) {
    return "";
  }

  const escapedContent = content.replace(/\\([*`|])/g, "%%ESCAPED_$1%%");

  const withoutBold = escapedContent.replace(/\*\*(.*?)\*\*/g, "$1");
  const withoutItalic = withoutBold.replace(/\*(.*?)\*/g, "$1");
  const withoutLinks = withoutItalic.replace(/~~\{(.*?)\}\{(.*?)\}~~/g, "$1");
  const withoutCode = withoutLinks.replace(/`(.*?)`/g, "$1");
  const withoutEmails = withoutCode.replace(/@@\{(.*?)\}\{(.*?)\}@@/g, "$1");
  const withoutHighlights = withoutEmails.replace(/\|(.*?)\|/g, "$1");

  const restoredContent = withoutHighlights.replace(
    /%%ESCAPED_([*`|])%%/g,
    "$1"
  );

  return restoredContent;
};
