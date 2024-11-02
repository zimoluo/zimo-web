import {
  getSubFromSessionToken,
  getUserDataBySub,
  uploadUserToServer,
} from "@/lib/dataLayer/server/accountStateManager";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { sub } = await request.json();

    const tokenUserSub = getSubFromSessionToken(
      (await cookies()).get("session_token")?.value || ""
    );

    if (tokenUserSub === null) {
      throw new Error("No user is deleting this comment.");
    }

    const { state: tokenUserState } = (await getUserDataBySub(tokenUserSub, [
      "state",
    ])) as unknown as { state: UserState };

    if (tokenUserState !== "admin") {
      throw new Error("User is not authorized to ban users.");
    }
    let newUserState: UserState = "normal";

    const {
      state: downloadedUserState,
      name,
      profilePic,
      websiteSettings,
    } = (await getUserDataBySub(sub, [
      "name",
      "profilePic",
      "state",
      "websiteSettings",
    ])) as unknown as UserData;
    if (downloadedUserState === "admin") {
      throw new Error(
        "The user to be banned is an admin, which cannot be banned."
      );
    }
    if (downloadedUserState === "normal") {
      newUserState = "banned";
    }

    const securedUser = {
      name,
      profilePic,
      websiteSettings,
      state: newUserState,
    };

    const result = await uploadUserToServer(securedUser, sub);

    revalidatePath("/");

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in banning user:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
