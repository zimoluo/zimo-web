import { CommentProvider } from "../contexts/CommentContext";
import CommentCardContainer from "./CommentCardContainer";
import { getCachedComments } from "@/lib/dataLayer/server/commentCachedLoader";

interface Props {
  location: string;
}

export const revalidate = 0;

export default async function CommentSection({ location }: Props) {
  return (
    <CommentProvider
      location={location}
      initialComments={await getCachedComments(location)}
    >
      <CommentCardContainer />
    </CommentProvider>
  );
}
