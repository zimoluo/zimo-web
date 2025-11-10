import {
  deleteUserFile,
  getSubFromSessionToken,
  getUserDataBySub,
} from "@/lib/dataLayer/server/accountStateManager";
import { cookies } from "next/headers";

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const sub = url.searchParams.get("sub");

    if (!sub) {
      throw new Error("Missing required 'sub' parameter");
    }

    const tokenUser = await getSubFromSessionToken(
      (await cookies()).get("session_token")?.value || ""
    );

    if (sub !== tokenUser) {
      throw new Error("The user to be deleted is not the current user.");
    }

    const { state } = (await getUserDataBySub(sub, ["state"])) as {
      state: UserState;
    };

    if (state === "banned") {
      throw new Error(
        "The user to be deleted is banned. Banned user cannot delete their account by themselves. Please contact admin."
      );
    }

    const result = await deleteUserFile(sub);

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in deleting user:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
