import { getComments } from "@/lib/dataLayer/server/commentManager";
import { CommentProvider } from "../contexts/CommentContext";
import CommentCardContainer from "./CommentCardContainer";

interface Props {
  location: string;
}

export default async function CommentSection({ location }: Props) {
  return (
    <CommentProvider
      location={location}
      initialComments={await getComments(location)}
    >
      <CommentCardContainer />
    </CommentProvider>
  );
}
