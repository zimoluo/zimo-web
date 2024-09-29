"use client";

import { readEntryOnClient } from "@/lib/dataLayer/client/clientEntryReader";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/widgets/LoadingScreen";
import blogWindowStyle from "../blog/blog-window.module.css";
import { useEntryWindow } from "@/components/contexts/EntryWindowContext";
import _ from "lodash";
import ErrorScreen from "@/components/widgets/ErrorScreen";
import ManagementWindowReader from "./ManagementWindowReader";

interface Props {
  slug: string;
}

export default function ManagementWindowLoader({ slug }: Props) {
  const [entry, setEntry] = useState<ManagementArticle | null>(null);
  const [isError, setIsError] = useState(false);
  const { contentRef } = useEntryWindow();

  const readEntry = async () => {
    const entry = (await readEntryOnClient(slug, "about/text", "markdown", [
      "title",
      "date",
      "slug",
      "content",
      "description",
      "unlisted",
    ])) as ManagementArticle;

    if (_.isEmpty(entry)) {
      setIsError(true);
      return;
    }

    setIsError(false);

    setEntry({
      ...entry,
      slug,
    });
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
      className={`w-full h-full overflow-y-auto ${blogWindowStyle.padding} pt-14 pb-8 bg-widget-90 relative`}
      ref={contentRef}
    >
      <ManagementWindowReader {...entry} />
    </div>
  );
}
