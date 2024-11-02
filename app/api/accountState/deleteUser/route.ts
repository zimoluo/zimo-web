import {
  deleteUserFile,
  getSubFromSessionToken,
  getUserDataBySub,
} from "@/lib/dataLayer/server/accountStateManager";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { sub } = await request.json();
    const tokenUser = getSubFromSessionToken(
      cookies().get("session_token")?.value || ""
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
