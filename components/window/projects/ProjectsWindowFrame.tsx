import ProjectsWindowMenu from "./ProjectsWindowMenu";
import ProjectsWindowLoader from "./ProjectsWindowLoader";
import EntryWindowFrame from "../EntryWindowFrame";

interface Props {
  presetSlug?: string;
}

export default function ProjectsWindowFrame({ presetSlug = "" }: Props) {
  return (
    <EntryWindowFrame
      presetSlug={presetSlug}
      MenuComponent={ProjectsWindowMenu}
      LoaderComponent={ProjectsWindowLoader}
      direction="right"
    />
  );
}
