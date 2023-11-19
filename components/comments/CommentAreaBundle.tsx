import { getComments } from "@/lib/dataLayer/server/commentManager";
import { CommentProvider } from "../contexts/CommentContext";
import CommentTypingArea from "./CommentTypingArea";
import CommentCardContainer from "./CommentCardContainer";

interface Props {
  location: string;
}

export default async function CommentAreaBundle({ location }: Props) {
  return (
    <CommentProvider
      location={location}
      initialComments={await getComments(location)}
    >
      <CommentTypingArea />
      <div className="h-10 pointer-events-none select-none" />
      <CommentCardContainer />
    </CommentProvider>
  );
}
