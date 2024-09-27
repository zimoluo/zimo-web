import { getComments } from "@/lib/dataLayer/server/commentManager";
import { CommentProvider } from "../contexts/CommentContext";
import CommentTypingArea from "./CommentTypingArea";
import CommentCardContainer from "./CommentCardContainer";

interface Props {
  location: string;
  likeIconType?: LikeIconType;
}

export default async function CommentAreaBundle({
  location,
  likeIconType,
}: Props) {
  return (
    <CommentProvider
      location={location}
      initialComments={await getComments(location)}
      likeIconType={likeIconType}
    >
      <CommentTypingArea />
      <div className="h-10 pointer-events-none select-none" />
      <CommentCardContainer />
    </CommentProvider>
  );
}
