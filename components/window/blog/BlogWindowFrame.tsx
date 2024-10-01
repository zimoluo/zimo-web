import BlogWindowMenu from "./BlogWindowMenu";
import BlogWindowLoader from "./BlogWindowLoader";
import EntryWindowFrame from "../EntryWindowFrame";

interface Props {
  presetSlug?: string;
}

export default function BlogWindowFrame({ presetSlug = "" }: Props) {
  return (
    <EntryWindowFrame
      presetSlug={presetSlug}
      MenuComponent={BlogWindowMenu}
      LoaderComponent={BlogWindowLoader}
    />
  );
}
