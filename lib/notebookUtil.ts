/**
 * Parses the text with special syntax and returns an array of NotebookPageStyleData.
 * @param text The input text containing special syntax.
 * @returns An object containing the styles array and cleaned text.
 */
export function generateStyleData(text: string): NotebookPageStyleData[] {
  const styles: NotebookPageStyleData[] = [];
  const stack: Array<{
    marker: string;
    style: NotebookPageStyleData["style"];
    fromCleanedIndex: number;
  }> = [];
  let cleanedText = "";
  let originalIndex = 0;
  let cleanedIndex = 0;

  const markerToStyle: { [key: string]: NotebookPageStyleData["style"] } = {
    "*": "italic",
    _: "bold",
    "`": "code",
    "|": "mark",
  };

  while (originalIndex < text.length) {
    let char = text[originalIndex];

    // Handle escape character
    if (char === "\\") {
      originalIndex++;
      if (originalIndex < text.length) {
        cleanedText += text[originalIndex];
        originalIndex++;
        cleanedIndex++;
      }
      continue;
    }

    // Handle custom syntax for link and email
    if (
      text.startsWith("~~{", originalIndex) ||
      text.startsWith("@@{", originalIndex)
    ) {
      const customSyntaxRegex = /^(~~|@@)\{(.*?)\}\{(.*?)\}(~~|@@)/;
      const match = text.slice(originalIndex).match(customSyntaxRegex);

      if (match) {
        const [
          fullMatch,
          openingMarker,
          displayText,
          additionalData,
          closingMarker,
        ] = match;
        const style = openingMarker === "~~" ? "link" : "email";

        styles.push({
          fromIndex: cleanedIndex,
          toIndex: cleanedIndex + displayText.length - 1,
          style,
          additionalData,
        });

        cleanedText += displayText;

        originalIndex += fullMatch.length;
        cleanedIndex += displayText.length;

        continue;
      }
    }

    // Handle inline markers
    if (markerToStyle[char]) {
      const currentStyle = markerToStyle[char];

      if (stack.length > 0 && stack[stack.length - 1].marker === char) {
        // Closing marker
        const openedStyle = stack.pop()!;
        styles.push({
          fromIndex: openedStyle.fromCleanedIndex,
          toIndex: cleanedIndex - 1,
          style: openedStyle.style,
        });
      } else {
        // Opening marker
        stack.push({
          marker: char,
          style: currentStyle,
          fromCleanedIndex: cleanedIndex,
        });
      }

      originalIndex++;
    } else {
      // Regular character
      cleanedText += char;
      originalIndex++;
      cleanedIndex++;
    }
  }

  return styles;
}

export function applyStyleData(
  text: string,
  styles: NotebookPageStyleData[]
): string {
  // Sort styles by fromIndex in descending order
  styles.sort((a, b) => b.fromIndex - a.fromIndex);

  // Function to escape special characters
  const escapeSpecialChars = (str: string) => str.replace(/([*_|`])/g, "\\$1");

  for (const style of styles) {
    const { fromIndex, toIndex, style: styleType, additionalData } = style;
    const maxIndex = text.length - 1;

    // Adjust indices if out of bounds
    if (fromIndex > maxIndex) continue;
    const actualToIndex = Math.min(toIndex, maxIndex);

    let prefix = "",
      suffix = "";
    switch (styleType) {
      case "bold":
        prefix = suffix = "_";
        break;
      case "italic":
        prefix = suffix = "*";
        break;
      case "code":
        prefix = suffix = "`";
        break;
      case "mark":
        prefix = suffix = "|";
        break;
      case "link":
        prefix = "*~~*{";
        suffix = `}{${additionalData}}*~~*`;
        break;
      case "email":
        prefix = "@@{";
        suffix = `}{${additionalData}}@@`;
        break;
    }

    const before = text.slice(0, fromIndex);
    const styled = escapeSpecialChars(text.slice(fromIndex, actualToIndex + 1));
    const after = text.slice(actualToIndex + 1);

    text = before + prefix + styled + suffix + after;
  }

  return text;
}
