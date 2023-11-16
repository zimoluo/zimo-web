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
    const { filePath, commentIndex, replyIndex, existingReply } =
      await request.json();

    if (!allowedCommentPath.test(filePath)) {
      throw new Error("Illegal file path to be uploaded.");
    }

    const tokenUserSub = getSubFromSessionToken(
      cookies().get("session_token")?.value || ""
    );

    if (tokenUserSub === null) {
      throw new Error("No user is deleting this comment.");
    }

    const downloadedComments = await getComments(filePath);

    const targetComment = downloadedComments[commentIndex];
    if (
      !targetComment ||
      !targetComment.replies ||
      !targetComment.replies[replyIndex]
    ) {
      throw new Error("Reply to be deleted does not exist.");
    }

    const targetReply = targetComment.replies[replyIndex];

    const { state: tokenUserState } = (await getUserDataBySub(tokenUserSub, [
      "state",
    ])) as unknown as { state: UserState };

    if (tokenUserState === "banned") {
      throw new Error("User is banned.");
    }

    if (
      targetReply.from !== existingReply.from ||
      targetReply.content !== existingReply.content ||
      targetReply.date !== existingReply.date ||
      (targetReply.to
        ? targetReply.to !== existingReply.to
        : !!existingReply.to) // Check 'to' if it exists
    ) {
      throw new Error(
        "Server reply and client reply do not match. Please refresh the page."
      );
    }

    if (targetReply.from !== tokenUserSub && tokenUserState !== "admin") {
      throw new Error(
        "User either is not admin or is not deleting their own reply."
      );
    }

    const updatedComment = {
      ...targetComment,
      replies: targetComment.replies.filter((_, i) => i !== replyIndex),
    };

    const updatedComments = downloadedComments.map((comment, i) =>
      i === commentIndex ? updatedComment : comment
    );

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
