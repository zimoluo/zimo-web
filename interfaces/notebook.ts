interface NotebookData {
  lastEditedDate: string;
  date: string;
  content: string;
  contentStyles: NotebookPageStyleData[];
}

interface NotebookPageStyleData {
  fromIndex: number;
  toIndex: number;
  style: "bold" | "italic" | "code" | "mark" | "link" | "email";
  additionalData?: string;
}
