import Link from "next/link";
import { Fragment, ReactNode } from "react";

export const enrichTextContent = (content: string): ReactNode[] => {
  if (!content.trim()) {
    return [""];
  }

  const parseContent = (text: string): ReactNode[] => {
    const escapedContent = text.replace(/\\([*_`|])/g, "%%ESCAPED_$1%%");

    const splitContent = escapedContent.split(
      /(\_(?!\_)(?:.*?)\_|\*(?!\*)(?:.*?)\*|~~\{.*?\}\{.*?\}~~|`[^`]+?`|@@\{.*?\}\{.*?\}@@|\|[^|]+\|)/g
    );

    return splitContent.filter(Boolean).map((chunk, index) => {
      if (!chunk) return null;

      const restoredChunk = chunk.replace(/%%ESCAPED_([*_`|])%%/g, "$1");

      if (restoredChunk.startsWith("_") && restoredChunk.endsWith("_")) {
        return (
          <strong key={index}>
            {parseContent(restoredChunk.slice(1, -1))}
          </strong>
        );
      }

      if (restoredChunk.startsWith("*") && restoredChunk.endsWith("*")) {
        return <em key={index}>{parseContent(restoredChunk.slice(1, -1))}</em>;
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
            {parseContent(linkMatch[1])}
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
            {parseContent(emailMatch[1])}
          </Link>
        );
      }

      const highlightMatch = restoredChunk.match(/^\|(.*?)\|$/);
      if (highlightMatch) {
        return (
          <mark
            key={index}
            className="bg-pastel bg-opacity-75 py-0.5 px-0.25 text-primary"
          >
            {parseContent(highlightMatch[1])}
          </mark>
        );
      }

      return <Fragment key={index}>{restoredChunk}</Fragment>;
    });
  };

  return parseContent(content);
};

export const restoreDisplayText = (content: string): string => {
  if (!content) {
    return "";
  }

  const escapedContent = content.replace(/\\([*_`|])/g, "%%ESCAPED_$1%%");

  const withoutBold = escapedContent.replace(/\_(.*?)\_/g, "$1");
  const withoutItalic = withoutBold.replace(/\*(.*?)\*/g, "$1");
  const withoutLinks = withoutItalic.replace(/~~\{(.*?)\}\{(.*?)\}~~/g, "$1");
  const withoutCode = withoutLinks.replace(/`(.*?)`/g, "$1");
  const withoutEmails = withoutCode.replace(/@@\{(.*?)\}\{(.*?)\}@@/g, "$1");
  const withoutHighlights = withoutEmails.replace(/\|(.*?)\|/g, "$1");

  const restoredContent = withoutHighlights.replace(
    /%%ESCAPED_([*_`|])%%/g,
    "$1"
  );

  return restoredContent;
};
