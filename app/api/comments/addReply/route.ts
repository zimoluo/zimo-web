import {
  allowedCommentPath,
  maxReplyCharacterCount,
} from "@/lib/constants/security";
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
    const { filePath, newReply, commentIndex } = await request.json();

    if (!allowedCommentPath.test(filePath)) {
      throw new Error("Illegal file path to be uploaded.");
    }

    const tokenUserSub = getSubFromSessionToken(
      cookies().get("session_token")?.value || ""
    );

    if (tokenUserSub === null) {
      throw new Error("No user is deleting this comment.");
    }

    if (newReply.from !== tokenUserSub) {
      throw new Error("User sending comment does not match token.");
    }

    if (newReply.content.length > maxReplyCharacterCount) {
      throw new Error("Reply is too long to be sent.");
    }

    const { state: tokenUserState } = (await getUserDataBySub(tokenUserSub, [
      "state",
    ])) as unknown as { state: UserState };

    if (tokenUserState === "banned") {
      throw new Error("User is banned.");
    }

    newReply.date = new Date().toISOString();

    const downloadedComments = await getComments(filePath);

    const updatedComments = downloadedComments.map((comment, i) => {
      if (i !== commentIndex) return comment;

      const replies = comment.replies || [];

      return {
        ...comment,
        replies: [...replies, newReply],
      };
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
