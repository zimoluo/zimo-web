import Link from "next/link";
import { Fragment, ReactNode } from "react";

const restoreEscaped = (chunk: string): string => {
  return chunk
    .replace(/ESCAPED-ASTERISK/g, "*")
    .replace(/ESCAPED-UNDERSCORE/g, "_")
    .replace(/ESCAPED-BACKTICK/g, "`")
    .replace(/ESCAPED-PIPE/g, "|")
    .replace(/ESCAPED-BACKSLASH/g, "\\");
};

const handleEscapedAndNonEscaped = (
  content: string,
  parseContent: (text: string) => ReactNode[],
  keyPrefix: string
) => {
  const splitContent = content.split(
    /(ESCAPED-(ASTERISK|UNDERSCORE|BACKTICK|PIPE|BACKSLASH))/g
  );

  return splitContent.map((subChunk, index) => {
    if (subChunk.startsWith("ESCAPED-")) {
      return (
        <Fragment key={`${keyPrefix}-${index}`}>
          {restoreEscaped(subChunk)}
        </Fragment>
      );
    }

    return (
      <Fragment key={`${keyPrefix}-${index}`}>
        {parseContent(subChunk)}
      </Fragment>
    );
  });
};

export const enrichTextContent = (content: string): ReactNode[] => {
  if (!content.trim()) {
    return [""];
  }

  const parseContent = (text: string): ReactNode[] => {
    const escapedContent = text
      .replace(/\\\*/g, "ESCAPED-ASTERISK")
      .replace(/\\_/g, "ESCAPED-UNDERSCORE")
      .replace(/\\`/g, "ESCAPED-BACKTICK")
      .replace(/\\\|/g, "ESCAPED-PIPE")
      .replace(/\\\\/g, "ESCAPED-BACKSLASH");

    const splitContent = escapedContent.split(
      /(\_(?!\_)(?:.*?)\_|\*(?!\*)(?:.*?)\*|~~\{.*?\}\{.*?\}~~|`[^`]+?`|@@\{.*?\}\{.*?\}@@|\|[^|]+\|)/g
    );

    return splitContent.filter(Boolean).map((chunk, index) => {
      if (chunk.startsWith("_") && chunk.endsWith("_")) {
        const insideContent = chunk.slice(1, -1);
        const restoredInsideContent = restoreEscaped(insideContent);

        return (
          <strong key={`bold-${index}`}>
            {handleEscapedAndNonEscaped(
              restoredInsideContent,
              parseContent,
              `bold-${index}`
            )}
          </strong>
        );
      }

      if (chunk.startsWith("*") && chunk.endsWith("*")) {
        const insideContent = chunk.slice(1, -1);
        const restoredInsideContent = restoreEscaped(insideContent);

        return (
          <em key={`italic-${index}`}>
            {handleEscapedAndNonEscaped(
              restoredInsideContent,
              parseContent,
              `italic-${index}`
            )}
          </em>
        );
      }

      const linkMatch = chunk.match(/^~~\{(.*?)\}\{(.*?)\}~~$/);
      if (linkMatch) {
        const [_, linkText, url] = linkMatch;
        return (
          <Link
            key={`link-${index}`}
            href={url}
            className="underline underline-offset-2"
            target="_blank"
          >
            {handleEscapedAndNonEscaped(
              restoreEscaped(linkText),
              parseContent,
              `link-${index}`
            )}
          </Link>
        );
      }

      if (chunk.startsWith("`") && chunk.endsWith("`")) {
        const codeContent = chunk.slice(1, -1);
        return <code key={`code-${index}`}>{restoreEscaped(codeContent)}</code>;
      }

      const emailMatch = chunk.match(/^@@\{(.*?)\}\{(.*?)\}@@$/);
      if (emailMatch) {
        const [_, emailText, email] = emailMatch;
        return (
          <Link
            key={`email-${index}`}
            href={`mailto:${email}`}
            className="underline underline-offset-2"
          >
            {handleEscapedAndNonEscaped(
              restoreEscaped(emailText),
              parseContent,
              `email-${index}`
            )}
          </Link>
        );
      }

      if (chunk.startsWith("|") && chunk.endsWith("|")) {
        const insideContent = chunk.slice(1, -1);
        const restoredInsideContent = restoreEscaped(insideContent);

        return (
          <mark
            key={`highlight-${index}`}
            className="bg-pastel bg-opacity-75 py-0.5 px-0.25 text-primary"
          >
            {handleEscapedAndNonEscaped(
              restoredInsideContent,
              parseContent,
              `highlight-${index}`
            )}
          </mark>
        );
      }

      return <Fragment key={`text-${index}`}>{restoreEscaped(chunk)}</Fragment>;
    });
  };

  return parseContent(content);
};

export const restoreDisplayText = (content: string): string => {
  if (!content) {
    return "";
  }

  const escapedContent = content
    .replace(/\\\*/g, "ESCAPED-ASTERISK")
    .replace(/\\_/g, "ESCAPED-UNDERSCORE")
    .replace(/\\`/g, "ESCAPED-BACKTICK")
    .replace(/\\\|/g, "ESCAPED-PIPE")
    .replace(/\\\\/g, "ESCAPED-BACKSLASH");

  const withoutBold = escapedContent.replace(/\_(.*?)\_/g, "$1");
  const withoutItalic = withoutBold.replace(/\*(.*?)\*/g, "$1");
  const withoutLinks = withoutItalic.replace(/~~\{(.*?)\}\{(.*?)\}~~/g, "$1");
  const withoutCode = withoutLinks.replace(/`(.*?)`/g, "$1");
  const withoutEmails = withoutCode.replace(/@@\{(.*?)\}\{(.*?)\}@@/g, "$1");
  const withoutHighlights = withoutEmails.replace(/\|(.*?)\|/g, "$1");

  const restoredContent = withoutHighlights
    .replace(/ESCAPED-ASTERISK/g, "*")
    .replace(/ESCAPED-UNDERSCORE/g, "_")
    .replace(/ESCAPED-BACKTICK/g, "`")
    .replace(/ESCAPED-PIPE/g, "|")
    .replace(/ESCAPED-BACKSLASH/g, "\\");

  return restoredContent;
};
