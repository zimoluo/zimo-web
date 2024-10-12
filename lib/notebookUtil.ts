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
  inputString: string,
  styles: NotebookPageStyleData[]
): string {
  let escapedString = "";
  let indexMapping = [];

  // Step 1: Escape special characters and build index mapping
  for (let i = 0; i < inputString.length; i++) {
    indexMapping[i] = escapedString.length;
    let c = inputString[i];
    if (c === "*" || c === "_" || c === "|" || c === "`" || c === "\\") {
      escapedString += "\\" + c;
    } else {
      escapedString += c;
    }
  }

  // Define style priorities
  const stylePriorities: { [key: string]: number } = {
    link: 1,
    email: 2,
    mark: 3,
    code: 4,
    bold: 5,
    italic: 6,
  };

  // Step 2: Collect style events
  let events: Array<{
    index: number;
    type: "start" | "end";
    style: string;
    priority: number;
    additionalData?: string;
  }> = [];

  for (let s of styles) {
    let { fromIndex, toIndex, style, additionalData } = s;

    // Adjust indices according to the rules
    if (fromIndex < 0 || fromIndex >= inputString.length) {
      continue; // Ignore the rule
    }

    if (toIndex >= inputString.length) {
      toIndex = inputString.length - 1;
    }

    if (fromIndex > toIndex) {
      toIndex = inputString.length - 1;
    }

    // Map to escaped indices
    let escapedFromIndex = indexMapping[fromIndex];
    let escapedToIndex =
      indexMapping[toIndex + 1] !== undefined
        ? indexMapping[toIndex + 1]
        : escapedString.length;

    // Create start event at escapedFromIndex
    events.push({
      index: escapedFromIndex,
      type: "start",
      style,
      priority: stylePriorities[style],
      additionalData,
    });

    // Create end event at escapedToIndex
    events.push({
      index: escapedToIndex,
      type: "end",
      style,
      priority: stylePriorities[style],
      additionalData,
    });
  }

  // Step 3: Sort events
  events.sort((a, b) => {
    if (a.index !== b.index) {
      return a.index - b.index;
    } else {
      if (a.type !== b.type) {
        // For same index, start events before end events
        return a.type === "start" ? -1 : 1;
      } else {
        // For start events at same index, lower priority first
        // For end events at same index, higher priority first
        if (a.type === "start") {
          return a.priority - b.priority;
        } else {
          return b.priority - a.priority;
        }
      }
    }
  });

  // Step 4: Process the escaped string and apply styles
  let output = "";
  let eventIndex = 0;

  for (let pos = 0; pos <= escapedString.length; pos++) {
    // Process events at position pos
    while (eventIndex < events.length && events[eventIndex].index === pos) {
      let event = events[eventIndex];
      if (event.type === "start") {
        // Append start wrapper
        output += getStartWrapper(event.style, event.additionalData);
      } else {
        // Append end wrapper
        output += getEndWrapper(event.style, event.additionalData);
      }
      eventIndex++;
    }

    // Append character at pos
    if (pos < escapedString.length) {
      output += escapedString[pos];
    }
  }

  return output;
}

// Helper functions to get start and end wrappers
function getStartWrapper(style: string, additionalData?: string): string {
  switch (style) {
    case "bold":
      return "_";
    case "italic":
      return "*";
    case "code":
      return "`";
    case "mark":
      return "|";
    case "link":
      return "~~{";
    case "email":
      return "@@{";
    default:
      return "";
  }
}

function getEndWrapper(style: string, additionalData?: string): string {
  switch (style) {
    case "bold":
      return "_";
    case "italic":
      return "*";
    case "code":
      return "`";
    case "mark":
      return "|";
    case "link":
      return "}{" + (additionalData || "") + "}~~";
    case "email":
      return "}{" + (additionalData || "") + "}@@";
    default:
      return "";
  }
}
