"use client";

interface Props {
  entry: string;
  setEntry: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ColorEditorTypingArea({
  entry,
  setEntry,
  placeholder,
  className = "",
}: Props) {
  return (
    <textarea
      value={entry}
      onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEntry(event.target.value);
      }}
      className={`w-full px-3 pt-2 h-40 text-base pb-8 rounded-xl shadow-sm border-0.4 border-primary border-opacity-20 bg-transparent bg-widget-70 resize-none placeholder:text-saturated placeholder:text-opacity-70 my-2 ${className}`}
      placeholder={placeholder}
    />
  );
}
