interface NotebookData {
  lastEditedDate: string;
  date: string;
  content: string;
}

interface NotebookPageStyleData {
  fromIndex: number;
  toIndex: number;
  style: "bold" | "italic" | "code" | "mark" | "link" | "email";
  additionalData?: string;
}
