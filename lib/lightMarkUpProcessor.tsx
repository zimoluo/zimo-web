import Link from "next/link";
import React from "react";
import { ReactNode } from "react";

export const enrichTextContent = (content: string): ReactNode[] => {
  const escapedContent = content.replace(/\\([*`])/g, "%%ESCAPED_$1%%");

  const splitContent = escapedContent.split(
    /(\*\*.*?\*\*|\*.*?\*|~~\{.*?\}\{.*?\}~~|`.*?`|@@\{.*?\}\{.*?\}@@)/g
  );

  return splitContent.map((chunk, index) => {
    const restoredChunk = chunk.replace(/%%ESCAPED_([*`])%%/g, "$1");

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
    return <React.Fragment key={index}>{restoredChunk}</React.Fragment>;
  });
};

export const restoreDisplayText = (content: string): string => {
  const escapedContent = content.replace(/\\([*`])/g, "%%ESCAPED_$1%%");

  const withoutBold = escapedContent.replace(/\*\*(.*?)\*\*/g, "$1");
  const withoutItalic = withoutBold.replace(/\*(.*?)\*/g, "$1");
  const withoutLinks = withoutItalic.replace(/~~\{(.*?)\}\{(.*?)\}~~/g, "$1");
  const withoutCode = withoutLinks.replace(/`(.*?)`/g, "$1");
  const withoutEmails = withoutCode.replace(/@@\{(.*?)\}\{(.*?)\}@@/g, "$1");

  const restoredContent = withoutEmails.replace(/%%ESCAPED_([*`])%%/g, "$1");

  return restoredContent;
};
