import { allowedCommentPath } from "@/lib/constants/security";
import {
  getSubFromSessionToken,
  getUserDataBySub,
} from "@/lib/dataLayer/server/accountStateManager";
import {
  getComments,
  uploadCommentsToServer,
} from "@/lib/dataLayer/server/commentManager";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { filePath, index, existingComment } = await request.json();

    if (!allowedCommentPath.test(filePath)) {
      throw new Error("Illegal file path to be uploaded.");
    }

    const tokenUserSub = getSubFromSessionToken(
      (await cookies()).get("session_token")?.value || ""
    );

    if (tokenUserSub === null) {
      throw new Error("No user is deleting this comment.");
    }

    const { state: tokenUserState } = (await getUserDataBySub(tokenUserSub, [
      "state",
    ])) as unknown as { state: UserState };

    if (tokenUserState === "banned") {
      throw new Error("User is banned.");
    }

    const downloadedComments = await getComments(filePath);

    const targetComment = downloadedComments[index];

    if (!targetComment) {
      throw new Error("Comment to be deleted does not exist.");
    }

    if (
      targetComment.author !== existingComment.author ||
      targetComment.content !== existingComment.content ||
      targetComment.date !== existingComment.date
    ) {
      throw new Error(
        "Server comment and client comment do not match. Please refresh the page and try again."
      );
    }

    const updatedComments = downloadedComments!.map((comment, i) => {
      if (i !== index) return comment;

      if (comment.likedBy.includes(tokenUserSub)) {
        return {
          ...comment,
          likedBy: comment.likedBy.filter((sub) => sub !== tokenUserSub),
        };
      } else {
        return {
          ...comment,
          likedBy: [...comment.likedBy, tokenUserSub],
        };
      }
    });

    await uploadCommentsToServer(filePath, updatedComments);

    return new Response(JSON.stringify({ success: true, updatedComments }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in liking comment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
