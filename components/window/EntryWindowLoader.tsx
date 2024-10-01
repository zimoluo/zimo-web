import { useEffect, useState, ReactNode } from "react";
import { readEntryOnClient } from "@/lib/dataLayer/client/clientEntryReader";
import LoadingScreen from "@/components/widgets/LoadingScreen";
import ErrorScreen from "@/components/widgets/ErrorScreen";
import _ from "lodash";
import { useEntryWindow } from "@/components/contexts/EntryWindowContext";

interface Props<T> {
  slug: string;
  entryType: string;
  entryFormat: "json" | "markdown";
  fields: string[];
  renderContent: (entry: T) => ReactNode;
  modifyEntry?: (entry: T) => T;
}

export default function EntryWindowLoader<T extends { slug: string }>({
  slug,
  entryType,
  entryFormat,
  fields,
  renderContent,
  modifyEntry,
}: Props<T>) {
  const [entry, setEntry] = useState<T | null>(null);
  const [isError, setIsError] = useState(false);
  const { contentRef } = useEntryWindow();

  const readEntry = async () => {
    const fetchedEntry = (await readEntryOnClient(
      slug,
      entryType,
      entryFormat,
      fields
    )) as T;

    if (_.isEmpty(fetchedEntry)) {
      setIsError(true);
      return;
    }

    setIsError(false);

    const modifiedEntry = modifyEntry
      ? modifyEntry({ ...fetchedEntry, slug })
      : { ...fetchedEntry, slug };

    setEntry(modifiedEntry);
  };

  useEffect(() => {
    readEntry();
  }, [slug]);

  if (isError) {
    return <ErrorScreen className="bg-widget-90" />;
  }

  if (!entry) {
    return <LoadingScreen className="bg-widget-90" />;
  }

  return (
    <div
      className="w-full h-full overflow-y-auto bg-widget-90 relative"
      ref={contentRef}
    >
      {renderContent(entry)}
    </div>
  );
}
