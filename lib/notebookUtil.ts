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

    if (char === "\\") {
      originalIndex++;
      if (originalIndex < text.length) {
        cleanedText += text[originalIndex];
        originalIndex++;
        cleanedIndex++;
      }
      continue;
    }

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
  inputString: string,
  styles: NotebookPageStyleData[]
): string {
  const specialChars = new Set(["*", "_", "|", "`", "~", "@"]);
  const mapping: number[] = [];
  let escapedString = "";
  let escapedIndex = 0;

  // Step 1: Escape special characters and build mapping
  for (let i = 0; i < inputString.length; i++) {
    const c = inputString[i];
    if (specialChars.has(c)) {
      escapedString += "\\" + c;
      mapping[i] = escapedIndex + 1; // The actual character is at escapedIndex + 1
      escapedIndex += 2;
    } else {
      escapedString += c;
      mapping[i] = escapedIndex;
      escapedIndex += 1;
    }
  }

  // Step 2: Initialize tokens
  interface Token {
    char: string;
    prefixes: string[];
    suffixes: string[];
    replace?: string;
    skip?: number;
  }
  const tokens: Token[] = [];
  for (let i = 0; i < escapedString.length; i++) {
    tokens.push({ char: escapedString[i], prefixes: [], suffixes: [] });
  }

  // Step 3: Apply styles
  for (const styleData of styles) {
    let { fromIndex, toIndex, style, additionalData } = styleData;

    // Adjust indices if out of bounds
    if (fromIndex < 0 || fromIndex >= inputString.length) {
      continue;
    }
    if (toIndex >= inputString.length) {
      toIndex = inputString.length - 1;
    }

    const start = mapping[fromIndex];
    const end = mapping[toIndex];

    if (style === "link" || style === "email") {
      if (!additionalData) continue; // Skip if additionalData is missing
      const textTokens = tokens.slice(start, end + 1);
      const text = textTokens.map((t) => t.char).join("");
      const formattedText =
        (style === "link" ? "~~{" : "@@{") +
        text +
        "}{" +
        additionalData +
        "}" +
        (style === "link" ? "~~" : "@@");
      tokens[start].replace = formattedText;
      tokens[start].skip = end - start;
    } else {
      let prefix = "";
      let suffix = "";
      switch (style) {
        case "bold":
          prefix = "_";
          suffix = "_";
          break;
        case "italic":
          prefix = "*";
          suffix = "*";
          break;
        case "code":
          prefix = "`";
          suffix = "`";
          break;
        case "mark":
          prefix = "|";
          suffix = "|";
          break;
        default:
          continue;
      }
      tokens[start].prefixes.push(prefix);
      tokens[end].suffixes.unshift(suffix); // Unshift to reverse order
    }
  }

  // Step 4: Build the final string
  let finalString = "";
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token.replace !== undefined) {
      finalString += token.replace;
      i += (token.skip ?? 0) + 1;
    } else {
      finalString +=
        token.prefixes.join("") + token.char + token.suffixes.join("");
      i += 1;
    }
  }

  return finalString;
}
