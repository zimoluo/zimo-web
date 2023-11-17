import { getEntryLike } from "@/lib/dataLayer/server/commentManager";
import EntryLikeButton from "./EntryLikeButton";

interface Props {
  resourceLocation: string;
}

export default async function EntryLikeButtonInitializer({
  resourceLocation,
}: Props) {
  return (
    <EntryLikeButton
      resourceLocation={resourceLocation}
      initialLikedBy={await getEntryLike(resourceLocation)}
    />
  );
}
