import { getComments } from "@/lib/dataLayer/server/commentManager";
import { CommentProvider } from "../contexts/CommentContext";
import CommentCardContainer from "./CommentCardContainer";

interface Props {
  location: string;
}

export default async function CommentSection({ location }: Props) {
  const initialComments = await getComments(location);

  return (
    <CommentProvider location={location} initialComments={initialComments}>
      <CommentCardContainer />
    </CommentProvider>
  );
}
