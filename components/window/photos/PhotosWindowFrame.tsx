import PhotosWindowMenu from "./PhotosWindowMenu";
import PhotosWindowLoader from "./PhotosWindowLoader";
import EntryWindowFrame from "../EntryWindowFrame";

interface Props {
  presetSlug?: string;
}

export default function PhotosWindowFrame({ presetSlug = "" }: Props) {
  return (
    <EntryWindowFrame
      presetSlug={presetSlug}
      MenuComponent={PhotosWindowMenu}
      LoaderComponent={PhotosWindowLoader}
      direction="right"
    />
  );
}
