import { allowedEntryLikePath } from "@/lib/constants/security";
import {
  getSubFromSessionToken,
  getUserDataBySub,
} from "@/lib/dataLayer/server/accountStateManager";
import {
  getEntryLike,
  uploadEntryLikeToServer,
} from "@/lib/dataLayer/server/commentManager";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { filePath } = await request.json();

    if (!allowedEntryLikePath.test(filePath)) {
      throw new Error("Illegal file path to be uploaded.");
    }

    const downloadedLikedBy = await getEntryLike(filePath);

    const tokenUserSub = getSubFromSessionToken(
      cookies().get("session_token")?.value || ""
    );

    if (tokenUserSub === null) {
      throw new Error("No user is making the like.");
    }

    const { state: tokenUserState } = (await getUserDataBySub(tokenUserSub, [
      "state",
    ])) as unknown as { state: UserState };

    if (tokenUserState === "banned") {
      throw new Error("User is banned.");
    }

    if (downloadedLikedBy === null) {
      throw new Error("Could not fetch likedBy data.");
    }

    let updatedLikedBy = downloadedLikedBy;

    if (downloadedLikedBy.includes(tokenUserSub)) {
      updatedLikedBy = downloadedLikedBy.filter((sub) => sub != tokenUserSub);
    } else {
      updatedLikedBy = [...downloadedLikedBy, tokenUserSub];
    }

    await uploadEntryLikeToServer(filePath, updatedLikedBy);

    return new Response(JSON.stringify({ updatedLikedBy }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in updating like:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
