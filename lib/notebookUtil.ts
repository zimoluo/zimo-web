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

/**
 * Applies the styles to the normal text and returns the text with special syntax.
 * @param text The normal text without any special syntax.
 * @param styles An array of NotebookPageStyleData to apply.
 * @returns The text with special syntax applied.
 */
export function applyStyleData(
  text: string,
  styles: NotebookPageStyleData[]
): string {
  // Sort styles in order of their fromIndex (descending) to handle nested styles
  styles.sort((a, b) => b.fromIndex - a.fromIndex);

  let result = text;

  for (const styleData of styles) {
    const { fromIndex, toIndex, style, additionalData } = styleData;
    const substr = result.slice(fromIndex, toIndex + 1);
    let styledText = "";

    switch (style) {
      case "bold":
        styledText = `_${substr}_`;
        break;
      case "italic":
        styledText = `*${substr}*`;
        break;
      case "code":
        styledText = `\`${substr}\``;
        break;
      case "mark":
        styledText = `|${substr}|`;
        break;
      case "link":
        styledText = `~~{${substr}}{${additionalData}}~~`;
        break;
      case "email":
        styledText = `@@{${substr}}{${additionalData}}@@`;
        break;
      default:
        styledText = substr;
    }

    // Replace the substring with the styledText
    result =
      result.slice(0, fromIndex) + styledText + result.slice(toIndex + 1);
  }

  return result;
}
