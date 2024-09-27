import { getEntryLike } from "@/lib/dataLayer/server/commentManager";
import EntryLikeButton from "./EntryLikeButton";

interface Props {
  resourceLocation: string;
  likeIconType?: LikeIconType;
}

export default async function EntryLikeButtonInitializer({
  resourceLocation,
  likeIconType,
}: Props) {
  return (
    <EntryLikeButton
      resourceLocation={resourceLocation}
      initialLikedBy={await getEntryLike(resourceLocation)}
      likeIconType={likeIconType}
    />
  );
}
