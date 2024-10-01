import ManagementWindowMenu from "./ManagementWindowMenu";
import ManagementWindowLoader from "./ManagementWindowLoader";
import EntryWindowFrame from "../EntryWindowFrame";

interface Props {
  presetSlug?: string;
}

export default function ManagementWindowFrame({ presetSlug = "" }: Props) {
  return (
    <EntryWindowFrame
      presetSlug={presetSlug}
      MenuComponent={ManagementWindowMenu}
      LoaderComponent={ManagementWindowLoader}
    />
  );
}
